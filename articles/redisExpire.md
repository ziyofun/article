# Redis 键空间通知

----

工作中遇到如下问题，一个传输周期为1小时的传感器，会每小时上行一次数据，当某一次该上行数据却未能及时上行时需要将其置为“失联”状态。这是一个标准的延迟队列需求，直觉想法是使用成熟的队列方案来做，但是全部都要引入外部依赖，在谷歌解决方案时发现只用redis也可以提供解决方案，答案就是键空间通知。简而言之，redis中的键对应各种操作（SET、DEL、RENAME）都有事件，当然也包括EXPIRE，当这些事件触发时redis会进行广播，而事件的订阅者则会收到事件的key。键空间通知有两个缺点，第一个，redis的事件类似于UDP，并不保证到达，更没有重试机制，不过我的场景对数据的严谨性没那么高，所以可以通过辅助手段矫正偏差；第二个缺点就是redis在广播时实际上这个值已经被删除了，所以你只能拿到键，拿不到对应的值，这也是它叫做键空间通知的原因，所以如果有大量的数据可能需要其他的存储辅助。不过这些缺点对我的场景都不是问题，下面可以看一下怎么实现一个键空间通知。

1. 为redis设定正确的配置。需要在 redis.conf 文件中将 notify-keyspace-events 参数设定为以下字段的某种组合(该配置默认为空，表示关闭)

    | 字符 | 发送的通知 |
    |:--:|:--|
    | K | 键空间通知，所有通知以 __keyspace@<db>__ 为前缀 |
    | E | 键事件通知，所有通知以 __keyevent@<db>__ 为前缀 |
    | g | DEL 、 EXPIRE 、 RENAME 等类型无关的通用命令的通知 |
    | $ | 字符串命令的通知 |
    | l | 列表命令的通知 |
    | s | 集合命令的通知 |
    | h | 哈希命令的通知 |
    | z | 有序集合命令的通知 |
    | x | 过期事件：每当有过期键被删除时发送 |
    | e | 驱逐(evict)事件：每当有键因为 maxmemory 政策而被删除时发送 |
    | A | 参数 g$lshzxe 的别名 |

2. 需要对想要监听的事件添加注册

```bash
    # redis 的键空间通知有两种：
    # 一种是注册指定键的所有事件，用 __keyspace@[index值，用*表示全局]__:[键值] 表示；
    # 另一种是注册指定事件的所有键，用 __keyevent@[index值，用*表示全局]__:[事件名] 表示。

    # 也可以使用以下命令订阅所有键通知
    $ redis-cli psubscribe '__key*__:*'

    # 此时使用命令
    $ redis-cli SET 'foo' 'bar'
    # 可以得到如下打印
    1) "pmessage"
    # 订阅规则
    2) "__key*__:*"
    # 表示这是一个 index:0 中的键空间通知，foo表示对应的键名
    3) "__keyspace@0__:foo"
    # 表示发生的事件
    4) "set"

    1) "pmessage"
    2) "__key*__:*"
    # 表示这是一个 index:0 中的键事件通知，set表示对应的事件
    3) "__keyevent@0__:set"
    4) "foo"
```

还是比较简单方便的，redis的Node.js依赖对这些功能也是支持的：

```javascript
    // 这里使用的是 ioRedis 依赖
    const { Redis } = require('../lib/connection');
    const RedisListener = Redis.duplicate();
    RedisListener.select(config.redis.dataDvIndex);

    // 进行监听
    RedisListener.on('message', function(key) => {
        // 拿到过期的key
    });

    // 进行订阅
    RedisListener.subscribe(CHANNELKEY, function(err) {
        
    });

```

而对于可能的丢包情况我选择使用轮训的方式进行纠正，还是一个比较简单有效的解决方案。但是使用了一段时间后发现，推送总有一定时间的延迟，少的几秒多的几分钟，开始变得不可接受，查询的redis的文档后发现redis的过期策略是这样的：

> ### How Redis expires keys
    Redis keys are expired in two ways: a passive way, and an active way.

    A key is passively expired simply when some client tries to access it, and the key is found to be timed out.

    Of course this is not enough as there are expired keys that will never be accessed again. These keys should be expired anyway, so periodically Redis tests a few keys at random among keys with an expire set. All the keys that are already expired are deleted from the keyspace.

    Specifically this is what Redis does 10 times per second:

    Test 20 random keys from the set of keys with an associated expire.
    Delete all the keys found expired.
    If more than 25% of keys were expired, start again from step 1.
    This is a trivial probabilistic algorithm, basically the assumption is that our sample is representative of the whole key space, and we continue to expire until the percentage of keys that are likely to be expired is under 25%

    This means that at any given moment the maximum amount of keys already expired that are using memory is at max equal to max amount of write operations per second divided by 4.

其实仔细想一下，几乎所有的延时设计归结到底都是轮询（小声bb: 只不过redis这个解决方案太简单粗暴了），误差是难免的，那么缩小误差的方法就显而易见了，要么增加轮训的次数（修改配置）要么多开辟线程（使用多个redis）。不用想也知道前者最直接，后者最有效，对应轮询次数的配置在 redis.conf 中描述如下：

```bash
    # Redis calls an internal function to perform many background tasks, like
    # closing connections of clients in timeout, purging expired keys that are
    # never requested, and so forth.
    #
    # Not all tasks are performed with the same frequency, but Redis checks for
    # tasks to perform according to the specified "hz" value.
    #
    # By default "hz" is set to 10. Raising the value will use more CPU when
    # Redis is idle, but at the same time will make Redis more responsive when
    # there are many keys expiring at the same time, and timeouts may be
    # handled with more precision.
    #
    # The range is between 1 and 500, however a value over 100 is usually not
    # a good idea. Most users should use the default of 10 and raise this up to
    # 100 only in environments where very low latency is required.

    hz 10
```
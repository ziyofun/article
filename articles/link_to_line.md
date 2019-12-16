### line账户联结

【官方推荐】line帐号需要依照下述步骤与其他系统帐号进行绑定

![帐号绑定](https://developers.line.biz/media/messaging-api/linking-accounts/sequence-f0747c60.png)

绑定流程：

0. 用户在【chatbot中主动】发起link操作
1. bot server收到请求，附带用户的lineId向line平台请求一个lineToken

    ```shell
    $ curl -X POST https://api.line.me/v2/bot/user/{userId}/linkToken \
    -H 'Authorization: Bearer {channel access token}'
    ```

2. line平台收到请求校验合法性后，返回lineToken

    ```json
    {
        "linkToken": "NMZTNuVrPTqlr2IF8Bnymkb7rXfYv5EY"
    }
    ```

3. bot server使用此lineToken组织一个向link链接发送给line
4. line平台会将此link链接转发给用户
5. 用户点击此link链接
6. 业务平台向用户展示登录框以校验用户身份
7. 用户需要输入密码
8. 密码验证成功后业务平台可以得到用户ID，生成一个独一无二的nonce
9. 因为此时业务服务器拥有linkToken，以及nonce，所以可以生成一个如下的endpoint链接

    ```shell
    https://access.line.me/dialog/bot/accountLink?linkToken={link token}&nonce={nonce}
    ```
10. 用户点击此链接后，line平台会确认此用户和lineToken的对应性关系
11. line平台核查无误后会向bot server推送事件

    ```json
    {
        "type": "accountLink",
        "replyToken": "b60d432864f44d079f6d8efe86cf404b",
        "source": {
            "userId": "U91eeaf62d...",
            "type": "user"
        },
        "timestamp": 1513669370317,
        "link": {
            "result": "ok",
            "nonce": "xxxxxxxxxxxxxxx"
        }
    }
    ```
12. bot server可以拿到两份授信的用户ID和none，从而建立起可信的用户连接

#### 为什么line连接用户需要这么多步骤

主要是为了解决授信问题，整个连接操作中涉及到三方通信，即用户、line和业务方，连接的实质是如何使用安全的方式将line中的用户id和业务方中的用户id对应起来。整个流程是一个堆栈结构，获取token1～4步以及验证token9～12步是为了解决“line知道当前操作者是谁”的问题，而操作的5～8步是用户和业务平台之间的交互，用来解决“业务方知道当前操作者是谁”的问题。5～8步可以看作一个子作用域，其他步骤可以看作外部作用域，token就是外部作用域传入子作用域的参数，子作用域验证完成之后再将结果附带此参数返回从而达到整个过程的安全可信。

#### 有没有更简便的办法

line连接其他帐号的逻辑（或者说作用域嵌套关系）与微信恰好相反，5～8步实质是生成一个验证码（即nonce），生成验证码这一步完全可以通过已登录平台来生成，以二维码的形式，在微信中用户直接扫描此二维码即可向微信平台发送请求，微信平台校验此用户后将此二维码解析，得到公众号平台地址将用户ID、参数发送给公众号服务器，参见[微信公众平台文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1443433542)，如此一来公众号服务器即可将此公众号粉丝与此验证码所对应的用户连接起来。可以看到在微信中所有操作并未减少任何一步，但是可以通过前置条件（生成验证码也需要输入密码）省略一些不必要的操作，如用户点击link，输入用户名密码等等。由于目前line对二维码的支持功能的欠缺用户无法通过扫描二维码向line发送请求，更不支持带参二维码，所以在同等安全性要求下暂时没有更简便的办法。

#### 那么放弃一部分的安全性呢

如果利用已登录的web端做帐号联结，可以使用已登录的用户获取临时token，用户直接将此token发送至bot即可，因为用户ID可以在webhook的消息中获取所以可以得到token和用户ID，参见[line开发者文档](https://developers.line.biz/en/reference/messaging-api/#message-event)，在假定token没有安全性漏洞的情况下仍然可以达到绑定用户的目的。这和微信的带参二维码实际上是一致的，只是需要解决token的安全传输问题，生成token是一个平台，line是另一个平台，中间必不可少的是需要粘贴或者手动输入，安全性或者用户体验会打折扣，不过这已经是最简便的办法了。



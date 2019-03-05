# API 规范

------

### API

什么是API(Application Programming Interface)

0.是应用与外界交换数据的途径
1.软件系统不同组成部分交互的约定
2.是资源及操作的抽象

API的实现方式千差万别，特别是在语法机器灵活的Js中，但是评价API优良与否是有跨语言的一致性标准，语法清晰，简单明了，逻辑严谨，我们先从实现一套API最基础的要求，组织风格说起

### REST style

 什么是REST？REST(Representational State Transfer)
 
 0. 由Roy Thomas Fielding（HTTP规范的设计者）提出
 1. “表征状态转移”
 2. 是一种以资源为中心的API组织风格。
 
 我们可以逐字分析来理解其含义，“表征”或者说“表现”就是说资源的表现。隐藏在API后的资源原始格式形形色色，不局限于图片、视频、文本文件或者Databse，如上所说API是资源及操作的抽象，它需要依照请求者提供Accept所描述的格式（一般为JSON、XML等）在原始数据之上做出一个映射层，而API所展现出来的格式就是“表征”，这是资源的外在表现。而“状态转移”是指资源的变化，也就是一般所说的增删改等操作。顾名思义，REST风格的API就是围绕资源的表现形式和对应的各种操作所制定出的一套通用风格。它有以下几个特点：

 0. 围绕资源
  所有操作都有对应的表征，资源总是以某种表征展示，即序列化的信息
 1. 统一接口
  所有操作都有对应的HTTP method
    > GET（SELECT）：从服务器取出资源（一项或多项）。安全幂等

    > POST（CREATE）：在服务器新建一个资源。不安全不幂等

    > PUT（UPDATE）：在服务器更新资源（客户端提供完整资源数据）。不安全幂等

    > PATCH（UPDATE）：在服务器更新资源（客户端提供需要修改的资源数据）。不安全幂等
    
    > DELETE（DELETE）：从服务器删除资源。
 2. URI
  每种资源至少有一个URI与之对应，URI只表示资源，不表示其他任何东西
 3. 无状态
    > HTTP本身无状态

    > 单个请求的后果容易预见，风险边界容易把控

    > 提升系统的稳定性，容易提升内聚性，单个API只需要对自己的内部逻辑负责，对于指定的参数来说容易实现幂等性，便于测试
    
    > 提高可扩展性，降低耦合

 REST规范所涉及到的主要有以下几个部分：

 1. 协议：一般都是HTTP协议
 2. 域名：应该尽量将API部署在专用域名之下
 3. 路径：使用资源名称+动名词的格式, 如：
 
    > 单一资源:  /devices/:sn, /users/:user_id
    
    > 资源列表: /devices, /users

 4. 动词（方法）：一般如上所示
 5. 版本号：通常有两种方式，HTTP头或加到uri中，推荐后者，更简单直观
 6. 参数：一般get方法使用queryString，其他方法使用body
 7. 状态码：
    | 状态码 | 意义 | 请求方式 | 说明 |
    |:--- | :----: | :----: | :---- |
    | 200 | OK | [GET] | 服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。|
    | 201 | CREATED | [POST/PUT/PATCH] | 用户新建或修改数据成功。|
    | 202 | Accepted | [*] | 表示一个请求已经进入后台排队（异步任务）|
    | 204 | NO CONTENT | [DELETE] | 用户删除数据成功。|
    | 400 | INVALID REQUEST | [POST/PUT/PATCH] | 用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的 |
    | 401 | Unauthorized | [*] | 表示用户没有权限（令牌、用户名、密码错误）。|
    | 403 | Forbidden | [*]  | 示用户得到授权（与401错误相对），但是访问是被禁止的。|
    | 404 | NOT FOUND | [*] | 用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的|
    | 406 | Not Acceptable | [GET] | 用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）|
    | 410 | Gone | [GET] | 用户请求的资源被永久删除，且不会再得到的。|
    | 422 | Unprocesable entity | [POST/PUT/PATCH]  | 创建一个对象时，发生一个验证错误。|
    | 500 | INTERNAL SERVER ERROR | [*] | 服务器发生错误，用户将无法判断发出的请求是否成功。|

 ### 代码组织
 
 一般我们会把系统分层为controller > service > model, 但是实际上按系统规模来说，这样的分层方式往往显得过于粗暴，对于简单的系统可能都不需要service层，但是对于复杂的系统，这样的层级又往往满足不了解耦的要求，按图索骥往往会舍本逐末，其实理解好层级的定义恰到好处的完成系统的分层才是我们需要的，一般来说会分为这几个层级，

 1. 将各种请求映射到下一层的路由；
 2. 接收上一层的请求数据，做各种格式校验和序列化操作的处理层；
 3. 接收序列化后参数后作出相应动作的业务逻辑层；
    > 不可重用的业务逻辑层

    > 可重用的业务逻辑层
 4. 为业务逻辑层提供资源的数据存储层
    > 可对一些共用操作封装出DAO层
 5. 其他util和中间件

 当业务简单时，我们可以选择合并其中几个层来使得结构清晰，业务复杂时不可避免的要拆出多个层级，只要层级分得清楚，其他的概念都是无关痛痒的事

 ### 语法规范

 eslint

 ### 代码规范
  
  0. 面向对象 or 函数式
  1. 注释不厌精、文档不厌细，注释优于文档，多写注释和文档可以帮自己理清逻辑，找出更好的实现方案
  2. 函数内部catch，有利于内聚代码

  ```javascript
    async function searchDevices(params) {
        const devices = await Device.find(query);

        return devices
    }
    // 如果不自行catch，无法确保外部catch且错误名难以维护
    // 不建议在业务逻辑中写过多的try...catch，过多的样板代码会分隔逻辑，难于理解
    try {
        devices = searchDevices();
    } catch (error) {
        console.log('查询设备发生错误 :: ', error);
        throw createError();
    }
  ```
  3. 方法应有自己的参数校验，不能信任调用者；
  ```javascript
    // 校验参数加上上一条可以让整个方法最大程度可控，实际中可以免去很多调试的麻烦
    async function searchDevices({sn, owners}) {
        assert.equal(typeof sn, 'string');
        assert.equal(sn.length, 16);
        assert.equal(Object.isValid(owners), true);

        const devices = await Device.find(query);

        return devices
    }
  ```
  4. 不对过程进行封装，每次封装只做一件事；过程没有封装的价值，即使是重复的过程，而且会割裂业务逻辑
  5. 纯函数优于组装函数，组装函数往往会隐藏细节，增加代码阅读量，相比之下纯函数参数返回值更直观、更易编写测试
  ```javascript
    // 纯函数
    device.name = getDeviceName(device.sn));
    // 组装函数
    device = getDeviceName(device);
  ```
  6. 拒绝“重载”写法，分歧是混乱之源，尤其是对于解释语言
  ```javascript
    readOrWrite(value, operator) {
        if (operator === 'read') {
            return read(value);
        } else if (operator === 'write') {
            return write(value);
        }
    }
  ```
  7. 不重复造轮子，包括各种util等
  8. 为整个项目负责，如果有了更优秀的想法一定要整个项目实施，否则不如不改
  9. 不过度设计，需要分清可迭代设计和不可迭代设计

  ### 文档规范

  文档一般有两种，一种是外部文档，使用markdown或者HTML等语法编写，好处是比较自由，但是容易遗漏，代码对照也不方便。一种是内嵌文档，通过注释编写，好处是方便编写，不需要切换工具，缺点是容易是代码变得臃肿[apidoc](http://apidocjs.com/#param-api-deprecated)是一个在代码内编写注释同步生成文档的工具，建议只对需要对接接口编写注释文档并和router写在一起，方便文档的编写，语法比较简单，不支持复杂的文档格式，可以利用注释进行更详细的描述，[joi-router](https://github.com/koajs/joi-router)是一个支持在router配置中校验参数的koa依赖，两者结合可以这样编写文档

  ```javascript
   /**@api {put} /alarmplay/:alarmDisplayID 2.04 确认预警记录
     * @apiGroup 2.Alarm
     * @apiName alarmConfirm
     *
     * @apiDescription 人工确认一条预警记录状态
     *
     * @apiVersion 1.0.0
     *
     * @apiParam (alarm) {String} type 确认类型，枚举值: ['confirm', 'reconfirm'], 表示确认和重复确认
     * @apiParam (alarm) {Number} displayStatus 确认状态，枚举值: [0 ~ 4], 0:待确认, 1:真实火警, 2:误报, 3:测试/巡检, 4:安全隐患
     * @apiParam (alarm) {Number} [reason] 预警原因，枚举值: [0 ~ 8]
     *                 0: 其他, 1: 用电异常, 2: 生产作业, 3: 吸烟, 4: 室内生火, 
     *                 5: 烹饪, 6: 燃气泄漏, 7: 人为放火, 8: 易燃物自燃
     * @apiParam (alarm) {Number} [place] 预警发生场所，枚举值: [0 ~ 7]
     *                 0: 其他, 1: 小区, 2: 工厂, 3: 居民作坊,
     *                 4: 仓库, 5: 商铺店面, 6: 商场, 7: 出租房
     * @apiParam (alarm) {String} source 这次确认请求的来源，枚举值: ['app', 'platform'], 表示app或是web平台
     * @apiParam (alarm) {Array} [images] 预警图片，字符串格式数组，最多9张
     * @apiParam (alarm) {String} [remark] 预警备注，最多90个字符或30个汉字
     *
     * @apiSuccessExample Success-Response:
     *   HTTP/1.1 200 OK
     *     { 
     *          errcode: 0,
     *          // 确认完毕会返回整个预警记录及其确认结果
     *          data: { 
     *              _id: '59f14b9f92695c96b61f875f',
     *              owners: { 
     *                  _id: '507f1f77bcf86cd799100001',
     *                  nickname: 'dealers1',
     *                  grants: {},
     *                  id: '507f1f77bcf86cd799100001'
     *              },
     *              deviceSN: '10800117C6E0A396',
     *              appId: 'appId00001',
     *              alarmStatus: 2,
     *              unionType: 'humidity|temperature',
     *              deviceType: 'temp_humi',
     *              sensorData: { 
     *                  humidity: 31,
     *                  temperature: 30
     *              },
     *              rules: [{
     *                  "_id":"59f14b9f92695c96b61f875b",
     *                  "sensorTypes":"humidity",
     *                  "thresholds":0,
     *                  "conditionType":"gt"
     *              }],
     *              sensorType: 'humidity',
     *              createdTime: '2018-07-17T07:20:23.609Z',
     *              updatedTime: 1508899359000,
     *              isDeleted: false,
     *              records: [
     *                  {
     *                      "_id":"5b4d9996cbb35672a1253214",
     *                      "alarms":"59f14b9f92695c96b61f875f",
     *                      "sensorType":"humidity",
     *                      "updatedTime":1508985759954,
     *                      "type":"alarm",
     *                      "id":"5b4d9996cbb35672a1253214",
     *                      "_updatedTime":"2017-10-26 10:42:39"
     *                  },
     *                  {
     *                      "_id":"5b4d9996cbb35672a1253249",
     *                      "alarms":"59f14b9f92695c96b61f875f",
     *                      "name":"张三",
     *                      "source":"app",
     *                      "remark":"真实火灾",
     *                      "displayStatus":2,
     *                      "place": 4,
     *                      "reason": 6,
     *                      "updatedTime":1531812246426,
     *                      "images":["https://www.sensoro.com/zh/img/station/sensor-gas@2x.png"],
     *                      "type":"confirm",
     *                      "id":"5b4d9996cbb35672a1253249",
     *                      "_updatedTime":"2018-07-17 15:24:06"
     *                  }
     *              ],
     *              phoneList: [],
     *              displayStatus: 2,
     *              id: '59f14b9f92695c96b61f875f',
     *              _updatedTime: '2017-10-25 10:42:39'
     *          }
     *     }
     *
     * @apiUse NOT_LOGIN
     * @apiUse NO_PERMISSION
     * @apiUse TYPE_REQUIRED
     * @apiUse DISPLAY_STATUS_REQUIRED
     * @apiUse SOURCE_REQUIRED
     * @apiUse REMARK_OUT_OF_LIMIT
     * @apiUse ALARM_IMAGES_TYPE_ILLEGAL
     * @apiUse ALARM_REASON_ILLEGAL
     * @apiUse ALARM_PLACE_ILLEGAL
     * 
     * @apiErrorExample {json}
     *   HTTP/1.1 400 参数错误
     *   {
     *     "errcode": 4006003,
     *     "errmsg": "Source is required.",
     *     "errinfo": "确认来源不能为空"
     *   }
    */
    {
        method: 'put',
        path: '/alarmplay/:alarmDisplayID',
        validate: {
            type: 'json',
            body: {
                type: Joi.string().valid(['confirm', 'reconfirm']).required(),
                displayStatus: Joi.number().valid(DISPLAY_STATUS).required(),
                source: Joi.string().valid(['app', 'platform']).required(),
                images: Joi.array().items(Joi.string().max(256)).max(9),
                scenes: Joi.array().items(Joi.object().keys({
                    type: Joi.string().valid(['image', 'video']).required(),
                    url: Joi.string().required(),
                    thumbUrl: Joi.string()
                })).max(9),
                reason: Joi.number().valid(ALARM_REASON),
                place: Joi.number().valid(ALARM_PLACE),
                remark: Joi.string().max(100).allow('')
            },
            continueOnError: true
        },
        handler: [GrantAuth('modify', 'alarm'), Alarm.confirm]
    }
  ```
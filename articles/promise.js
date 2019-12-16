/**
 * 一份带注释的promise实现，来源详见 https://www.promisejs.org/implementing/
 */

// promise就是一个状态机，这里定义所有可能的状态常量
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(fn) {
    // 当前promise状态，默认为PENDING
    var state = PENDING;

    // 当前promise结果
    var value = null;

    // 存储成功或失败时应执行的方法
    var handlers = [];

    // 当前promise状态变向FULFILLED时所要执行的方法
    function fulfill(result) {
        state = FULFILLED;
        value = result;
        handlers.forEach(handle);
        handlers = null;
    }

    // 当前promise状态变向REJECTED时所要执行的方法
    function reject(error) {
        state = REJECTED;
        value = error;
        handlers.forEach(handle);
        handlers = null;
    }

    // resolve实现
    function resolve(result) {
        try {
            var then = getThen(result);
            if (then) {
                doResolve(then.bind(result), resolve, reject)
                return
            }
            fulfill(result);
        } catch (e) {
            reject(e);
        }
    }

    // 后续链式调用的promise参数将使用此方法注册进handlers中
    function handle(handler) {
        if (state === PENDING) {
            handlers.push(handler);
        } else {
            if (state === FULFILLED &&
                typeof handler.onFulfilled === 'function') {
                handler.onFulfilled(value);
            }
            if (state === REJECTED &&
                typeof handler.onRejected === 'function') {
                handler.onRejected(value);
            }
        }
    }

    // promise所封装的函数执行完毕时需要执行的方法
    this.done = function (onFulfilled, onRejected) {
        // 这里使用setTimeout确保所有的promise都是异步执行
        setTimeout(function () {
            handle({
                onFulfilled: onFulfilled,
                onRejected: onRejected
            });
        }, 0);
    }

    /**
     * 确保then返回的都是promise，将后续调用封装进一个promise实例中
     * onFulfilled、onRejected即为.then(() => {}, () => {}) 中可以传的函数参数
     */
    this.then = function (onFulfilled, onRejected) {
        var self = this;
        return new Promise(function (resolve, reject) {
            /**
             * 这里使用两个函数将onFulfilled、onRejected包装成新的onFulfilled、onRejected
             * 解决错误处理和类型判断问题
             */
            return self.done(function (result) {
                if (typeof onFulfilled === 'function') {
                    try {
                        return resolve(onFulfilled(result));
                    } catch (ex) {
                        return reject(ex);
                    }
                } else {
                    return resolve(result);
                }
            }, function (error) {
                if (typeof onRejected === 'function') {
                    try {
                        return resolve(onRejected(error));
                    } catch (ex) {
                        return reject(ex);
                    }
                } else {
                    return reject(error);
                }
            });
        });
    }

    doResolve(fn, resolve, reject);

    /**
     * 检查参数是否是promise，如果是需要将其 `then` 方法返回
     * 
     * @param {Promise|Any} value
     * @return {Function|Null}
     */
    function getThen(value) {
        var t = typeof value;
        if (value && (t === 'object' || t === 'function')) {
            var then = value.then;
            if (typeof then === 'function') {
                return then;
            }
        }
        return null;
    }

    /**
     * 接受promise封装的函数并确保promise的onFulfilled或onRejected方法只会被执行其中一个
     * 此方法不保证异步
     *
     * @param {Function} fn A resolver function that may not be trusted
     * @param {Function} onFulfilled
     * @param {Function} onRejected
     */
    function doResolve(fn, onFulfilled, onRejected) {
        var done = false;
        try {
            /**
             * 这里传给fn的两个参数就是实际使用时的resolve和reject函数
             * 它们分别封装的onFulfilled和onRejected才是真正执行状态变化的函数
             */
            fn(function (value) {
                // 利用done变量控制状态间切换只能执行一次
                if (done) return
                done = true
                onFulfilled(value)
            }, function (reason) {
                if (done) return
                done = true
                onRejected(reason)
            })
        } catch (ex) {
            if (done) return
            done = true
            onRejected(ex)
        }
    }
}
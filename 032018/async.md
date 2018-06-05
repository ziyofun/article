# 异步编程 —— 从callback到async
----------
Node.js以异步编程为IO密集型场景交出了一份令人眼前一亮的方案，但是本身还是有很多不足之处，而异步编程模式就是其中之一。早期的Node.js异步使用高阶函数callback的方式来满足异步回调，实际上是订阅了一个状态，当轮询时检查到状态已被满足则触发这个callback，这是最原始的方式。好处是，算了，其实没什么好处，只是当时除了高阶函数也没有更好的办法了，坏处就可有的说，比如深恶痛觉的callback hell：
```javascript
doFirst(thing1, () => {
    doSecond(thing2, () => {
        doThird(thing3, () => {
            // done
        })
    })
})
```
这种蛇形流动的代码在阅读时经常让人忘记自己在做什么，而且常常定义的前半部分在回调外，后半部分在回调里，代码逻辑被回调分隔开来，中间往往还夹杂的错误优先的handle校验，对开发者来说极其不友好。

Node.js中为了解决回调地狱往往会引入了一些Promise库，由于ES6还未到来，它们普遍遵循Promise/A+规范，Promise实际上是一个状态机，只会在pending到fulfilled或者rejected状态方向变化并把结果传递给对应的回调，这种状态变化不可逆，且任何回调中的返回值都是一个新的Promise：
```javascript
doFirst(thing1).then(() => {
    return doSecond(thing2)
}).then(() => {
    return doThird(thing3)
}).then(() => {
    // done
}).catch(() => {
    // handle error
})
```
嗯，比callback强太多了，回调地狱被铺平，错误处理也统一了，但是还是有一些不足之处，比如我还是要敲出很多`.then(() => {})`，这些`.then(() => {})`夹杂在逻辑中看多了也腻得慌，还有一个更常见的问题如果我需要把`doFirst(thing1)`的结果传递给最后的`done`逻辑中我该怎么办，hold这个变量往下传是一个办法，但之后每次的回调结果都必须是对象才行，代码平白无故多了很多析构，定义一个全局变量给它赋值也是一个办法，但是变量定义与赋值分离也就意味着代码质量的下降，使用地方不明，数据来源也需要追查，能不能更有追求一点呢？能！社区活跃就是有这点好处，敢想敢干，很多诉求都能被快速解决。

随着ES6的到来，Promise正式在ECMAcript中成为标准，同时也为我们带来的另一项特性，Generator。Generator也是一个状态机，分为“函数外”和“函数内”与Promise不同，它的状态可以循环变化，每次yield的时候可以将已执行部分挂起，交给yield的异步函数来执行，待到异步函数执行完毕，拿到结果，挂起的函数继续执行，如此可以用同步的语法来写异步代码，这也是现在异步代码的最佳实践。Generator的yield语法方便归方便，但是仍然需要一个执行器，比如`co.js`[https://github.com/tj/co],而ES7为我们带来了async/await语法，用法和Generator的yield一样，从此有了语言级别的协程语法。
```javascript
async function doSomeThing() {
    await doFirst(thing1);
    await doSecond(thing2);
    await doThird(thing3);
}
```
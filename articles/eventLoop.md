# Node.js 事件循环, Timers, 和 process.nextTick()

### 什么是事件循环？

Node.js通过事件循环来完成非阻塞I/O，尽管Javascript是单线程的，但是它可以通过将各种操作交给系统内核来执行。

因为大多数系统内核都是多线程的，它们可以在后台同时执行多个操作，当其中任意一个操作完成时，内核会通知Node.js，以便可以将相应的回调添加到轮询队列中以最终执行。我们将在本主题后面进一步详细解释

### 事件循环解释

当Node.js启动时，它会初始化事件循环，执行用户提供的脚本（或者放入REPL，本文档未涉及），这些脚本可能会进行异步API调用，调度计时器或调用process.nextTick（），然后开始执行事件循环。下图展示了一个事件循环的简易模型。

###### 注意：每一格都代表了事件循环的一个“阶段”

每个阶段都有一个要执行的回调FIFO队列。每个阶段所做的事情都各不相同，当事件循环进入一个给定的阶段时，将会执行这个阶段特有的操作。然后在该阶段的队列中执行回调，直到队列耗尽或回调执行次数到达上限。当队列耗尽或回调执行次数到达上限时，事件循环就会进入下一个阶段。

由于任何一个操作都有可能调度更多操作，从而产生的新事件都会被内核推进一个队列中，因此在轮询事件也会是一个队列操作。因此，长时间运行的回调可以允许轮询阶段的运行时间远远超过计时器的阈值。有关详细信息，请参阅计时器和轮询部分。

###### 注意：Windows和Unix / Linux实现之间存在轻微差异，但这对于此演示并不重要。实际上有七到八个步骤，但我们关心的是上面那些 Node.js实际使用的地方，这才是最重要的部分。

### 阶段概览

* timers：此阶段执行setTimeout（）和setInterval（）中的回调函数
* pending callbacks：此阶段执行延迟到下一个循环迭代的I / O回调。
* idle, prepare：仅在内部使用
* poll：检索新的I/O事件;执行与I/O相关的回调（除了关闭回调、定时器、setImmediate（）之外的几乎所有回调），node.js在适当的时候会在此阻塞住
* check：这里调用setImmediate（）回调函数
* close callbacks：一些关闭回调，比如socket.on('close', ...)

在事件循环的每次运行之间，Node.js都会检查是否还有任何未执行完毕的异步I/O或定时器，如果没有进程将会关闭。

### 阶段细节

#### timers

一个timer可以指定一个值，在经过该值之后提供的回调函数可能会被执行但并不是人们想要执行它的确切时间。timer的回调函数将在指定的时间过后尽早执行，然而，操作系统调度或其他回调的运行可能会延迟这一结果。

###### 注意：从技术上讲，轮询阶段决定了何时执行timer。

举个例子，假设您计划在100毫秒阈值后执行一个超时，然后您的脚本开始异步读取一个需要95毫秒的文件：

```javascript
    const fs = require('fs');

    function someAsyncOperation(callback) {
        // Assume this takes 95ms to complete
        fs.readFile('/path/to/file', callback);
    }

    const timeoutScheduled = Date.now();

    setTimeout(() => {
        const delay = Date.now() - timeoutScheduled;

        console.log(`${delay}ms have passed since I was scheduled`);
    }, 100);


    // do someAsyncOperation which takes 95 ms to complete
    someAsyncOperation(() => {
        const startCallback = Date.now();

        // do something that will take 10ms...
        while (Date.now() - startCallback < 10) {
            // do nothing
        }
    });
```

当事件循环进入poll阶段，会发现队列为空（因为fs.readFile()还没有执行完毕），所以线程将会等待直到达到最近一个timer的延迟要求。当时间过去了95毫秒时，fs.readFile()执行完毕，读取文件信息此时对应回调会被添加进poll阶段的队列中并被执行，从代码中可以看到这花费10毫秒。当读取文件的回调执行完毕后poll队列中已经没有函数了，此时会检查是否满足了timer的延时要求。在这个例子中你会看到timer的实际延迟会是105毫秒。

###### 注意：为了防止poll阶段阻塞住事件循环，libuv会有一个强制的最大值，来强制结束此阶段。

#### pending callbacks

此阶段执行某些系统操作的回调，例如TCP错误等。例如，如果TCP socket在尝试连接时收到ECONNREFUSED，则某些*nix系统希望等待报告错误。这些回调将在pending callbacks阶段的队列中被执行。

#### poll

poll阶段有两个主要功能：

1. 计算应该阻塞和轮询I/O的时间
2. 执行轮询队列中的事件。

当事件循环进入轮询阶段并且没有计划的timer时，将发生以下两种情况之一：

*. 如果轮询队列不为空，则事件循环将遍历同步执行队列中的回调，直到队列耗尽，或者达到系统相关的硬限制。
*. 如果轮询队列为空，则会发生另外两个事件之一:
    *. 如果存在setImmediate()调度的脚本，则事件循环将结束poll阶段并继续执行检查阶段以执行这些调度脚本。
    *. 如果不存在setImmediate()调度的脚本，则事件循环将等待将回调添加到队列，然后立即执行它们。

轮询队列为空后，事件循环将检查已达到时间阈值的timer。如果一个或多个timer准备就绪，事件循环将回到timer阶段以执行那些timer的回调（多执行一次）。

#### check

这个阶段允许在poll阶段完毕后立即执行一些回调函数，如果poll阶段空闲并且有被setImmediate()注册的脚本，则事件循环将不会继续在poll阶段等待而是跳转至check阶段执行这些脚本。

实际上setImmediate()是一个运行在单独阶段的特殊timer。它使用了libuv API设定一个回调，并将在poll阶段结束后执行。

一般来说，一旦代码被运行事件循环最终都将会进入poll阶段，在这个阶段等待新的连接、请求等等。然而，如果在此过程中有被setImmediate()注册的回调并且poll阶段已经空闲，它将会结束这个阶段转入check阶段而不是继续等待新的事件。

### close callbacks

如果一个socket或者句柄被突然关闭（比如：socket.destroy()），则‘close’事件将会在此阶段被触发。否则将会通过process.nextTick()来触发。

### setImmediate() vs setTimeout()

setImmediate()和setTimeout()大致相同，但是被执行的时机有所不同。

*. setImmediate() 被设计在poll阶段结束后执行一段代码。
*. setTimeout() 中的代码会在一段时间（以毫秒为单位）后执行。

这两个方法内脚本的执行顺序会因上下文的不同而不同。如果在主模块内执行，则执行顺序会受到进程性能的影响（宿主机上的其他应用会对此造成影响）。

举例来说，如果我们执行下面不在I/O循环内的代码，则它们的输出将会是不确定的，因为受到了进程性能的影响。

```javascript
    // timeout_vs_immediate.js
    setTimeout(() => {
        console.log('timeout');
    }, 0);

    setImmediate(() => {
        console.log('immediate');
    });
```

```
    $ node timeout_vs_immediate.js
    timeout
    immediate

    $ node timeout_vs_immediate.js
    immediate
    timeout
```

而如果我们把上述代码放进一个I/O操作回调内，则immediate永远会被先输出出来

```javascript
    // timeout_vs_immediate.js
    const fs = require('fs');

    fs.readFile(__filename, () => {
        setTimeout(() => {
            console.log('timeout');
        }, 0);
        setImmediate(() => {
            console.log('immediate');
        });
    });
```

```
    $ node timeout_vs_immediate.js
    immediate
    timeout

    $ node timeout_vs_immediate.js
    immediate
    timeout
```

setImmediate()相对于setTimeout()的一个主要优势是在一个包括I/O的事件循环内setImmediate()永远比setTimeout()先执行，这与注册了多少个timers无关。

### process.nextTick()

#### 理解 process.nextTick()

你可能发现了，虽然process.nextTick()也是一个异步API，但是它不在上述的任何一个阶段中。这实际上是因为从技术上来说process.nextTick()不算事件循环的一部分。nextTick形成的队列将会在当前阶段操作完成后立即执行，不论是事件循环的哪个阶段。这里我们定义一个‘操作’为一组需要C/C++层面处理的JavaScript代码。

回看我们的图表，你可以在任何一个阶段的任何一个时间调用process.nextTick()，而它们的回调都将在进入事件循环的下一个阶段前被执行。这可能会造成一些不好的情况，比如递归调用process.nextTick()会阻塞整个事件循环，在这种情况下，事件循环将永远无法到达poll阶段。

#### 为什么可以这样？

为什么Node.js中可以运行这样呢？这是设计理念的一部分，即：API应该是异步的，即使它不必是。以下面的代码为例：

```javascript
    function apiCall(arg, callback) {
        if (typeof arg !== 'string')
            return process.nextTick(callback,
                                    new TypeError('argument should be string'));
    }
```

这段代码执行了一个参数校验逻辑，如果未通过则将会把error信息传递给callback并返回。这个API最近更新为可以传参给process.nextTick()并允许它将任何数据放在callback后作为第二个参数，传给callback，所以你不需要再写任何嵌套代码了。

我们正在做的事情是将错误信息返回给用户但是我们允许用户其余代码执行完毕。使用process.nextTick()我们可以保证在剩余代码执行后且事件循环执行前运行apiCall()方法。为了实现这个效果，Node允许JS调用栈展开并立即执行对应的回调，所以在这种情况下不会到达V8的调用栈上限触发`RangeError: Maximum call stack size`错误。

这种设计理念会导致一些潜在问题，以下面的代码为例:

```javascript
    let bar;

    // this has an asynchronous signature, but calls callback synchronously
    function someAsyncApiCall(callback) { callback(); }

    // the callback is called before `someAsyncApiCall` completes.
    someAsyncApiCall(() => {
        // since someAsyncApiCall has completed, bar hasn't been assigned any value
        console.log('bar', bar); // undefined
    });

    bar = 1;
```

这里定义了一个异步语义的方法名，但是实际上是同步执行的，当上述脚本执行时，传给someAsyncApiCall()的函数会与其余部分在事件循环的同一阶段执行。作为结果，bar会输出undefined，因为代码还没执行完。

通过将回调放在process.nextTick（）中，脚本得以能够运行完成，并允许在调用回调之前初始化所有变量，函数等。阻止事件循环还有一些好处，在允许事件循环继续之前，有可能需要向用户提示警告错误。

以下是使用process.nextTick（）修改过的上个示例：

```javascript
    let bar;

    function someAsyncApiCall(callback) {
        process.nextTick(callback);
    }

    someAsyncApiCall(() => {
        console.log('bar', bar); // 1
    });

    bar = 1;
```

还有一个实际的例子:

```javascript
    const server = net.createServer(() => {}).listen(8080);

    server.on('listening', () => {});
```

当参数仅为端口时，回调函数会被立即执行，而这时 .on('listening') 事件还没有注册上，对应的回调函数会被漏掉。为了解决这个问题，可以将'listening'事件放进nextTick()中变为异步操作，如此一来，当前的脚本可以顺利执行完，事件监听不会被漏掉。

### 去重

在timers和check阶段，Node.js中C和Javascript代码会因为多个immediates和timers而存在单向转换。去重是一种优化手段，但会产生某些副作用，示例代码如下:

```javascript
    // dedup.js
    const foo = [1, 2];
    const bar = ['a', 'b'];

    foo.forEach(num => {
        setImmediate(() => {
            console.log('setImmediate', num);
            bar.forEach(char => {
            process.nextTick(() => {
                console.log('process.nextTick', char);
            });
            });
        });
    });
```

会输出

```bash
    $ node dedup.js

    setImmediate 1
    setImmediate 2
    process.nextTick a
    process.nextTick b
    process.nextTick a
    process.nextTick b
```

主线程增加了两个setImmediate()，它们将会分别增加两个process.nextTick()事件。当事件循环进行到check阶段时，将会检查到对应的setImmediate()事件，第一个事件被执行时将会打印出对应的`console.log('setImmediate', num);`内容，并且为`nextTickQueue`增加两个事件。

由于去重，事件循环并不会立刻切换至C/C++层去检查nextTickQueue内容。而是会继续执行其他的setImmediate()事件。当执行完毕时，两个setImmediate事件会增加4个nextTickQueue的事件。

当所有的setImmediate()事件被执行完毕时，`nextTickQueue`将会被检查，其中的事件将会按照FIFO队列顺序执行。当`nextTickQueue`也被执行完毕时，事件循环会认为当前阶段的所有操作已被执行完毕而进入下一个阶段。

### process.nextTick() vs setImmediate()

这两个方法在node中功能差不多，且它们的名字很有迷惑性。

* process.nextTick() 会在每个阶段中被执行。
* setImmediate() 会在event loop的后续阶段或者说某一特殊阶段中执行

实际上，它们两个的名字应该被交换一下，process.nextTick() 相对于 setImmediate() 更加符合‘立即执行’的描述，但是这是一个历史问题了，交换这两个名字会造成难以预计的后果。

我们建议开发者在所有情况下尽可能使用`setImmediate()`，因为它更容易理解且兼容性更好，比如对于浏览器端。

### 那为什么还有使用process.nextTick()的必要呢？

有两个原因：

1. 允许用户处理错误，清理任何不需要的资源，或者在事件循环进入下一个阶段时重试请求。
2. 在必要时允许回调在调用栈中的代码执行完毕但事件循环未进入下一阶段时被调用。

举个例子：

```javascript
const server = net.createServer();
server.on('connection', (conn) => { });

server.listen(8080);
server.on('listening', () => { });
```

在这种情况下，`listen()`会在事件循环开始前执行，如果将listening回调函数放进setImmediate()中。那么在poll阶段将会无法执行监听回调，这意味着存在一定概率在监听之前某些事情就被触发了。

另一个例子，在一个继承EventEmitter的类的构造函数中触发事件:

```javascript
    const EventEmitter = require('events');
    const util = require('util');

    function MyEmitter() {
        EventEmitter.call(this);
        this.emit('event');
    }
    util.inherits(MyEmitter, EventEmitter);

    const myEmitter = new MyEmitter();
        myEmitter.on('event', () => {
        console.log('an event occurred!');
    });
```

你会发现你不该立即在构造函数中触发这个事件，因为脚本还未执行到添加监听函数部分。所以你可以使用`process.nextTick()`将触发事件部分代码包装起来：

```javascript
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);

  // use nextTick to emit the event once a handler is assigned
  process.nextTick(() => {
    this.emit('event');
  });
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

# 循环依赖
------------
定义模块有时会遇到这种情况，模块 a.js 使用了模块 b.js 中的属性，而 b.js 也依赖了 a.js 中的方法，两者构成了循环依赖，循环依赖是项目中应极力避免的情况，这会造成项目模块高度耦合，关系难以理解不便于维护，然而难免会有这种情况的出现，循环依赖的模块间代码如何执行，其中原理很有必要了解一下。

先定义两个模块内容如下:
```javascript
    // a.js
    var { b } = require("./B");
    exports.a = true;
    console.log('b in a.js :: ', typeof b, b);

    // b.js
    var { a } = require("./A");
    exports.b = true;
    console.log('a in b.js :: ', typeof a, a);
```

此时执行`$ node a.js`会输出什么？

> b in a.js ::  undefined undefined

> a in b.js ::  boolean true

> b in a.js ::  boolean true

修改文件内容如下:

```javascript
    // a.js
    exports.a = true;
    var { b } = require("./B");
    console.log('b in a.js :: ', typeof b, b);

    // b.js
    exports.b = true;
    var { a } = require("./A");
    console.log('a in b.js :: ', typeof a, a);
```

此时执行`$ node a.js`会输出什么？

> b in a.js ::  boolean true

> a in b.js ::  boolean true

> b in a.js ::  boolean true

why？commonJS规范中遇到`require`时会跳转至目标文件执行，直到执行完毕或者再遇到`require`发生跳转。
所以考虑第一种情况
1. 执行`$ node a.js`命令，执行`var { b } = require("./B");`语句;
2. 跳转至b.js文件，然后执行`var { a } = require("./A")`;
3. 跳转回a.js，此时内存中缓存了a.js的执行进度，继续执行，因为b.js还未执行到exports所以a不能拿到b变量，输出undefined;
4. a.js执行完毕，跳转回b.js，此时 b.js 中 `require`语句执行完毕，可以拿到 a 的值;
5. b.js执行完毕，跳转回a，此时 a.js 中 `require` 执行完毕，可以拿到 b 的值;
全部执行完毕，可以看到 a.js require语句后面的部分执行了两次，第一次由 commonJS 规范执行，第二次由调用栈执行。按照这个逻辑第二种情况就不难分析了



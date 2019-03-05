# webpack中的代码

我们现在开发前端项目，基本上都是用React、Vue等现代框架了，模块化不必说、ES6/7语法更是家常便饭，但是这里有一个问题：我们项目中的代码使用的部分先进语法浏览器可能不认识，实际运行环境中更是没有模块化一说，那么我们写的代码是如何做到在浏览器中平滑运行的呢？这就是webpack（和它的各种插件）的功劳了。
其实不止模块化的ES6 modules或是CMD语法，SCSS、LESS、TypeScript等语法浏览器也是不认识的，这些代码需要一些转换，它们本身提供了编译器，而webpack及其插件当然也能做到，如Babel、css-loader等，这样所有的高端风骚的代码就变成了平淡无奇的ES5，css语句。而模块化加载需要多费一些功夫，根据不同需求，在打包项目时可能需要合并一些代码减少网络请求次数，或是拆分一些代码优化前端性能，所以webpack需要同时满足这两种需求，那它是怎么做到的呢？
webpack自身就支持解析一些模块化的语法，包括：

1. ES6 的 `import`/`export` 语法 
2. CMD 规范的 `require`/`modules` 语法
3. AMD 规范的 `require`/`define` 语法
4. CSS/SASS/LESS的 `@import` 语句
5. 图片在CSS中的 `url` 语法以及HTML中的 `src` 属性

webpack在打包时遇到这些语法会自动加载并递归打包依赖模块，css、image等模块会被打包成静态资源，而javascript代码会被打包成如下格式:

```javascript

// the webpack bootstrap
(function (modules) {
    // The module cache
    var installedModules = {};
    // The require function
    function __webpack_require__(moduleId) {
        // Check if module is in cache
        // Create a new module (and put it into the cache)
        // Execute the module function
        // Flag the module as loaded
        // Return the exports of the module
    }


    // expose the modules object (__webpack_modules__)
    // expose the module cache
    // Load entry module and return exports
    return __webpack_require__(0);
})
/************************************************************************/
([
    // main.js
    /* 0 */
    function (module, exports, __webpack_require__) {
        var module1 = __webpack_require__(1);
        var module2 = __webpack_require__(2);
        /**
         * logic in main.js
         */
    },
    // module1
    /* 1 */
    function (module, exports, __webpack_require__) {
        var module2 = __webpack_require__(2);
        /**
         * logic in module1
         */
        module.exports = module1;
    },
    // module2
    /* 2 */
    function (module, exports) {
        /**
         * logic in module2
         */
        module.exports = module2;
    }
]);
```

webpack将多个模块解析后生成一个文件，包含一个加载器并用所有依赖形成的数组作为参数，可以看到加载器最后返回 `return __webpack_require__(0);` 开始执行入口文件，注意 `__webpack_require__(0)` 中的 `0` 就是依赖数组中的 index 值。而入口文件和其他依赖中的 `var module1 = __webpack_require__(1); var module2 = __webpack_require__(2);` 语句就是我们使用 CMD 或 ES6 modules 语法时的 `var module1 = require('./module1')` 语句，如此一个使用模块化语句编写的项目就可以打包为一个可以被浏览器执行的文件了。

实际项目中我们并不总会把所有依赖和入口模块打包成一个文件，依据文件包大小或优化目的，往往有拆分打包模块的需求，这时打包文件需要将个别可以懒加载的模块独立打包，webpack会将这样的依赖打包为这个样子: 

```javascript
    webpackJsonp(
        [0],
        [
            // 注意这里的逗号，它使得目标函数在此依赖数组中的 index 为 1 而不是 0， 这与requireEnsure 中指定的 moduleId 是一致的
            ,

            (function (module, exports) {
                /**
                * logic in dep1
                */
                module.exports = dep1;
            })
        ]
    );
```

可以看到webpack将此依赖单独打包为一个数组形式的函数列表，这个数组与上述合并打包的数组结构并无二致，唯一不同的是定义的`webpackJsonp`函数，webpack利用 jsonp 方式来加载这些依赖:

```javascript
    // 懒加载语法：返回 Promise 对象， 可以这样使用 __webpack_require__.e(0).then()
    __webpack_require__.e = function requireEnsure(chunkId) {
        // 从上面定义的 installedChunks 中获取 chunkId 对应的 Chunk 的加载状态
        var installedChunkData = installedChunks[chunkId];
        // 如果加载状态为0表示该 Chunk 已经加载成功了，直接返回 resolve Promise
        if (installedChunkData === 0) {
            return new Promise(function (resolve) {
                resolve();
            });
        }

        // installedChunkData 不为空且不为0表示该 Chunk 正在网络加载中
        if (installedChunkData) {
            // 返回存放在 installedChunkData 数组中的 Promise 对象，以节省网络请求
            return installedChunkData[2];
        }

        // installedChunkData 为空，表示该 Chunk 还没有加载过，去加载该 Chunk 对应的文件
        var promise = new Promise(function (resolve, reject) {
            // 使用 [resolve, reject] 结构定义一个 installedChunkData 对象
            installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });

        // 现在 installedChunkData 内容为 [resolve, reject, promise]
        installedChunkData[2] = promise;

        // 通过 DOM 操作，往 HTML head 中插入一个 script 标签去异步加载 Chunk 对应的 JavaScript 文件
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.async = true;
        script.timeout = 120000;

        // 文件的路径为配置的 publicPath（__webpack_require__.p）、chunkId 拼接而成
        script.src = __webpack_require__.p + "" + chunkId + ".bundle.js";

        // 不管成功加载或是达到超时均至少也至多执行一次onScriptComplete
        var timeout = setTimeout(onScriptComplete, 120000);
        script.onerror = script.onload = onScriptComplete;

        // 在 script 加载和执行完成时回调
        function onScriptComplete() {
            // 防止内存泄露
            script.onerror = script.onload = null;
            clearTimeout(timeout);

            // 去检查 chunkId 对应的 Chunk 是否安装成功，安装成功时才会存在于 installedChunks 中
            var chunk = installedChunks[chunkId];
            if (chunk !== 0) {
                if (chunk) {
                    // 将 requireEnsure 返回的 promise reject 掉
                    chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
                }
                installedChunks[chunkId] = undefined;
            }
        };

        head.appendChild(script);

        return promise;
    };
```

而 `webpackJsonp` 方法定义在合并打包的文件（被首次加载）中，它长这个样子: 

```javascript
    // 当此某加载完成后 webpackJsonp 会自动执行，此时会 resolve 掉 requireEnsure 中定义的 promise
    // 使依赖此模块的代码能够继续执行

    /**
     * @param chunkIds 懒加载的模块id
     * @param moreModules 懒加载模块中的 依赖数组
     * @param executeModules 在异步加载的文件中存放的需要安装的模块都安装成功后，需要执行的模块对应的 index
     */
    window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
        var moduleId, chunkId, i = 0, resolves = [], result;
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            // installedChunks[chunkId] 即为上面定义的 installedChunkData (内容为: [resolve, reject, promise])
            if (installedChunks[chunkId]) {
                // 收集需要执行的resolve
                resolves.push(installedChunks[chunkId][0]);
            }
            // 将 chunkId 的加载状态置为 ‘成功’
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                // 将懒加载而来的依赖存入全部依赖 modules 中
                modules[moduleId] = moreModules[moduleId];
            }
        }

        // 将所有 resolve 依次执行掉
        while (resolves.length) {
            resolves.shift()();
        }
    };
```

如此依赖，分隔打包的依赖也都可以懒加载执行了

# 计算属性
Vue.js 中有一个计算属性的概念，底层通过 ES5 的 defineProperty 实现，由于这个方法无法通过 shim 实现，所以 Vue.js 不支持 IE8 及以下的浏览器。现在了解一下这个计算属性：

```
  var vm = new Vue({
    el: '#demo',
    data: {
      firstName: 'Foo',
      lastName: 'Bar'
    },
    computed: {
      fullName: function () {
        return this.firstName + ' ' + this.lastName
      }
    }
  })
```

当 data 中 firstName 或者 lastName 发生变化时，计算属性 fullName 会自动发生变化，如果此时 fullName 在页面中被使用，同时页面也会自动刷新，怎么做到的呢？首先 ES5 的 defineProperty 方法允许为对象定义 set 和 get 方法，当针对对象的该属性发生 RHS 或者 LHS 查询时会调用对应的方法取得其返回值，相当于一个代理（下面称为‘代理属性’），但是好像对象真的有这个属性一样。而 Vue 的 data 中预定义的所有属性都会被处理成‘代理属性’，在 computed 中定义的属性则会成为‘计算属性’，故而‘计算属性’就是在这些‘代理属性’基础上的进一步代理。首先我们来做到第一步，编写一个构建‘代理属性’的方法：

```
  function defineProxy (obj, key, val) {
    Object.defineProperty (obj, key, {
      get: function () {
        return val;
      },
      set: function (newValue) {
        val = newValue;
      }
    })
  }
```

很标准的 defineProperty 用法，使用了闭包缓存了定义变量 val，下面实现‘计算属性’的定义方法：

```
  function defineComputed (obj, key, getter) {
    Object.defineProperty (obj, key, {
      get: function () {
        var value = getter ();
        return value;
      }
    })
  }
```

由于 Vue 中的 setter 只是对‘代理属性’ setter 的简单代理，这里略过不提。现在我们有了‘代理属性’以及在其之上的‘计算属性’方法，但是‘代理属性’发生变化时还不能通知‘计算属性’发生变化，Vue 是采取以下策略解决这个问题：‘计算属性’的 getter 被执行时会调用一个或者多个‘代理属性’的 getter，此时在每个对应的‘代理属性’ get 方法中定义一个收集器，记录这个‘计算属性’的 getter 应该在此‘代理属性’的 setter 被执行时调用。调整代码如下：

```javascript
  var Dep = {
    target: null
  }

  function defineProxy (obj, key, val) {
    var deps = [];
    Object.defineProperty (obj, key, {
      get: function () {

        if (Dep.target && deps.indexOf (Dep.target) == -1) {
          deps.push (Dep.target);
        }
        
        return val;
      },
      set: function (newValue) {
        val = newValue;
        
        for (var i = 0; i < deps.length; i ++) {
          deps[i]();
        }
      }
    })
  }

  function defineComputed (obj, key, getter) {
    Object.defineProperty (obj, key, {
      get: function () {
        
        Dep.target = getter;
        
        var value = getter ();
        
        Dep.target = null;
        
        return value;
      }
    })
  }
```

此时每个作为基础的‘代理属性’在发生改变时均会告知上层的‘计算属性’发生变化，这也很好解释了为什么计算属性需要在 data 中预定义才能发挥作用，而如果需要动态添加属性的话需要使用 Vue.set 方法，实际上 Vue.set 就是一个 defineProxy 方法。

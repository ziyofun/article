#将Node.js应用部署到HEROKU
------------
Heroku是一个支持包括Node.js在内的多种编程语言的云PaaS，可以理解为一个服务提供商，除了Java、PHP、Node.js等环境之外它还提供了多种add-ons服务，能够运行绝大部分的Web项目，唯一不好的地方就是有点小贵，好在提供的免费计划已经能够满足小型项目的需求了。此外，Heroku最吸引人的地方在于支持git了，熟悉git的同学用起来真的是游刃有余了。

###注册账户
先在[Heroku][1]注册一个账户，邮箱验证之后，来到这个[页面][2]:
![apps][3]

选择Node.js，然后就看见了帮助页面，照着执行就好了，本教程到此结束。

###安装toolbelt
下载[toolbelt][4]并安装，然后打开Shell执行以下命令登入：

```
$ heroku login
```

到此已经完成了一小半了。

###部署应用
在Shell中进入你的Node.js目录下，执行以下命令创建一个Heroku应用：

```
$ heroku create
```

你会看到贴心的Heroku已经为你提供了网址和git远程仓库地址。先别急着push，先在项目根目录下创建
Procfile文件，内容如下：

```
web: node app.js
```

该命令就是启动应用的命令，做完了这些就一顿操作把项目push到提供的远程仓库地址，大功告成！

###稍等！

哪里不对！是的，现在只是把app部署到了Heroku，但并没有看到数据库的影子，一个没有数据库支持的网站是不完美的网站。下面就说说怎么为部署好的Web app配置一个数据库。

###连接Mongolab

数据库的话我选择MongoDB，因为NoSQL相比于SQL来说有诸多好处，比如存储方式更加便于理解等，当然最重要的就是我根本不会用MongoDB之外的数据库。。。

Heroku的Add-ons提供了对Mongolab的支持，一键即可添加，不过需要绑定一张信用卡，这就比较坑爹了，好在能够通过委婉的方式手动添加。

首先注册Mongolab，注册了之后见到下面界面：
![mongolab][5]

看着下面的价格，怎么省钱怎么点，点着点着我们就有了一个0.5G的免费数据库啦！
继续看看我们刷出了什么？
![newdb][6]

先点击下面的Add database user，添加一个dbuser，密码要记住。
现在看看上面的数据库信息，如果你对mongodb有了解就能看出这是一个mongodb的uri

```
ds061558.mongolab.com:61558/sleelily
```
当然你可以在app中直接使用上面提供的标准格式mongodb uri：

```
mongodb://<dbuser>:<dbpassword>@ds061558.mongolab.com:61558/sleelily
```
将刚添加的`dbuser`和对应的`dbpassword`填入对应的地方就可以了。不过让用户名和密码就这样暴露在文件里是不是太激进了？

我们还是使用较为稳妥的办法吧。

###使用环境变量

学习Node.js的时候就知道`process.env.xxx`可以使用本地的环境变量，而Heroku也是有环境变量的。
可以这样设置：
```
$heroku config:set [ENV_VAR]=[VAL]
```
所以mongodb uri可以这样使用：

```
var MONGO_URI = process.env.MONGO_URI||"mongodb://127.0.0.1:27017/blog";

var options = {
  user : process.env.MONGO_USER||null,
  pass : process.env.MONGO_PASS||null
}

db = mongoose.connect(MONGO_URI,options);
```
然后通过Shell命令配置Heroku环境变量：

```
$ heroku config:set MONGO_URI = ds061558.mongolab.com:61558/sleelily
$ heroku config:set MONGO_USER = XXXXX
$ heroku config:set MONGO_PASS = XXXXX
```
然后再一顿操作，该add的add该push的push吧！


[1]:https://signup.heroku.com/
[2]:https://dashboard.heroku.com/apps
[3]:/imgs/apps.PNG
[4]:https://s3.amazonaws.com/assets.heroku.com/heroku-toolbelt/heroku-toolbelt.exe
[5]:/imgs/mongolab.PNG
[6]:/imgs/newdb.PNG
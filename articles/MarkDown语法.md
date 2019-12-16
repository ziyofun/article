# Markdown基础

------

刚刚学习Javascript的时候，就听说Github了。来到这里才发现原来码农这一类生物下面也有这么繁杂的纲目，大神、小清新、心机婊等等，但是他们都有一个基本技能——当当当！对了，就是Markdown啦！不过，在Github上介绍Markdown会不会和“在重启还原的电脑上安装需要重启来运行的软件”一样？请无视这些细节吧。

## 什么是Markdown

Markdown 是一种轻量级标记语言，它允许人们“使用易读易写的纯文本格式编写文档，然后转换成有效的XHTML(或者HTML)文档”。
这是维基百科上面的解释，但就我个人的看法，Markdown其实就是一种标记，连语言都算不上。如果你对标记语言有那么一丁丁了解，几乎就不需要费劲学习了。

## Markdown语法

Markdown中的语法普遍易读易懂，下面从几个常用语法了解一下，想要更深入地学习，出门请转[Markdown语法说明][1]，那里有比较细致的讲解。使用Markdown来转换文字的格式一般有以下两种方法：

+ 使用HTML语法
+ 使用表意符号

Markdown是兼容HTML语法的，如果只是写仅用来呈现的文本的话，这种方法就有点作践自己了，所以我们先来说说在Markdown中是怎么使用HTML的。

###HTML in Markdown

请直接大胆地使用HTML标签，比如：

```html
<a href="http://www.apple.com/cn/">微软大法好！</a>
```

它看起来是这样的：

<a href="http://www.apple.com/cn/">微软大法好！</a>

或者插入一个表格：

```html
<table>
  <tr>
    <td>2</td>
    <td>3</td>
    <td>3</td>
  </tr>
</table>
```

它看起来是这样的：

<table>
  <tr>
    <td>2</td>
    <td>3</td>
    <td>3</td>
  </tr>
</table>

不过为了使文档看起来更加格式一致，建议强迫症患者采用第二种方法，这也是最轻松的方法。

### 使用表意符号

表意符号是我个人的俚语，我也不知道官方叫法，但是“表意符号”显然已经能够胜任这个任务了。

#### 标题

在Markdown中输入标题有两种方法：

+ 使用下划线====或者----
+ 使用#符号，以#数量表示标题级别

下划线只支持两种标题，而#支持6种，显然不管是从严谨性还是实用性上来看，第二种方法都是不虚的。

#### 列表

对应HTML中的`ul`和`ol`列表类型，Markdown中也有无序列表和有序列表之分

这是一个无序列表：

```
* 不工作没工作经验
* 没工作经验找不到工作
```

它看起来是这样的：

* 不工作没工作经验
* 没工作经验找不到工作

当然，除了`*`号之外，解析器表示`+`号和`-`号也都是可以接受的。

这是一个有序列表：

```
1. 我最讨厌数学烂的人
3. 还有说话只说一半
```

它看起来是这样的：

1. 我最讨厌数学烂的人
3. 还有说话只说一半

是的，非常"有爱"的解析器。

#### 链接

写博客加入一点链接是毫不过分的要求，Markdown当然能够做到：

示例：

```markdown
[surface pro3 毫无疑问是一个失败的产品](http://www.microsoft.com/surface/zh-cn/products/surface-pro-3)请单击链接购买！
```

它看起来是这样的：

[surface pro3 毫无疑问是一个失败的产品](http://www.microsoft.com/surface/zh-cn/products/surface-pro-3)请单击链接购买！

除了直接在页面中插入链接，Markdown也支持使用参考，虽然不是那么直接，但贵在源码整齐，处女座的同学有福了：

```markdown
[阿里][2]与[企鹅][3]撕逼，[度娘][4]或成最大输家。

[2]:http://www.tmall.com/
[3]:http://www.zhihu.com/question/27141247
[4]:http://www.zhihu.com/question/27794207
```

它看起来是这样的：

[阿里][2]与[企鹅][3]撕逼，[度娘][4]或成最大输家。

#### 图片

图文并茂是安利自己idea的不二法则，我们来看Markdown是如何实现插入图片的。

举个栗子：

```markdown
![举个栗子](http://www.51baiyin.com/silver/UploadFiles_4582/201406/2014062613360784.jpg)
```

效果：
![举个栗子](http://www.51baiyin.com/silver/UploadFiles_4582/201406/2014062613360784.jpg)

是不是除了那个`!`之外和链接的使用方法如出一辙呢？所以参考也是可以使用的。

---------------
学习了这些应该能够写一篇很漂亮的博客了吧，今天就介绍这么多吧！(喂喂，你就知道这么多才是真相吧！)最后再推荐一个优秀的在线Markdown编辑器[作业部落][5]

[sleelily][6]
03/20/2015

[1]:http://wowubuntu.com/markdown/
[2]:http://www.tmall.com/
[3]:http://www.zhihu.com/question/27141247
[4]:http://www.zhihu.com/question/27794207
[5]:https://www.zybuluo.com/mdeditor
[6]:https://github.com/sleelily
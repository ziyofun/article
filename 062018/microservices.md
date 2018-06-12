# [译] 微服务架构


---

微服务架构，或者说微服务，是一种不同于传统的软件开发模式，在最近几年颇为流行。虽然对于微服务是什么或是如何构建没有太多的确切的定义，但这并不妨碍它在业级应用时成为诸多开发者们的一个越来越受欢迎的方式。由于它独特的可伸缩性，这种构建方式被认为特别适合于搭建支持多平台、多设备（包括但不限于web、移动、IoT、可穿戴等）或是未来不确定将要支持哪些设备的服务。

While there is no standard, formal definition of microservices, there are certain characteristics that help us identify the style.  Essentially, microservice architecture is a method of developing software applications as a suite of independently deployable, small, modular services in which each service runs a unique process and communicates through a well-defined, lightweight mechanism to serve a business goal.

尽管对于微服务没有一个标准的标准、正式的定义，但是它仍有一些便于辨识的特点: 微服务本质上是一种将整个软件应用程序转换为一套独立部署的、小型的、模块化的服务的开发方法，其中每个服务运行一个特定的进程，并通过预定义、轻量级的机制进行通信，达成业务目标。

How the services communicate with each other depends on your application’s requirements, but many developers use HTTP/REST with JSON or Protobuf.  DevOps professionals are, of course, free to choose any communication protocol they deem suitable, but in most situations, REST (Representational State Transfer) is a useful integration method because of its comparatively lower complexity over other protocols.

各个微服务之间如果通信取决于你应用要求，但是大多开发者都会选择常用的如 HTTP/REST、JSON 或是 Protobuf，或是 DevOps 这样更为专业的方式。你可以选择任何合适的通信协议，但 REST 能够胜任大多情况，因为相对来说没那么复杂。

To begin to understand microservices architecture, it helps to consider its opposite: the monolithic architectural style.  Unlike microservices, a monolith application is always built as a single, autonomous unit.  In a client-server model, the server-side application is a monolith that handles the HTTP requests, executes logic, and retrieves/updates the data in the underlying database.  The problem with a monolithic architecture, though, is that all change cycles usually end up being tied to one another.  A modification made to a small section of an application might require building and deploying an entirely new version.  If you need to scale specific functions of an application, you may have to scale the entire application instead of just the desired components.  This is where creating microservices can come to the rescue. 

在开始理解微服务架构之前，了解与它相反的另一种架构 —— 整体架构，可以帮助我们有一个更全面的认知。与微服务架构不同，整体式架构的应用必须作为一个独立完整的单元进行开发。在一个整体架构的 C/S 服务，server 端处理 HTTP 请求、执行业务逻辑、更新数据库数据等等都在一个整体，或者更直白的说是代码仓库里。这种架构的问题在于，所有的更新都是强耦合的，就算一个微小的改动也需要整个服务升级一个版本并重新编译部署。如果你需要扩展某个组件，你必须扩展整个应用的规模，而微服务架构可以解决上述问题。

## SOA vs. Microservices

“Wait a minute,” some of you may be murmuring over your morning coffee, “isn’t this just another name for SOA?”  Service-Oriented Architecture (SOA) sprung up during the first few years of this century, and microservice architecture (abbreviated by some as MSA) bears a number of similarities.  Traditional SOA, however, is a broader framework and can mean a wide variety of things.  Some microservices advocates reject the SOA tag altogether, while others consider microservices to be simply an ideal, refined form of SOA.  In any event, we think there are clear enough differences to justify a distinct “microservice” concept (at least as a special form of SOA, as we’ll illustrate later).

“等一哈”，很多人可能会问，“这不就是SOA换了一个名字吗？”，SOA(面向服务架构，Service-Oriented Architecture)在本世纪初颇为流行，与微服务有很多共同之处。传统意义上的 SOA 是一个很宽泛的框架定，可以涵盖很多事情。一些微服务框架的开发者倡导完全摒弃 SOA 的概念，而另一些人则认为微服务是一种理想、精致的 SOA。不管怎么样，我们认为微服务的理念与SOA存在清晰的区别，这在稍后将会提到。

The typical SOA model, for example, usually has more dependent ESBs, with microservices using faster messaging mechanisms.  SOA also focuses on imperative programming, whereas microservices architecture focuses on a responsive-actor programming style.  Moreover, SOA models tend to have an outsized relational database, while microservices frequently use NoSQL or micro-SQL databases (which can be connected to conventional databases).  But the real difference has to do with the architecture methods used to arrive at an integrated set of services in the first place. 

举例来说，典型的 SOA 模型一般都包含很多独立的 ESB，而微服务使用更加快速的消息机制。SOA专注于命令式编程，而微服务注重响应式编程。另外SOA倾向于使用外部关系型数据库，而微服务一般使用非关系型或者弱关系型数据库。但是真正的不同之处在于组织各类服务的架构方式。

Since everything changes in the digital world, agile development techniques that can keep up with the demands of software evolution are invaluable.  Most of the practices used in microservices architecture come from developers who have created software applications for large enterprise organizations, and who know that today’s end users expect dynamic yet consistent experiences across a wide range of devices.  Scalable, adaptable, modular, and quickly accessible cloud-based applications are in high demand.  And this has led many developers to change their approach. 

由于数字世界的事物瞬息完毕，能够跟上软件需求变化的敏捷开发技术是无价的。大多数的微服务实践来源于大型企业级应用开发人员，以及那些需要为用户在各种设备上提供响应式且具有一致性的体验的开发者。近些年基于云的应用程序对伸缩性、适应性、模块化和访问速度有很高的要求，这使得许多开发人员开始使用这种架构方式。

## Examples of Microservices

As Martin Fowler points out, Netflix, eBay, Amazon, the UK Government Digital Service, realestate.com.au, Forward, Twitter, PayPal, Gilt, Bluemix, Soundcloud, The Guardian, and many other large-scale websites and applications have all evolved from monolithic to microservices architecture.
 
Netflix has a widespread architecture that has evolved from monolithic to SOA.  It receives more than one billion calls every day, from more than 800 different types of devices, to its streaming-video API.  Each API call then prompts around five additional calls to the backend service.

正如 Martin Fowler 所指出的，Netflix, eBay, Amazon等著名公司以及其他许多大型网站和应用，都已从整体式架构演变为微服务架构。Netflix 有一个涵盖了整体式到SOA的广泛体系结构。它的视频流 API 每天会从800多种不同类型的设备接收到超过10亿次访问。而每个API调用平均又会对后端服务发起5个额外请求。

Amazon has also migrated to microservices.  They get countless calls from a variety of applications—including applications that manage the web service API as well as the website itself—which would have been simply impossible for their old, two-tiered architecture to handle.
 
The auction site eBay is yet another example that has gone through the same transition.  Their core application comprises several autonomous applications, with each one executing the business logic for different function areas.

亚马逊也已迁移至微服务。他们处理各种 web API的系统内应用和网站本身每天都会收到难以计数的请求，这对于他们之前的两层架构来说根本是不可能完成的事情。另一个例子是拍卖网站 eBay ，他们的核心应用包含了几个独立的子应用，而每一个子应用又在执行不同的业务逻辑。

## Understanding Microservice Architecture

Just as there is no formal definition of the term microservices, there’s no standard model that you’ll see represented in every system based on this architectural style.  But you can expect most microservice systems to share a few notable characteristics.
 
First, software built as microservices can, by definition, be broken down into multiple component services.  Why?  So that each of these services can be deployed, tweaked, and then redeployed independently without compromising the integrity of an application.  As a result, you might only need to change one or more distinct services instead of having to redeploy entire applications.  But this approach does have its downsides, including expensive remote calls (instead of in-process calls), coarser-grained remote APIs, and increased complexity when redistributing responsibilities between components.

微服务没有正式的定义，所以也无法从现有的微服务系统中获得标准模型，不过你可以发现大多数的微服务都有几个共同的特点。

首先，使用微服务架构开发的项目可以被拆分为多个组件化服务。如此，每一个服务可以被单独调整、部署而不影响整个项目。这样，在版本迭代时你可能只需要更改一个或几个不同的子服务而不必重新部署整个应用。凡是皆有利弊，微服务也不例外，它意味着各模块间的数据流需要从廉价精细的进程间通信变为更加昂贵且粒度更粗的远程API请求，而且在组件之间重新分配职责时复杂性也会大大增加。

Second, the microservices style is usually organized around business capabilities and priorities.  Unlike a traditional monolithic development approach—where different teams each have a specific focus on, say, UIs, databases, technology layers, or server-side logic—microservice architecture utilizes cross-functional teams.  The responsibilities of each team are to make specific products based on one or more individual services communicating via message bus.  That means that when changes are required, there won’t necessarily be any reason for the project, as a whole, to take more time or for developers to have to wait for budgetary approval before individual services can be improved.  Most development methods focus on projects: a piece of code that has to offer some predefined business value, must be handed over to the client, and is then periodically maintained by a team.  But in microservices, a team owns the product for its lifetime, as in Amazon’s oft-quoted maxim “You build it, you run it.”

第二点，微服务经常根据业务和优先级进行组建，与传统的整体式架构不同，微服务架构下每个团队都有不同的目标，如 UI、数据库、技术层、服务端逻辑单元等跨团队协作。每个团队负责的东西都建立在一个或者更多的互相独立的服务之上，这些服务通过自定义的‘消息总线’达成数据交互。这意味着当某一块服务变动时，不需要再像整体式架构那样把大把时间浪费在等待其他的预完成项上。大多数开发方式都只需要关注代码本身，开发出可按预期工作的代码，然后交给客户，由团队定期维护，而在微服务下，一个团队拥有这个产品的从开发到维护整个生命周期，正如亚马逊经常引用的格言“谁开发，谁运行”。

Third, microservices act somewhat like the classical UNIX system: they receive requests, process them, and generate a response accordingly.  This is opposite to how many other products such as ESBs (Enterprise Service Buses) work, where high-tech systems for message routing, choreography, and applying business rules are utilized.  You could say that microservices have smart endpoints that process info and apply logic, and dumb pipes through which the info flows.

第三点，微服务类似于传统 UNIX 系统中的应用：接收请求，执行它们，然后生成一个对应的结果。这和很多其他项目如企业服务类应用的运行方式完全相反, 它们有一个完整的系统可以消息路由、处理请求并应用不同的业务逻辑。你可以认为微服务是由处理消息应用逻辑的智能终端和连接各个服务的管道组成。
 
Fourth, since microservices involve a variety of technologies and platforms, old-school methods of centralized governance aren’t optimal.  Decentralized governance is favored by the microservices community because its developers strive to produce useful tools that can then be used by others to solve the same problems.  A practical example of this is Netflix—the service responsible for about 30% of traffic on the web.  The company encourages its developers to save time by always using code libraries established by others, while also giving them the freedom to flirt with alternative solutions when needed.  Just like decentralized governance, microservice architecture also favors decentralized data management.  Monolithic systems use a single logical database across different applications.  In a microservice application, each service usually manages its unique database.

第四点，微服务涉及到各种技术和平台，从而往往比旧式的中心化管理方式做得更好。微服务社区支持去中心化得管理方式，因为它的开发人员力求产出有用的工具，然后由其他人用来解决相同的问题。Netflix就是一个实际的例子，他们的服务占用了网络上大约30％的流量。该公司鼓励其开发人员通过始终使用其他人创建的代码库来节省时间，同时也让他们可以在需要时自由调换其他的替代解决方案。
不只是代码业务层面，微服务架构也倡导数据层面的去中心化。整体式架构在不同的应用中使用相同的数据库，而在微服务应用程序中，每个服务通常都有自己的数据库。

Fifth, like a well-rounded child, microservices are designed to cope with failure.  Since several unique and diverse services are communicating together, it’s quite possible that a service could fail, for one reason or another (e.g., when the supplier isn’t available).  In these instances, the client should allow its neighboring services to function while it bows out in as graceful a manner as possible. However, monitoring microservices can help prevent the risk of a failure. For obvious reasons, this requirement adds more complexity to microservices as compared to monolithic systems architecture.
 
Finally, microservices architecture is an evolutionary design and, again, is ideal for evolutionary systems where you can’t fully anticipate the types of devices that may one day be accessing your application.  This is because the style’s practitioners see decomposition as a powerful tool that gives them control over application development.  A good instance of this scenario could be seen with The Guardian’s website (prior to the late 2014 redesign).  The core application was initially based on monolithic architecture, but as several unforeseen requirements surfaced, instead of revamping the entire app the developers used microservices that interact over an older monolithic architecture through APIs.



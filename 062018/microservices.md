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


第五，微服务的设计经过全面考虑，旨在应对失败。由于几种独特而多样的服务在一起通信，因此一个服务很可能因为某种原因（例如，当供应数据服务不可用时）失败。在这些情况下，该服务应该尽可能优雅地保证对接服务的正常运行。诚然，对微服务添加监控也可以达到同样的效果，但是显而易见，与单片系统体系结构相比，这会增加了整个服务的复杂性。
 
Finally, microservices architecture is an evolutionary design and, again, is ideal for evolutionary systems where you can’t fully anticipate the types of devices that may one day be accessing your application.  This is because the style’s practitioners see decomposition as a powerful tool that gives them control over application development.  A good instance of this scenario could be seen with The Guardian’s website (prior to the late 2014 redesign).  The core application was initially based on monolithic architecture, but as several unforeseen requirements surfaced, instead of revamping the entire app the developers used microservices that interact over an older monolithic architecture through APIs.

最后，微服务架构是一种进化设计，也是一个进化系统，因为你无法确定将来可能访问应用程序的设备类型。微服务的开发人员将解耦作为一种强大的工具以控制应用程序开发。 “卫报”网站（2014年底重新设计）可以看到这种情况的一个好例子。它的核心应用程序最初基于单片架构，但随着几个无法预料的要求浮出水面，开发人员不再整体式架构来修改整个应用程序，而是使用通过API在旧的单片架构上搭建新的微服务来解决问题。

To sum up: Microservice architecture uses services to componentize and is usually organized around business capabilities; focuses on products instead of projects; has smart end points but not-so-smart info flow mechanisms; uses decentralized governance as well as decentralized data management; is designed to accommodate service interruptions; and, last but not least, is an evolutionary model. 

总结：微服务架构使用服务进行组件化，并且通常围绕业务功能进行组织;专注于产品而非项目;具有智能终端和不那么智能的信息流机制;使用去中心化管理和去中心化的数据管理;旨在适应服务中断;是但不仅仅是一个进化模型。
 
Now let’s take a closer look at how all of it actually plays out in practice…

现在，让我们更近一步看一下在实际中微服务是如何工作的。

## How Microservice Architecture Works

“If you wish to converse with me,” said Voltaire, “define your terms.”  Just as there is more than one programming language, there are many terms to describe similar concepts used by different developers.  So to follow our brief overview of microservices here, it will help to have at least a basic grasp of the following concepts:

*. Object Oriented Programming (OOP)—a modern programming paradigm (see also SOLID)
*. Web service / API—a way to expose the functionality of your application to others, without a user interface
*. Service Oriented Architecture (SOA)—a way of structuring many related applications to work together, rather than trying to solve all problems in one application
*. Systems—in the general sense, meaning any collection of parts that can work together for a wider purpose
*. Single Responsibility Principle (SRP)—the idea of code with one focus
*. Interface Segregation Principle (ISP)—the idea of code with defined boundaries.

正如伏尔泰的名言: "如果你想和我交谈，请说明你的条件。" 编程语言绝不止一种，不同的开发者使用它们描述同样的概念也会有千差万别的结果。所以在我们对微服务的简要概述之前，你需要对以下概念有一个基本的了解:

*. 面向对象编程(OOP)——一种现代编程范式(SOLID)
*. Web 服务/API —— 一种将你的应用功能提供给其他应用使用的非用户界面的方式
*. 面向服务架构 —— 一种使用服务群结构而非在一个应用中解决所有问题的方式
*. 系统 —— 一般而言意味着多种部分可以结合起来完成一个更大的目标
*. 单一责任原则(SRP)—— 一部分代码只专注于一件事
*. 接口隔离原则 —— 一部分代码有清晰的作用边界。

### 1. Monoliths and Conway’s Law

To begin with, let’s explore Conway’s Law, which states: “Organizations which design systems…are constrained to produce designs which are copies of the communication structures of these organizations.”

开始之前，让我们介绍一下康威定律，“任何设计系统的组织，必然会产生以下设计结果：即其结构就是该组织沟通结构的写照”。

Imagine Company X with two teams: Support and Accounting.  Instinctively, we separate out the high risk activities; it’s only difficult deciding responsibilities like customer refunds.  Consider how we might answer questions like “Does the Accounting team have enough people to process both customer refunds and credits?” or “Wouldn’t it be a better outcome to have our Support people be able to apply credits and deal with frustrated customers?”  The answers get resolved by Company X’s new policy: Support can apply a credit, but Accounting has to process a refund to return money to a customer.  The roles and responsibilities in this interconnected system have been successfully split, while gaining customer satisfaction and minimizing risks.

假设X公司有两个团队:支持和会计。我们本能地把高风险活动区分开来;决定客户退款等责任是很困难的。考虑一下我们如何回答这样的问题:“会计团队是否有足够的人力物力来认证并处理客户退款要求?”或者“让我们的支持人员提供担保，并与沮丧的客户打交道，不是更好的结果吗?”X公司的新政策解决了这个问题:支持可以为客户提供担保，会计只需要负责将钱返还给客户。在这个相互关联的系统中，角色和责任被成功地分割，同时兼顾了客户满意度和财务风险。

Likewise, at the beginning of designing any software application, companies typically assemble a team and create a project.  Over time, the team grows, and multiple projects on the same codebase are completed.  More often than not, this leads to competing projects: two people will find it difficult to work at cross purposes in the same area of code without introducing tradeoffs.  And adding more people to the equation only makes the problem worse.  As Fred Brooks puts it, nine women can’t make a baby in one month. 

同样，在设计任何软件应用程序的开始，公司通常会组建一个团队并只创建一个项目。随着时间的推移，团队不断壮大，同一个代码仓库支撑起越来越多的项目。通常情况下，这会导致项目间的矛盾:两个人会发现在同一份代码，如果不进行仔细权衡，就很难为不同的目的展开工作。在这种关系下加入更多的人只会使问题变得更糟。这也是为什么弗雷德·布鲁克斯Fred Brooks会说，九个女人也不能在一个月内生下一个孩子。

Moreover, in Company X or in any dev team, priorities frequently shift, resulting in management and communication issues.  Last month’s highest priority item may have caused our team to push hard to ship code, but now a user is reporting an issue, and we no longer have time to resolve it because of this month’s priority.  This is the most compelling reason to adopt SOA, including the microservices variety.  Service-oriented approaches recognize the frictions involved between change management, domain knowledge, and business priorities, allowing dev teams to explicitly separate and address them.  Of course, this in itself is a tradeoff—it requires coordination—but it allows you to centralize friction and introduce efficiency, as opposed to suffering from a large number of small inefficiencies.

更糟糕的是，X公司和其他任何开发团队中，优先级经常发生改变，进而造成管理和沟通问题。上个月最高优先级的任务可能正使我们的团队推进缓慢，但一个用户提交的问题可能会改变优先级成为这个月最紧要的事情。这也是采用SOA(包括微服务)的最令人信服的原因。面向服务可以很方便理清管理、领域知识和业务优先级变更之间的冲突，允许开发团队明确地分离和处理它们。当然，这本身就是一种权衡——它需要很多协调工作，允许你集中处理矛盾以提升效率，而不会被分散的各个矛盾浪费掉大量资源。

Most importantly, smartly implementing an SOA or microservice architecture forces you to apply the Interface Separation Principle.  Due to the connected nature of mature systems, when isolating issues of concern, the typical approach is to find a seam or communication point and then draw a dotted line between two halves of the system.  Without careful thought, however, this can lead to accidentally creating two smaller but growing monoliths, now connected with some kind of bridge.  The consequence of this can be marooning important code on the wrong side of a barrier: Team A doesn’t bother to look after it, while Team B needs it, so they reinvent it.

更重要的是，实现一个精巧的SOA或者微服务会强迫你使用接口分离原则。由于现有的成熟系统，当隔离关注的问题时，典型的方法是找到现有可用的接口，然后整合它们。不需要过分考虑，这可以帮助我们创建两个增长的桥接的互相独立的服务。这样做的结果可以隔离将问题隔离在最小范围内，比如:使用它的a团队不需关心它（出现的问题），所有问题都交给B团队来解决。

### 2.Microservices: Avoiding the Monoliths

We’ve named some problems that commonly emerge; now let’s begin to look at some solutions.
 
How do you deploy relatively independent yet integrated services without spawning accidental monoliths?  Well, suppose you have a large application, as in the sample from our Company X below, and are splitting up the codebase and teams to scale.  Instead of finding an entire section of an application to split off, you can look for something on the edge of the application graph.  You can tell which sections these are because nothing depends on them.  In our example, the arrows pointing to Printer and Storage suggest they’re two things that can be easily removed from our main application and abstracted away.  Printing either a Job or Invoice is irrelevant; a Printer just wants printable data.  Turning these—Printer and Storage—into external services avoids the monoliths problem alluded to before.  It also makes sense as they are used multiple times, and there’s little that can be reinvented.  Use cases are well known from past experience, so you can avoid accidentally removing key functionality.

我们已经指出了几个问题，现在开始看几个对应的解决方案。

如何分别部署相应的服务而不影响整个系统？想象一下你有一个大型应用，比如上面提到的X公司，并将整个项目分隔为可伸缩的代码和团队。你只需要了解应用的某个部分而不是它的方方面面。你可以清楚地知道某一部分是做什么的，因为他们都是独立的部分没有相互依赖关系。在我们的例子中，箭头指向的 打印 和 存储 表明它们可以被移除，并转换为外部服务。打印什么东西是无关紧要的，它只需要访问可打印的数据。将打印和存储服务转换为外部服务可以避免上面提到的整体性问题。它们也有意义，因为它们被使用了多次，但是我们不必造重复的轮子。这是从过去的经验总结而来的使用案例，你可以只专注于核心功能。

![microservics1](./microservices1.png)

### 3. Service Objects and Identifying Data

So how do we go from monoliths to services?  One way is through service objects.  Without removing code from your application, you effectively just begin to structure it as though it were completely external.  To do that, you’ll first need to differentiate the actions that can be done and the data that is present as inputs and outputs of those actions.  Consider the code below, with a notion of doing something useful and a status of that task.

所以，如何将整体式架构迁移至微服务呢？一种方法是通过服务对象。不需要从应用中删除代码，您可以有效地开始构建它，就好像它完全是外部的一样。想要做到这些，你需要区分每个模块的工作和它们接收、输出的数据。下面的代码是处理某些事的流程并标记了对应的状态:

![microservices2](./microservices2.png)

To prepare this to begin looking like a microservice, what’s next?

然后将它整理为看起来像微服务的样子

![microservices3](./microservices3.png)

Now we’ve distinguished two distinct classes: one that models the data, and one that performs the operations.  Importantly, our JobService class has little or no state—you can call the same actions over and over, changing only the data, and expect to get consistent results.  If JobService somehow started taking place over a network, our otherwise monolithic application wouldn’t care.  Shifting these types of classes into a library, and substituting a network client for the previous implementation, would allow you to transform the existing code into a scalable external service.
 
This is Hexagonal Architecture, where the core of your application and the coordination is in the center, and the external components are orchestrated around it to achieve your goals.

现在，我们已经区分出了两个类：一个是数据，另一个是操作。重要的是，我们的子服务很少具有状态，你可以使用同样的服务很多次，对应同样的数据通常会得到相应的结果。现在来看，如果子服务通过网络来提供服务，我们的整个服务也不会受到影响。将这些类型打包为一个库并使用网络接口包装一下，你就可以将现有代码转换为一个外部服务了。

### 4.Coordination and Dumb Pipes

Now let’s take a closer look at what makes something a microservice as opposed to a traditional SOA.

Perhaps the most important distinction is side effects.  Microservices avoid them.  To see why, let’s look at an older approach: Unix pipes.

现在，让我们仔细研究一下微服务和传统的SOA究竟有什么不同。恐怕最大的不同就是副作用了。微服务几乎不产生副作用。来解释一下原因。拿一个更老的例子：UNIX管道。

LS | WC -L

Above, two programs are chained together: the first lists all of the files in a directory, the second reads the number of lines in a stream of input.  Imagine writing a comparable program, then having to modify it into the below:

上述命令行将两个程序连接到一起，第一个命令列出了文件夹的所有文件，第二个命令会读取输入的行数。想象编写一个对比程序，可以将它改写如下：

LS | LESS

Composing small pieces of functionality relies on repeatable results, a standard mechanism for input and output, and an exit code for a program to indicate success or lack thereof.  We know this works from observational evidence, and we also know that a Unix pipe is a “dumb” interface because it has no control statements.  The pipe applies SRP by pushing data from A to B, and it’s up to members of the pipeline to decide if the input is unacceptable.
 
将小的功能加以组合以提供可供重复使用的结果。这需要对于输入、输出和退出码等提供一套标准机制。这种机制的效果是显而易见的，我们还知道Unix管道是一个“哑”接口，因为它没有控制语句。管道通过将数据从A推到B的过程遵循SRP原则，由管道的成员决定输入是否可以接受。

Let’s go back to Company X’s Job and Invoice systems.  Each controls a transaction and can be used together or separately: Invoices can be created for jobs, jobs can be created without an invoice, and invoices can be created without a job.  Unlike Unix shell commands, the systems that own jobs and invoices have their own users working independently.  But without falling back to a policy, it’s impossible to enforce rules for either system globally.

让我们回顾一下X公司的任务和账单系统。每个单元都控制一个事务，可以结合或单独使用:可以为任务创建账单，可以在没有账单的情况下进行任务，也可以在没有任务的情况下创建账单。但与Unix shell命令不同的是，任务和账单两个系统中的员工各自独立工作。如果没有具体的政策，是不可能在整个项目范围内执行任何一种规则。

Say we want to extract out the key operations that can be repeatedly executed—the services for sending an invoice, mutating a job status and mutating an invoice status.  These are completely separate from the task of persisting data.

假如我们想要将关键操作抽取出来，比如重复发送账单、推进任务和账单状态等操作。这些完全独立于持久化数据的任务。

![microservices5](./microservices5.png)

Here this allows us to wire together the discrete components into two pipelines:

这允许我们将整个组件拆分为两个管道：

### User creates a manual invoice

*. Adds data to invoice, status created
— Invokes BillingPolicyService to determine when an invoice is payable for a given customer
*. Invoice is issued to customer
*. Persists to the invoice data service, status sent

*. 为账单添加数据和状态 —— 引入支付服务来决定何时账单可被指定用户支付
*. 将账单提交给用户
*. 持久化账单数据和状态

### User finishes a job, creating an invoice

*. Validates job is completable
*. Adds data to invoice, status created
— Invokes BillingPolicyService to determine when an invoice is payable for a given customer
*. Invoice is issued to customer
*. Persists to the invoice data service, status sent

*. 校验任务的完成度
*. 将数据提交给对应账单，并创建状态 —— 引入支付服务来决定何时账单可被指定用户支付
*. 将账单提交给用户
*. 持久化账单数据和状态

The invoice calculation related steps are idempotent, and it’s then trivial to compose a draft invoice or preview the amounts payable by the customer by leveraging our new dedicated microservices.
 
Unlike traditional SOA, the difference here is that we have low-level details exposed via a simple interface, as compared to a high-level API call that might execute an entire business action.  With a high-level API, in fact, it becomes difficult to rewire small components together, since the service designer has removed many of the seams or choices we can take by providing a one-shot interface.
 
By this point, the repetition of business logic, policy and rules leads many to traditionally push this complexity into a service bus or singular, centralized workflow orchestration tool.  However, the crucial advantage of microservice architecture is not that we never share business rules/processes/policies, but that we push them into discrete packages, aligned to business needs.  Not only does this mean that policy is distributed, but it also means that you can change your business processes without risk.

账单计算相关的步骤是幂等的，因此使用草稿或使用新的专用微服务再次预览应支付的金额就显得微不足道了。

与传统SOA不同之处在于我们通过简单接口暴露细节而非使用可能会执行完整业务流程的高级API。事实上，使用高级API将会使组合小型组件变得非常困难，因为API的设计者往往会为了提供一站式API而舍弃很多选择和接缝。

在这一点上，业务逻辑、策略和规则的重复导致很多 SOA 将此类复杂性推向服务总线或者某个单一的中心化的工作流处理工具。但是在微服务架构中我们不只是从不共享业务规则、流程和策略，我们将其纳入离散的包中以满足业务需要，这才是其关键优势。这不仅意味着分布式的策略，同样以为这你可以无风险地更改业务流程。

## Microservice Pros and Cons

Microservices are not a silver bullet, and by implementing them you will expose communication, teamwork, and other problems that may have been previously implicit but are now forced out into the open. But API Gateways in Microservices can greatly reduce build and qa time and effort.

微服务并非银弹，实现它你需要明确并解决一些以前比较模糊的沟通、团队合作或其他问题。所幸，你可以使用一些服务来减少构建的时间和经历。 
 
One common issue involves sharing schema/validation logic across services.  What A requires in order to consider some data valid doesn’t always apply to B, if B has different needs.  The best recommendation is to apply versioning and distribute schema in shared libraries.  Changes to libraries then become discussions between teams.  Also, with strong versioning comes dependencies, which can cause more overhead.  The best practice to overcome this is planning around backwards compatibility, and accepting regression tests from external services/teams.  These prompt you to have a conversation before you disrupt someone else’s business process, not after.

跨服务共享数据模型和校验逻辑也是一个常见的问题。A所认为的合法数据并不总是满足B，B很可能有不同的规则。对于数据模型最好的建议是应用版本控制的共享库。但是共享库的更改经常会涉及团队间的讨论。而且，依赖于强有力的版本控制会导致更多开销。克服这些问题的最佳实践是围绕向后兼容进行涉及并接受来自外部服务/团队的回归测试，这会促使你在打乱别人的业务流程之前而非之后进行对话讨论。
 
As with anything else, whether or not microservice architecture is right for you depends on your requirements, because they all have their pros and cons.  Here’s a quick rundown of some of the good and bad:

微服务还有一些其他的问题，它究竟是否适合你取决于你的要求，凡事皆有两面，微服务也不例外:

### Pros

*. Microservice architecture gives developers the freedom to independently develop and deploy services
*. A microservice can be developed by a fairly small team
*. Code for different services can be written in different languages (though many practitioners discourage it)
*. Easy integration and automatic deployment (using open-source continuous integration tools such as Jenkins, Hudson, etc.)
*. Easy to understand and modify for developers, thus can help a new team member become productive quickly
*. The developers can make use of the latest technologies
*. The code is organized around business capabilities
*. Starts the web container more quickly, so the deployment is also faster
*. When change is required in a certain part of the application, only the related service can be modified and redeployed—no need to modify and redeploy the entire application
*. Better fault isolation: if one microservice fails, the other will continue to work (although one problematic area of a monolith application can jeopardize the entire system)
*. Easy to scale and integrate with third-party services
*. No long-term commitment to technology stack

### 优势

*. 微服务给予开发者单独开发和部署服务的自由
*. 微服务也适合小团队开发
*. 不同服务的代码可以使用不同的语言实现（虽然很多人并不鼓励这么做）
*. 很容易进行集成和自动化部署（使用开源持续集成工具如 Jenkins、Hudson等）
*. 对于开发者容易理解和修改，可以使团队新人更快融入工作
*. 开发者可以使用最新的技术栈 
*. 代码围绕业务容量进行组织
*. 当应用的某一部分需要修改或部署变动时不会影响整个应用
*. 更好的错误隔离：如果某个微服务调用失败，其他部分也会正常工作
*. 服务更容易伸缩和集成第三方服务
*. 不再需要对技术栈做出长期保证

### Cons

*. Due to distributed deployment, testing can become complicated and tedious
*. Increasing number of services can result in information barriers
*. The architecture brings additional complexity as the developers have to mitigate fault tolerance, network latency, and deal with a variety of message formats as well as load balancing
*. Being a distributed system, it can result in duplication of effort
*. When number of services increases, integration and managing whole products can become complicated
*. In addition to several complexities of monolithic architecture, the developers have to deal with the additional complexity of a distributed system
*. Developers have to put additional effort into implementing the mechanism of communication between the services
*. Handling use cases that span more than one service without using distributed transactions is not only tough but also requires communication and cooperation between different teams
*. The architecture usually results in increased memory consumption
*. Partitioning the application into microservices is very much an art

### 劣势

*. 由于分布式部署的关系，测试会变得更加复杂臃肿
*. 快速增长的服务可能导致信息屏障
*. 由于不得不考虑到容错、潜在的网络因素、各种信息处理以及负载均衡等问题，这种架构会带来更多的复杂性
*. 分布式系统本身就需要多倍的额外精力
*. 当服务越来越多时，如何集成、管理整个项目会变得更加复杂
*. 除了整体式架构的复杂性外，开发者还必须处理分布式系统带来的复杂性
*. 开发者必须为实现服务间的通信机制付出额外精力
*. 处理跨服务的使用案例时不仅需要分布式的处理方案，还需要多个部门间的交流合作
*. 这种架构通常会带来更多的存储消耗
*. 如何将一个应用集成进微服务又是一门艺术

## The Future of Microservice Architecture

Whether or not microservice architecture becomes the preferred style of developers in future, it’s clearly a potent idea that offers serious benefits for designing and implementing enterprise applications.  Many developers and organizations, without ever using the name or even labeling their practice as SOA, have been using an approach toward leveraging APIs that could be classified as microservices.

无论微服务是否能够在未来成为更受开发者欢迎的模式，它清晰有效的思想都会为企业级应用开发提供明显益处。很多未尝试过SOA或者类似于SOA的开发者和组织，正在积极尝试将他们的应用向微服务转移。

We’ve also seen a number of existing technologies try to address parts of the segmentation and communication problems that microservices aim to resolve.  SOAP does well at describing the operations available on a given endpoint and where to discover it via WSDLs.  UDDI is theoretically a good step toward advertising what a service can do and where it can be found.  But these technologies have been compromised by a relatively complex implementation, and tend not to be adopted in newer projects.  REST-based services face the same issues, and although you can use WSDLs with REST, it is not widely done.

我们也看到许多现有技术都试图解决微服务旨在解决的部分细分和通信问题。 SOAP能够很好地描述并通过 WSDL 定位给定终端上的可用操作。从理论上讲，UDDI也是一个很好的方案。但是其实施起来过于复杂，往往不会被新项目采用。基于REST的服务面临同样的问题，尽管你可以使用带有REST的WSDL，但它并没有被广泛使用。

Assuming discovery is a solved problem, sharing schema and meaning across unrelated applications still remains a difficult proposition for anything other than microservices and other SOA systems.  Technologies such as RDFS, OWL, and RIF exist and are standardized, but are not commonly used.  JSON-LD and Schema.org offer a glimpse of what an entire open web that shares definitions looks like, but these aren’t yet adopted in large private enterprises. 

假设设备发现是一个已解决的问题，那么跨应用程序共享模式和含义仍然是除了微服务和其他SOA系统之外系统的难题。虽然有RDFS、OWL和RIF等标准化的技术存在，但并不常用。JSON-LD 和 Schema.org 提供了对共享定义的整个开放web的轮廓，但大型私营企业尚未采用这些定义。

The power of shared, standardized definitions are making inroads within government, though.  Tim Berners Lee has been widely advocating Linked Data.  The results are visible through in data.gov and data.gov.uk, and you can explore the large number of data sets available as well-described linked data here.  If a large number of standardized definitions can be agreed upon, the next steps are most likely toward agents: small programs that orchestrate microservices from a large number of vendors to achieve certain goals.  When you add the increasing complexity and communication requirements of SaaS apps, wearables, and the Internet of Things into the overall picture, it’s clear that microservice architecture probably has a very bright future ahead.

然而，共享的、标准化定义的力量正在政府内部取得进展。蒂姆•伯纳斯•李(Tim Berners Lee)一直在广泛倡导关联数据。结果可以在data.gov和data.gov.uk中看到，您可以在这里浏览大量可用的数据集作为描述良好的关联数据。如果大量的标准化定义可以商定，那么接下来的步骤很可能是针对代理:小型的程序，它编排了来自大量供应商的微服务，以实现特定的目标。当在整体网络图景中考虑到SaaS应用、可穿戴设备和物联网等等复杂性和通信需求时，很明显，微服务体系结构的前景非常光明。
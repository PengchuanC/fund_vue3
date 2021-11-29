
# 【FOF】基金筛选系统介绍

[点击这里](https://pengchuanc.github.io/posts/introduction-fundscreen/) 前往我的主页查看更多项目， 此项目仅为**基金筛选系统前端部分**。

# 一、系统介绍

为了方便基金投资，开发了基金投资相关系统，基金筛选系统为最初开发系统，目前已经过三次迭代。当前基金筛选系统主要包含8个模块，分别为

1. 基金市场整体统计
2. 基金挑选
3. 基金看板
4. ETF每日跟踪
5. 基金分类筛选入池
6. 入池基金管理
7. 市场热点资讯
8. 基金详细信息



# 二、功能展示

## 1.基金市场统计

该模块为整个系统首页，统计截止上个月底的基金市场规模和数量，基金分类为野村东方国际FOF组根据基金发行公告中的投资范围自定义的分类方式。

![home1-1](https://pengchuanc.github.io/images/fundscreen/1-1.png)

![home1-2](https://pengchuanc.github.io/images/fundscreen/1-2.png)

![home1-3](https://pengchuanc.github.io/images/fundscreen/1-3.png)



## 2.基金挑选

基金挑选模块可以从全市场的公募基金中按一些预设的条件，挑选出符合条件的基金，针对常用的主动权益基金、被动指数基金和债券型基金会有一些更符合基金特点的筛选条件。



### 2.1 筛选界面预览

界面上方为基金筛选条件，下方为展示表格。

![cart2-1](https://pengchuanc.github.io/images/fundscreen/2-1.png)

执行筛选条件后：

![cart2-2](https://pengchuanc.github.io/images/fundscreen/2-2.png)

数据预览表格可全屏，方便查看数据。

![cart2-3](https://pengchuanc.github.io/images/fundscreen/2-3.png)



## 3.基金看板

根据基金年报和半年报持仓股票，对基金持有股票总市值占比大于60%的基金（多为股票型和偏股混合型基金），可以按市值风格将基金分为成长型、均衡性和价值型，根据股票行业占比，可以确定基金的行业风格。

基金看板模块即是对这些基金的跟踪，基金看板首页将这些基金类型按小卡片形式展示，单个卡片最多不超过5条记录，点击全屏按钮可以查看全部该类型基金。

![outlook3-1](https://pengchuanc.github.io/images/fundscreen/3-1.png)

展开后如下：

![outlook3-2](https://pengchuanc.github.io/images/fundscreen/3-2.png)



## 4.ETF每日跟踪

### 4.1 资金概览

本页可以按日频、周频、月频查看各类ETF净资金流向，通过图表两种方式展现。

![etf4-1](https://pengchuanc.github.io/images/fundscreen/4-1.png)



### 4.2 分类统计

本页可以查看具体某一类ETF的资金流向情况和场内、场外业绩表现情况。

![etf4-2](https://pengchuanc.github.io/images/fundscreen/4-2.png)



### 4.3 近期情况

本页展示分周度、分类型ETF资金流入热力图。

![etf4-3](https://pengchuanc.github.io/images/fundscreen/4-3.png)



## 5.基金分类筛选入池

此模块本身用于NOI FOF团队每月筛选合适的基金进入**观察池**和**核心池**，便于持续跟踪，对于合适的基金可以放入**精选层**。

### 5.1 基础筛选

基金经过基础筛选，可放入观察池。

![screen5-1](https://pengchuanc.github.io/images/fundscreen/5-1.png)

### 5.2 进阶筛选

进阶筛选结果，可放入核心池。

![screen5-2](https://pengchuanc.github.io/images/fundscreen/5-2.png)

入池保存页面：

![screen5-3](https://pengchuanc.github.io/images/fundscreen/5-3.png)

## 6.组合管理

组合管理模块主要用于跟踪入池的基金，主要功能如下（涉及具体基金数据，仅展示部分数据）：

观察池：

![pool6-1](https://pengchuanc.github.io/images/fundscreen/6-1.png)

核心池：

![pool6-2](https://pengchuanc.github.io/images/fundscreen/6-2.png)

精选层：

![pool6-3](https://pengchuanc.github.io/images/fundscreen/6-3.png)

## 7.市场热点资讯

此模块最初用于收集市场热门新闻整理发布给公司各部门，此后改造进入客户服务系统，目前此模块处于半废弃状态。

![news7-1](https://pengchuanc.github.io/images/fundscreen/7-1.png)

## 8.基金详细信息

在系统其他模块，点击基金代码，即可进入单只基金详细信息页面。

### 8.1 基金概览

概览页面包括如下信息：

- 基金摘要
- 近期业绩表现
- 基金与基准净值曲线
- 规模变化
- 风格指标
- 基金风格
- 换手情况
- 规模变化

预览图如下：

![detail8-1](https://pengchuanc.github.io/images/fundscreen/8-1.png)

### 8.2 业绩表现

业绩表现对基金区间业绩从多个维度做一个详细的诊断，预览图如下：

![detail8-2](https://pengchuanc.github.io/images/fundscreen/8-2.png)

### 8.3 基金经理

本页主要展示该基金的基金经理同时在管基金的简单信息汇总，预览图如下：

![detail8-3](https://pengchuanc.github.io/images/fundscreen/8-3.png)

### 8.4 资产配置

基金资产配置情况，预览图如下：

![detail8-4](https://pengchuanc.github.io/images/fundscreen/8-4.png)

###  8.5 业绩归因

基金Brinson归因情况，可选区间，预览图如下：

![detail8-5](https://pengchuanc.github.io/images/fundscreen/8-5.png)

### 8.6 重仓持股

本页主要展示至当前基金经理任职以来，多个报告期的持股情况统计，分析其持股偏好。预览图如下：
![detail8-6](https://pengchuanc.github.io/images/fundscreen/8-6.png)

## 三、程序设计

项目采用前后端分离设计，前端负责渲染和处理交互，后端以restful api方式提高数据。

整个项目前前后后经过3次迭代，前端完整重构了一次。本系统需要大量的基金数据和常用的股票数据，项目开发早期由于没有数据支持，只能从Wind终端的api接口提取数据，数据库接口也只能按照适合处理wind api的方式来构建，为整个程序的开发带来了巨大的工程量。

第一次版本更新正是考虑到数据维护的复杂性，开始将数据库迁移至恒生聚源数据，主要重构的部分在后端。

第二次版本更新主要是前端的改造，初版基金筛选系统主要功能集中在**基金筛选**这个功能上，所有功能都围绕基金筛选展开，此后产品提出了相当多的基于单个基金展示和基金挑选的需求，前后端进行大改造。

第三次版本更新主要是对后端单只基金信息展示的改造，后端由于Python的性能瓶颈限制，将部分功能的实现通过Golang来扩展了，以保证延迟和并发需求。

目前系统仍有一些小修小改，但整体呈现的效果如前所述。

## 四、技术栈

总体来说，项目基于MySQL+Python+Golang+Typescript，使用到的框架包括Django、Gin和Vue。

### 1.数据库

数据库使用关系型数据库MySQL，采用读写分离模式，部署到了两台服务器上。

### 2.后端程序

后端经过改造和性能提升，目前用到的工具包括：

- Python: Django grpc
- Golang: Gin Gorm grpc

后端部分功能使用到了<code>grpc</code>，这功能块通常是与其他系统关联的，如基金分类、Brinson归因、基金风格等功能，会在多个系统中使用到，采用grpc可以降低其他系统的工作量。

Python后端项目可[点击这里](https://github.com/PengchuanC/fund_back_django)查看；

Golang后端项目可[点击这里](https://github.com/PengchuanC/fund_screen)查看。

### 3.前端程序

前端程序基于<code>Vue3.x</code>开发，UI框架基于<code>Element Plus</code>，开发语言为<code>Typescript</code>，图表插件主要使用到了`vxe-table`和`echarts`。

前端项目地址已开源，可[点击查看](https://github.com/PengchuanC/fund_vue3)。

### 4.前置机配置

前置机采用常用的`Nginx`做反向代理，主要使用到了`httpv2`、`stream`和`grpc`代理等功能。

后端Python网关选用`asgi`框架`uvicorn`，充分利用异步能力。

项目托管软件采用`supervisor`，监控后端程序并赋予多进程能力。

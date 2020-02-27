# 丢小墙，基于AI的高校失物招领平台

丢小墙以高校场景下的失物招领为切入点，通过借助腾云云开发和腾讯云AI的能力完成项目的快速搭建。

1. 丢小墙以每个高校为单位将该高校的失物招领进行集中，支持全国所有高校接入。每个高校设置有区域管理员，可以对区域内容进行管理，置顶等操作。
2. 通过接入腾讯云ai的语义识别来判断发布内容的相似程度，对于高匹配的物品向丢失者发送微信模板消息推送。
3. 接入腾讯云ai的人脸识别功能，对于卡证类人脸等敏感信息进行自动打马赛克处理。

## 技术栈：
1. 前端使用colorUI作为主要样式库，引用了部分vantUI组件
2. canvas绘图使用了开源项目Painter
3. 后台使用腾讯云开发相关API

项目结构：
![](http://gitblog.luckyq.cn/081a86133ba3f103dcdb719a4e217c3a.jpg)


## 相关连接：
1. [丢小墙开发介绍](https://cloud.tencent.com/developer/article/1576502)
2. [小程序云开发官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
3. [腾讯云ai开放平台](https://ai.qq.com/)

# chat-room

- 这是一个聊天室项目

## 技术栈

- vue3 + ts + pinia + webscoket + 环信IM + axios + vue-router4 + vite + Vant + ESLint + markdownLint
- 技术栈的话肯定是用vue3+ts，写起来也舒服，然后本意是想加一个unocss的，毕竟现在原子化css的浪潮很大，并且会加速我们的开发效率和打包体积，但由于未搞定unocss适配移动端，暂不使用，依赖已下载

## Commit规范

- wip: 开发中
- change: 改变某一文件
- create: 创建某一文件
- config: 配置相关
- style: 界面样式相关，无其他影响
- pref: 优化（性能优化，样式优化使用style）
- del: 删除某一文件
- finish: 完成某一模块或功能
- refactor: 重构
- fix: 修复Bug
- feat: 新增模块或功能
- struct: 修改项目结构
- format: 格式化文件

## 项目描述

- src: 主要文件夹
  - apis：网络请求相关
  - assets：静态资源
  - components：公共组件
  - hooks：业务相关的hook
  - router：路由
  - singleton：存放单例模式的文件
  - stores：pinia
  - style：公共样式
  - types：类型
  - utils：工具库

## 项目启动

```shell
# 克隆到本地
git clone git@github.com:dstenv/chat-room.git
# 安装依赖
npm i
# 运行(暂不支持正式环境上线，使用的环信的demo的应用)
npm run dev
# 打包
npm run build
```

# 简介

此项目采用开源的中后台模版 `Vue Vben Admin` 作为基础。使用了最新的`vue3`,`vite2`,`TypeScript`等主流技术开发。

## 特性

- **最新技术栈**：使用 `Vue3/vite2` 等前端前沿技术开发
- **TypeScript**: 应用程序级 `JavaScript` 的语言
- **主题**：可配置的主题
- **国际化**：内置完善的国际化方案
- **Mock 数据** 内置 `Mock` 数据方案
- **权限** 内置完善的动态路由权限生成方案
- **组件** 二次封装了多个常用的组件

## 准备

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) -项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 `vite` 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 `Vue` 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉`TypeScript`基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 `es6` 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 `vue-router` 基本使用
- [Ant-Design-Vue](https://next.antdv.com/docs/vue/introduce-cn/) - `Ant-Design-Vue` 基本使用
- [Mock.js](https://github.com/nuysoft/Mock) - `mockjs` 基本语法

## 开发

- 项目代码

```bash
git clone https://github.com/LuoHuacheng/vben-admin.git my-app
```

- 安装依赖

```bash
cd my-app

npm install
```

- 运行

```bash
npm run serve
```

- 打包

```bash
# 测试环境
npm run build:test

# 生产环境
npm run build
```

## 更新日志

[CHANGELOG](./CHANGELOG.md)

## 参考项目及文档

- [vue-vben-admin](https://github.com/anncwb/vue-vben-admin) - 完整版
- [文档地址](https://vvbin.cn/doc-next/)

## 浏览器支持

本地开发推荐使用`Chrome 90+` 浏览器

支持现代浏览器, 不支持 IE

## 相关仓库

- [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) - 用于本地及开发环境数据 mock
- [vite-plugin-html](https://github.com/anncwb/vite-plugin-html) - 用于 html 模版转换及压缩
- [vite-plugin-style-import](https://github.com/anncwb/vite-plugin-style-import) - 用于组件库样式按需引入
- [vite-plugin-theme](https://github.com/anncwb/vite-plugin-theme) - 用于在线切换主题色等颜色相关配置
- [vite-plugin-imagemin](https://github.com/anncwb/vite-plugin-imagemin) - 用于打包压缩图片资源(若安装困难可移除此包后使用手动压缩)
- [vite-plugin-compression](https://github.com/anncwb/vite-plugin-compression) - 用于打包输出.gz|.brotil 文件
- [vite-plugin-svg-icons](https://github.com/anncwb/vite-plugin-svg-icons) - 用于快速生成 svg 雪碧图

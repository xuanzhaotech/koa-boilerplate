# Koa2 样板工程

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> 温馨提醒：项目主要用于学习用途，我会尽可能的模拟真实环境的使用，但实际引入的话请慎重

参考 [eggjs][eggjs]，纯手工搭建的 koa2 项目。

项目中已添加真实在用的搭建微信中控服务器的代码，使用 redis 存储微信 access token，windows 用户可以下载 [redis-windows][redis-windows] 在本机搭建 redis 服务，使用 [RedisStudio][RedisStudio] GUI 工具管理 redis 数据。

## 功能介绍

- 支持多环境配置自动加载
- 分离生产与开发服务启动脚本
- 集成 [husky][husky] 和 [lint-staged][lint-staged] 强制代码提交前检查
- 添加 vscode 远程调试的配置
- 自带真实在用的微信中控服务器的源码，可参考实现其他第三方的token 管理，如钉钉的 access token 管理

## 环境要求

 * 因使用 [koa2][koajs] 所以 [node.js][node.js] 最低要求为 7.x 以上版本

## 目录结构

```text
Project/
├── pm2.config.js
├── app.js              应用入口页
├── framework/          koa2 封装的框架
├── config/             环境配置文件
├── bin/                应用启动文件
└── app/                主应用目录
```

## 启动项目

推荐使用 [yarn][yarn] 或 [cnpm][cnpm] 来管理依赖。

```bash
# 克隆项目
$ git clone https://github.com/zhenxs2018/koa-boilerplate.git

# 安装依赖
$ cd koa-boilerplate && npm install

# 本地开发环境使用
$ npm run dev

# 启动调试模式
$ npm run debug

# 启动生产环境
$ npm run start

# 启动测试环境
$ npm run start -- --env testing

# 在浏览器中打开
$ http://127.0.0.1:7001/
```

## 其他说明

**1. 项目中敏感数据的处理**

敏感数据比如 redis 的主机地址和密码，建议存储在 `.env` 文件中，然后使用 `.gitignore` 忽视此文件，然后引入类似 [dotenv][dotenv] 插件解析配置或者自己处理

**2. 远程代码调试，以 vscode 为例**

第一步，是在启动命令中添加 `--inspect` （ 旧版本 node 不是这个 ）参数可以启动一个远程调试端口

第二步，在 `.vscode/launch.json` 中添加启动配置（可添加多个），address 不填默认 localhost，填远程服务器的 IP 地址，这样就可以进行远程调试

第三步，点击活动栏的 杀 🐛 图标，选中配置，点击开始调试，然后就可以在编辑器中打断点调试代码了

远程调试可以参考项目中的配置，我这里本地调试是可以走通的。

**4. 关于配置文件**

配置文件加载的代码可查看 [./framework/configuration.js](./framework/configuration.js) 源码，使用文档可参考 [eggjs/config][eggjs/config]，不过里面仅实现了合并规则和 baseDir，env 变量，其他的并没有实现。

应用启动后会对最终配置的字段生成一份来源数据存储到 json 文件，文件最终会存储到 `runtime/application_config_meta.json` 文件中。

**4. 关于第三方包的版本管理**

建议全局引入 [npm-check][npm-check] 插件，这个包可以检查项目中的包是否具有可升级的版本，同时也可以检测那些包安装未使用，那些使用未安装。

## 待办清单

- [ ] 视图插件制作 ( 已实现未开放 )
- [ ] restful 助手，用于辅助生成 restful 风格的 api  ( 已实现未开放 )
- [ ] session 文件存储插件，用于开发时将 session 存入 json 文件中 （ 待开发 ）
- [ ] docker 部署文件 （ 待开发 ）
- [ ] 测试脚本 （ 待开发 ）

## 感谢

以下排名不分先后.

- [koajs][koajs]
- [eggjs][eggjs]
- [pm2](http://pm2.keymetrics.io/)
- [nodemon](http://nodemon.io)
- [koa-redis](https://github.com/koajs/koa-redis)
- And more.

[dotenv]: https://www.npmjs.com/package/dotenv
[node.js]:https://nodejs.org/zh-cn/
[eggjs]: https://eggjs.org/
[eggjs/config]: http://eggjs.org/zh-cn/basics/config.html
[koajs]: https://koajs.com/
[yarn]: https://yarnpkg.com/lang/zh-hans/
[cnpm]: https://npm.taobao.org/
[lint-staged]:https://github.com/okonet/lint-staged
[husky]: https://github.com/typicode/husky
[redis-windows]: https://github.com/ServiceStack/redis-windows
[RedisStudio]: https://github.com/cinience/RedisStudio
[npm-check]: https://www.npmjs.com/package/npm-check

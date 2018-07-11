'use strict'

const logger = require('koa-logger')

const Application = require('./framework/application')
const Redis = require('./framework/builtin/redis')

const router = require('./app/router')
const error = require('./app/middleware/error')

// Application 继承 KoaApplication
// 所以无需实例化 Koa 对象
const app = new Application(__dirname)

// 读取应用配置
const config = app.config

// 添加密钥
app.keys = config.keys

// 添加 redis 客户端
app.context.redis = new Redis(config.redis)

// 约定添加的任何中间件都是第一个传递参数，第二个传递 koa 的实例
app.use(logger(config.logger))
app.use(error.serverError(config.errorHandler, app))
app.use(router(config.router, app))
app.use(error.notFound(config.notFound, app))

module.exports = app

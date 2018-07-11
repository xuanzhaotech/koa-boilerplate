'use strict'

const Router = require('koa-router')

const wechat = require('./controller/wechat')

module.exports = function () {
  const router = new Router({ prefix: '/api' })

  // 开发时可以支持数组形式的返回，将中间件的添加权限移交部分给 ctrl，这样会更加灵活
  // 比如: exports.getToken = [validate(tokenParams), async ctx => { ... }]
  // router.get('/wechat/token', ...([].concat(wechat.getToken)))
  // 浏览器调用：http://127.0.0.1:7001/api/wechat/token?appid=<your appid>&secret=<your secret>
  router.get('/wechat/token', wechat.getToken)

  return router.routes()
}

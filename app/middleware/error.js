'use strict'

exports.notFound = function notFound () {
  return function (ctx) {
    // 可以直接处理响应逻辑
    // 也可以直接抛出 404 异常然后交给 serverError 处理
    ctx.throw(404)
  }
}

// 还可以延伸出更多的错误处理函数
exports.serverError = function (options, app) {
  const env = app.config.env
  return async function errorHandler (ctx, next) {
    try {
      await next()
    } catch (err) {
      // 事件在 bin/local 或 bin/www 中订阅
      ctx.app.emit('error', err, ctx)

      // 断言异常需要单独处理
      ctx.status = err.code === 'ERR_ASSERTION' ? 422 : err.status || 500
      ctx.body = {
        code: ctx.status,
        message: ctx.status === 500 && env === 'prod' ? 'Internal Server Error' : err.message,
        stack: env === 'local' ? err.stack : null
      }
    }
  }
}

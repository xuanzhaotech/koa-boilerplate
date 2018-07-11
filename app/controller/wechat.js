'use strict'

const assert = require('assert')

const pkg = require('../../package.json')
const wx = require('../shard/wx')

const program = pkg.name

exports.getToken = async ctx => {
  const appid = ctx.query.appid && ctx.query.appid.trim()
  const secret = ctx.query.secret && ctx.query.secret.trim()

  assert(typeof appid === 'string' && appid.length > 0, '微信的 appid 必须.')
  assert(typeof secret === 'string' && secret.length > 0, '微信的 secret 必须.')

  // 尝试从 redis 缓存中读取
  const key = `${program}:wechat:token_${appid}`
  const token = await ctx.redis.get(key)
  if (token) {
    ctx.body = { code: 200, message: 'success', data: token }
    return
  }

  // 获取微信 token
  let result = await wx.getToken({ appid, secret })
  if ('access_token' in result) {
    // 异常写入，无需等待
    ctx.redis.set(key, result.access_token, (+new Date()) + (result.expires_in - 60) * 1000)

    // 返回 token 数据
    ctx.body = {
      code: 200,
      message: 'success',
      data: result.access_token
    }
  } else {
    ctx.throw(500, result.errmsg || 'remote server error', { detail: result })
  }
}

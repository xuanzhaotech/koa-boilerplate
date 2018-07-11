'use strict'

/**
 * 特别说明： redis 文件大部分代码都是拷贝自 https://github.com/koajs/koa-redis 项目，
 * koa-redis 是基于 MIT 协议的，本项目也是，本人对代码不做任何可能的限制，
 * 如果 koa-redis 有特别的协议的，请注意参考 koa-redis 的协议
 */

const { EventEmitter } = require('events')
const util = require('util')

const redis = require('redis')

const debug = util.debuglog('redis-store')

const defaults = {
  auth_pass: null,
  path: null,
  serialize: JSON.stringify,
  unserialize: JSON.parse
}

// 参考 koa-redis
class RedisStore extends EventEmitter {
  constructor (options = {}) {
    super()

    this.options = Object.assign({}, defaults, options)

    debug('Init redis new client')
    const client = (this.client = redis.createClient(this.options))

    const db = this.options.db
    if (db) {
      debug('selecting db %s', db)
      client.select(db)
      client.on('connect', function () {
        client.send_anyways = true
        client.select(db)
        client.send_anyways = false
      })
    }

    client.on('error', this.emit.bind(this, 'error'))
    client.on('end', this.emit.bind(this, 'end'))
    client.on('end', this.emit.bind(this, 'disconnect')) // For backwards compatibility
    client.on('connect', this.emit.bind(this, 'connect'))
    client.on('reconnecting', this.emit.bind(this, 'reconnecting'))
    client.on('ready', this.emit.bind(this, 'ready'))
    client.on('warning', this.emit.bind(this, 'warning'))

    this.on('connect', function () {
      debug('connected to redis')
      this.connected = client.connected
    })

    this.on('ready', function () {
      debug('redis ready')
    })

    this.on('end', function () {
      debug('redis ended')
      this.connected = client.connected
    })
    // No good way to test error
    /* istanbul ignore next */
    this.on('error', function () {
      debug('redis error')
      this.connected = client.connected
    })
    // No good way to test reconnect
    /* istanbul ignore next */
    this.on('reconnecting', function () {
      debug('redis reconnecting')
      this.connected = client.connected
    })
    // No good way to test warning
    /* istanbul ignore next */
    this.on('warning', function () {
      debug('redis warning')
      this.connected = client.connected
    })

    this.connected = client.connected

    // support optional serialize and unserialize
    this.serialize = this.options.serialize
    this.unserialize = this.options.unserialize

    // 只处理用到的方法
    this._setex = util.promisify(client.setex.bind(client))
    this._set = util.promisify(client.set.bind(client))
    this._get = util.promisify(client.get.bind(client))
    this._del = util.promisify(client.del.bind(client))
  }

  async get (sid) {
    const data = await this._get(sid)

    debug('get session: %s', data || 'none')
    if (!data) {
      return null
    }
    try {
      return this.unserialize(data.toString())
    } catch (err) {
      // ignore err
      debug('parse error: %s', err.message)
      return data
    }
  }

  async set (sid, sess, ttl) {
    if (typeof ttl === 'number') {
      ttl = Math.ceil(ttl / 1000)
    }
    sess = this.serialize(sess)
    if (ttl) {
      debug('SETEX %s %s %s', sid, ttl, sess)
      await this._setex(sid, ttl, sess)
    } else {
      debug('SET %s %s', sid, sess)
      await this._set(sid, sess)
    }
    debug('SET %s complete', sid)
  }

  remove (sid) {
    debug('DEL %s complete', sid)
    const client = this.client
    return new Promise((resolve, reject) => {
      client.del(sid, err => (err ? reject(err) : resolve))
    })
  }

  quit () {
    // End connection SAFELY
    debug('quitting redis client')
    const client = this.client
    return new Promise((resolve, reject) => {
      client.quit(err => (err ? reject(err) : resolve))
    })
  }
}

module.exports = RedisStore

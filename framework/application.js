'use strict'

/**
 * 特别说明： application.js 参考自 https://github.com/eggjs/egg-core 开源项目
 * 源码仅对其部分实现或者说是部分参考实现，本人对此源码不做任何限制
 */

const fs = require('fs')
const path = require('path')
const assert = require('assert')

const KoaApplication = require('koa')
const mkdirp = require('mkdirp')

const Configuration = require('./configuration')

class Application extends KoaApplication {
  constructor (baseDir = process.cwd(), options = {}) {
    assert(
      typeof baseDir === 'string',
      'baseDir required, and must be a string'
    )
    assert(fs.existsSync(baseDir), `Directory ${baseDir} not exists`)
    assert(
      fs.statSync(baseDir).isDirectory(),
      `Directory ${baseDir} is not a directory`
    )

    super()

    this.baseDir = baseDir
    mkdirp((this.runtimeDir = path.join(baseDir, 'runtime')))

    this.config = new Configuration(this).parse()
    this.options = options
    this.appInfo = this.getAppInfo()
  }

  getAppInfo () {
    return {
      app: this,
      baseDir: this.baseDir
    }
  }
}

module.exports = Application

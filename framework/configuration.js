'use strict'

/**
 * 特别说明： configuration.js 参考自 https://github.com/eggjs/egg-core 开源项目
 * 源码仅对其部分实现或者说是部分参考实现，本人对此源码不做任何限制
 */

const fs = require('fs')
const path = require('path')
const util = require('util')

const extend2 = require('extend2')
const debug = util.debuglog('configuration')

const SET_CONFIG_META = Symbol('Configuration#setConfigMeta')

class Configuration {
  constructor (app) {
    this.app = app
    this.configMeta = {}
    this.serveEnv = this.getServeEnv()
    this.settings = {
      app,
      env: this.serveEnv,
      baseDir: app.appInfo
    }
  }

  parse () {
    const defaultConfig = this._loadConfig(this.app.baseDir, 'config.default')
    const customConfig = this._loadConfig(
      this.app.baseDir,
      `config.${this.serveEnv}`
    )

    extend2(true, this.settings, defaultConfig)
    extend2(true, this.settings, customConfig)

    saveConfigMetaToFile(this.app.runtimeDir, this.configMeta)

    return this.settings
  }

  _loadConfig (dirpath, filename) {
    let filepath = path.join(dirpath, 'config', filename)

    const config = this.loadFile(filepath, this.app.appInfo)

    if (!config) return null

    // store config meta, check where is the property of config come from.
    this[SET_CONFIG_META](config, filepath)

    return config
  }

  [SET_CONFIG_META] (config, filepath) {
    config = extend2(true, {}, config)
    setConfig(config, filepath)
    extend2(true, this.configMeta, config)
  }

  loadFile (filepath, ...inject) {
    if (
      !filepath ||
      !fs.existsSync(filepath.endsWith('.json') ? filepath : `${filepath}.js`)
    ) {
      return null
    }

    // function(arg1, args, ...) {}
    if (inject.length === 0) inject = [this.app]

    debug(`load file: ${filepath}`)

    let ret = require(filepath)
    return typeof ret === 'function' ? ret(...inject) : ret
  }

  getServeEnv () {
    let serverEnv = process.env.KOA_SERVER_ENV
    if (!serverEnv) {
      if (process.env.NODE_ENV === 'test') {
        serverEnv = 'unittest'
      } else if (process.env.NODE_ENV === 'production') {
        serverEnv = 'prod'
      } else {
        serverEnv = 'local'
      }
    }

    debug(`Current env: ${serverEnv}`)

    return serverEnv
  }
}

module.exports = Configuration

function setConfig (obj, filepath) {
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (
      val &&
      Object.getPrototypeOf(val) === Object.prototype &&
      Object.keys(val).length > 0
    ) {
      setConfig(val, filepath)
      continue
    }
    obj[key] = filepath
  }
}

function saveConfigMetaToFile (runtimePath, configMeta) {
  // 保存配置元信息到文件
  try {
    fs.writeFileSync(
      path.join(runtimePath, 'application_config_meta.json'),
      JSON.stringify(configMeta, 4),
      { flag: 'w+' }
    )
  } catch (e) {
    console.error('Write file error:', e)
  }
}

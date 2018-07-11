'use strict'

const axios = require('axios')

// 助手函数，用于对 axios 添加请求日志记录
exports.createAxiosInstance = function (namespce, options) {
  const instance = axios.create(options)

  instance.interceptors.response.use(
    function (response) {
      const config = response.config
      console.group(
        `[${namespce}] Response: ${config.method.toUpperCase()} ${config.url}`
      )
      console.info('Request:', response.config)
      console.info('Response:', response.data)
      console.groupEnd(`[${namespce}] Response end.`)
      return Promise.resolve(response)
    },
    function (error) {
      const res = error.response || {}
      console.group(
        `[${namespce}] Error: ${res.status || -1} ${res.statusText ||
        'request error'}:`
      )
      console.error('Request:', error.config)
      console.error('Response:', error.message)
      console.groupEnd()
      return Promise.reject(error)
    }
  )
  return instance
}

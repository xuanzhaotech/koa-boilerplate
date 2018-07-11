'use strict'

const utils = require('./utils')

const api = utils.createAxiosInstance('WX-SDK', {
  baseURL: 'https://api.weixin.qq.com',
  timeout: 3500
})

module.exports = {
  getToken (params) {
    return api
      .get('cgi-bin/token', {
        params: Object.assign({ grant_type: 'client_credential' }, params)
      })
      .then(res => res.data, error => Promise.resolve(error))
  }
}

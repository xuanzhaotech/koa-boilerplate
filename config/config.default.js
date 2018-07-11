'use strict'

const pkg = require('../package.json')

module.exports = {
  keys: [
    pkg.name + '_322451f1f2c9e'
  ],
  listen: {
    port: process.env.PORT || 7001
  }
}

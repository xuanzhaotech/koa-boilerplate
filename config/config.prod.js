'use strict'

// 可以借助 dotenv 来读取 .env 文件的变量
// 也可以使用环境变量的方式
const { REDIS_HOST, REDIS_AUTH_PASS, REDIS_DB = 1 } = process.env

module.exports = {
  redis: {
    host: REDIS_HOST,
    port: 6379,
    auth_pass: REDIS_AUTH_PASS,
    db: REDIS_DB
  }
}

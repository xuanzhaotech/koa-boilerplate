'use strict'

const pkg = require('./package.json')

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: pkg.name,
      cwd: __dirname,
      script: pkg.main,
      log_file: 'runtime/logs/all.log',
      out_file: 'runtime/logs/out.log',
      error_file: 'runtime/logs/err.log',
      pid_file: 'runtime/logs/pm2.pid',
      exec_mode: 'cluster',
      max_memory_restart: '300M',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 7001
      },
      // 测试环境使用
      env_testing: {
        NODE_ENV: 'production',
        KOA_SERVER_ENV: 'testing',
        PORT: 7001
      }
    }
  ]
}

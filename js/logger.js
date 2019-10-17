const log4js = require('log4js')
const path = require('path')
const fs = require('fs-extra')

let logDir = '/data/logs/fe/gmfe'

try {
  fs.ensureDirSync(logDir)
} catch (err) {
  console.warn(err)
  logDir = './logs/'
  fs.ensureDirSync(logDir)
}
log4js.configure({
  appenders: {
    normal: {
      type: 'fileSync',
      filename: path.join(logDir, 'gmfe.log'),
      maxLogSize: 100 * 1024 * 1024,
      backups: 2
    },
    console: { type: 'console' }
  },
  categories: {
    default: {
      appenders: ['normal', 'console'],
      level: 'info'
    }
  }
})
const logger = log4js.getLogger('default')
const extra = {
  fatalAndExit(msg) {
    logger.error(msg)
    process.exit(1)
  }
}

module.exports = Object.assign(logger, extra)

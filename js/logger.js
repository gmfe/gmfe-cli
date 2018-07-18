const colors = require('colors')
const log4js = require('log4js')

const log4jsConfig = {
  appenders: {
    console: {
      type: 'console',
      layout: { type: 'coloured' }
    }
  },
  categories: {
    default: { appenders: ['console'], level: 'info' }
  }
}

log4js.configure(log4jsConfig)
let logger = log4js.getLogger('default')

let base = Object.getPrototypeOf(logger)
// info error只是为了加上一些颜色
let extra = {
  info (prefix, msg) {
    if (msg == null) {
      return base.info.call(logger, prefix)
    }
    prefix = colors.cyan(`「${prefix}」`)
    return base.info.call(logger, `${prefix} ${msg}`)
  },
  error (msg) {
    return base.error.call(logger, colors.red(msg))
  },
  fatal (msg) {
    logger.error(msg)
    process.exit(1)
  }
}
console.log = logger.info.bind(logger)

module.exports = Object.assign(logger, extra)
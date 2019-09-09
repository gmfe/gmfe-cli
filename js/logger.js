const log4js = require('log4js')

const logger = log4js.getLogger('default')

const extra = {
  fatalAndExit(msg) {
    logger.error(msg)
    process.exit(1)
  }
}

module.exports = Object.assign(logger, extra)

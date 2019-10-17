const sh = require('./common/shelljs_wrapper')

const logger = require('./logger')

sh.exec('pwd')

console.log('console.log')

logger.info('info')

const sh = require('../common/shelljs_wrapper')
const commonPreview = require('../common/preview')
const logger = require('../logger')
const DEV_PROJECT_PATH = '/data/www/'

function preview (testBranch) {
  logger.info('>>>>>>>>>> 测试部署前检测')
  // 检测dev机
  if (!sh.pwd().startsWith(DEV_PROJECT_PATH)) {
    logger.fatal(`确保处于test机器 ${DEV_PROJECT_PATH}`)
  }
  commonPreview(testBranch)
}

module.exports = preview

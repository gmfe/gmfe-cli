const sh = require('../common/shelljs_wrapper')
const commonPreview = require('../common/preview')
const logger = require('../logger')
const GATE_PROJECT_PATH = '/data/gmfe_static'

function preview (branch) {
  logger.info('>>>>>>>>>> 发布前检测')

  if (!sh.pwd().startsWith(GATE_PROJECT_PATH)) {
    logger.fatal(`确保处于gate机器 ${GATE_PROJECT_PATH}`)
  }
  commonPreview(branch)
}

module.exports = preview

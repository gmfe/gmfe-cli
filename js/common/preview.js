const sh = require('./shelljs_wrapper')
const Util = require('../util')
const { verifyBranch } = Util
const logger = require('../logger')

function preview (previewBranch) {
  logger.info('拉远端代码')
  sh.exec('git fetch') // master目录有全部的远端分支 用来校验 分支名
  verifyBranch(previewBranch)
}

module.exports = preview

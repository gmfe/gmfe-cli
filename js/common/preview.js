const sh = require('./shelljs_wrapper')
const Util = require('../util')
const { getCurrentBranch, verifyBranch } = Util
const logger = require('../logger')

function preview (testBranch) {
  logger.info('检测本地代码状态')
  const diff = sh.exec('git diff', { silent: true })
  if (diff.stdout !== '') {
    logger.fatal('Dirty！确保你本地代码是干净的')
  }

  let curBranch = getCurrentBranch()
  if (curBranch !== 'master') {
    sh.exec('git checkout master')
    curBranch = 'master'
  }

  logger.info('拉远端代码')
  sh.exec('git pull') // master目录有全部的远端分支
  verifyBranch(testBranch)

  logger.info('比较远端代码')
  const oDiff = sh.exec(`git diff ${curBranch} origin/${curBranch}`, { silent: true })
  if (oDiff.stdout !== '') {
    logger.fatal(`${curBranch}不同于origin/${curBranch}。请检查！`)
  }
}

module.exports = preview

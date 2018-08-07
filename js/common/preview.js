const sh = require('./shelljs_wrapper')
const Util = require('../util')
const { getCurrentBranch, verifyBranch } = Util
const logger = require('../logger')

function preview (previewBranch) {
  logger.info('检测本地代码状态')
  const diff = sh.exec('git diff', { silent: true })
  if (diff.stdout !== '') {
    logger.fatalAndExit('Dirty！确保你本地代码是干净的')
  }

  let curBranch = getCurrentBranch()
  if (curBranch !== 'master') {
    sh.exec('git checkout master')
    curBranch = 'master'
  }

  logger.info('拉远端代码')
  sh.exec('git pull') // master目录有全部的远端分支
  verifyBranch(previewBranch)

  logger.info('比较远端代码')
  const oDiff = sh.exec(`git diff ${curBranch} origin/${curBranch}`, { silent: true })
  if (oDiff.stdout !== '') {
    logger.fatalAndExit(`${curBranch}不同于origin/${curBranch}。请检查！`)
  }
}

module.exports = preview

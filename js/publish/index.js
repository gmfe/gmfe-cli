const sh = require('../common/shelljs_wrapper')
const preview = require('./preview')
const confirm = require('../common/confirm')
const build = require('./build')
const { online, postOnline } = require('./online')
const rollback = require('./rollback')
const grayCheck = require('./gray')
const { getProjectPath } = require('../util')
const logger = require('../logger')

async function init (tag, user, branch = 'master') {
  // 前往工程的父目录
  const projectPath = getProjectPath()
  sh.cd(projectPath)

  // 主要是对当前的工程检查一遍
  preview(branch)

  // 灰度发布
  if (branch !== 'master') {
    grayCheck(branch)
  }

  logger.info('最近5次提交')
  sh.exec('git log -n 5 --decorate=full')
  logger.info(`>>>>>>>>>> ${branch}发布准备就绪`)

  // rollback
  if (tag) {
    await confirm(`回滚到${tag}`)
    rollback(tag)
    online(user)
    postOnline(user)
  } else {
    await confirm(`打包${branch}分支`)
    build(branch)

    await confirm(branch !== 'master' ? '灰度上线' : '上线')
    online(user)
    postOnline(user, true)
  }

  process.on('exit', function () {
    logger.info('gmfe exit')
  })
}

module.exports = init

const sh = require('../common/shelljs_wrapper')
const preview = require('./preview')
const confirm = require('../common/confirm')
const build = require('./build')
const { online, postOnline } = require('./online')
const rollback = require('./rollback')
const {prepareGray} = require('./prepare')
const { getProjectPath } = require('../util')
const logger = require('../logger')

async function init (tag, user, branch = 'master') {
  // 前往工程的父目录
  const projectPath = getProjectPath()
  sh.cd(projectPath)

  // 回滚master或灰度分支
  // 去对应目录解压backup中的备份
  if (tag) {
    await rollback(tag, branch)
    await online(user)
    postOnline(user)
    return
  }

  // 简单校验下
  preview(branch)

  if (branch === 'master') {
    // master 已经fetch过了
    sh.exec(`git checkout master`)
    sh.exec(`git reset origin/master --hard`)
  } else {
    // 灰度
    prepareGray(branch)
  }

  logger.info('最近5次提交')
  sh.exec('git log -n 5 --decorate=full')
  logger.info(`>>>>>>>>>> ${branch}发布准备就绪`)

  await confirm(`打包${branch}分支`)
  build(branch)
  await confirm(branch !== 'master' ? '灰度上线' : '上线')
  await online(user)
  postOnline(user, true)

  process.on('exit', function () {
    logger.info('gmfe exit')
  })
}

module.exports = init

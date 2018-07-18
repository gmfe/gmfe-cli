const sh = require('../common/shelljs_wrapper')
const {getProjectPath, getPackageJSON, getCurrentBranch} = require('../util')
const logger = require('../logger')
const npm_publish = require('../npm_publish')
const fs = require('fs')

const _init = (filePath, commit = '新增icon') => {
  const projectPath = getProjectPath()

  const packageJSON = getPackageJSON()
  if (packageJSON.name !== 'gm-xfont') {
    logger.fatal('当前工程不是gm-xfont')
  }

  if (!fs.existsSync(filePath)) {
    logger.fatal('请确认icon压缩包路径')
  }
  sh.exec('git pull')
  // icon包解压到工程目录,覆盖
  sh.exec('unzip -o -j -d ' + projectPath + ' ' + filePath)
  logger.info('解压完毕')

  // master
  const currentBranch = getCurrentBranch()
  if (currentBranch !== 'master') {
    logger.fatal('确保你处于master分支')
  }

  logger.info('正在推送代码到origin...')
  sh.exec('git add . && git commit -m ' + commit + ' && git push origin master:master;')

  npm_publish('patch')
}

module.exports = _init

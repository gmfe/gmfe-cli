const sh = require('../common/shelljs_wrapper')
const { getProjectPath, getPackageJSON, getCurrentBranch } = require('../util')
const logger = require('../logger')
const npm_publish = require('../npm_publish')
const fs = require('fs')

const svgPublish = (filePath, commit = '新增svg') => {
  const projectPath = getProjectPath()
  const svgPath = projectPath + '/svg'

  const packageJSON = getPackageJSON()
  if (packageJSON.name !== 'gm-svg') {
    logger.fatalAndExit('当前工程不是gm-svg')
  }

  // master
  const currentBranch = getCurrentBranch()
  if (currentBranch !== 'master') {
    logger.fatalAndExit('确保你处于master分支')
  }

  if (!fs.existsSync(filePath)) {
    logger.fatalAndExit('请确认svg压缩包路径')
  }

  sh.exec('git pull')

  // 删除原svg文件夹
  sh.exec(`rm -rf ${svgPath}`)

  // icon包解压到工程目录,覆盖.
  sh.exec('unzip -o -j -d ' + svgPath + ' ' + filePath)
  logger.info('解压完毕')

  // svg 转为react组件,并保存在src目录下
  sh.exec('npx @svgr/cli -d src svg')
  logger.info('svg转为react组件,成功!')

  logger.info('正在推送代码到origin...')
  sh.exec('git add . && git commit -m ' + commit + ' && git push origin master:master;')

  npm_publish('patch')
}

module.exports = svgPublish

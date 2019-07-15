const sh = require('../common/shelljs_wrapper')
const { getProjectPath, getPackageJSON, getCurrentBranch } = require('../util')
const logger = require('../logger')

function init (addWhat) {
  // 前往工程的父目录
  const projectPath = getProjectPath()
  sh.cd(projectPath)

  // 检测代码是否干净
  const diff = sh.exec('git diff', { silent: true })
  if (diff.stdout !== '') {
    logger.warn('Dirty！确保你本地代码是干净的')
    return false
  }
  // master
  const currentBranch = getCurrentBranch()
  if (currentBranch !== 'master') {
    logger.warn('确保你处于master分支')
    return false
  }

  const info = getPackageJSON()
  if (!(info.repository && info.repository.url && info.repository.url.includes('https://github.com/gmfe/'))) {
    logger.warn('确保是 github gmfe 的库')
    return false
  }

  if (!sh.exec('npm whoami --registry="https://registry.npmjs.org"', { silent: true }).stdout.startsWith('gmfe')) {
    logger.info('npm account is not gmfe')
    return false
  }

  if (addWhat) {
    if (addWhat === 'major' || addWhat === 'minor' || addWhat === 'patch') {
      // 需要移除 package -lock.json 文件才能 npm version。
      sh.exec(`rm -rf package-lock.json && npm version ${addWhat} && git push origin master:master --tags`)
    } else {
      logger.warn('-a 参数错误')
      return false
    }
  }

  logger.info(`start to publish ${info.name} ...`)
  sh.exec('npm publish')

  process.on('exit', function () {
    logger.info('gmfe exit')
  })
}

module.exports = init

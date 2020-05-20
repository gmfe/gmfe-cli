const sh = require('./common/shelljs_wrapper')
const logger = require('./logger')

function getProjectPath() {
  try {
    const dir = sh.exec('git rev-parse --git-dir', { silent: true })
    if (dir.stdout === '.git\n') {
      return sh.pwd()
    }
    return dir.stdout.replace(/\/.git|\n/g, '')
  } catch (e) {
    logger.fatalAndExit('无法定位git工程')
  }
}

const getCurrentBranch = () => {
  const branch = sh
    .exec("git branch | sed -n '/\\* /s///p'", { silent: true })
    .stdout.replace('\n', '')
  return branch
}

const getLastCommit = () => {
  return sh
    .exec('git rev-parse --short HEAD', { silent: true })
    .stdout.replace('\n', '')
}

const getProjectName = () => {
  const projectPath = getProjectPath()

  const projectName = projectPath.split('/')[3].split('_')[2]
  if (!projectName) {
    logger.fatalAndExit('获取项目名称失败，请确认所在路径正确！')
  }
  return projectName
}

const getPackageJSON = () => {
  return JSON.parse(sh.exec('cat package.json', { silent: true }).stdout)
}

const getOrigin = () => {
  const { stdout } = sh.exec('git config --get remote.origin.url')
  return stdout.replace('\n', '')
}

module.exports = {
  getCurrentBranch,
  getProjectPath,
  getProjectName,
  getPackageJSON,
  getLastCommit,
  getOrigin
}

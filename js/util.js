const sh = require('./common/shelljs_wrapper')
const logger = require('./logger')

function getProjectPath () {
  try {
    const dir = sh.exec('git rev-parse --git-dir', { silent: true })
    if (dir.stdout === '.git\n') {
      return sh.pwd()
    }
    return dir.stdout.replace(/\/.git|\n/g, '')
  } catch (e) {
    logger.fatal('无法定位git工程')
  }
}

const getCurrentBranch = () => {
  const branch = sh.exec("git branch | sed -n '/\\* /s///p'", { silent: true }).stdout.replace('\n', '')
  return branch
}

const verifyBranch = (branch) => {
  try {
    sh.exec(`git rev-parse --verify origin/${branch}`, { silent: true })
  } catch (e) {
    logger.fatal(`分支${branch}不存在，请输入准确的分支名`)
  }
}

const getLastCommit = () => {
  return sh.exec('git rev-parse --short HEAD', { silent: true }).stdout.replace('\n', '')
}

const getProjectName = () => {
  const projectPath = getProjectPath()

  return projectPath.split('/').pop().split('_')[2]
}

const remoteTemplatePathCheck = (branch) => {
  const check = sh.exec(`if ssh static.cluster.gm '[ -d /data/templates/${getProjectName()}/${branch || getCurrentBranch()}/ ]'; then echo "succ"; exit 1; else echo "fail"; fi`, { silent: true })

  return check.stdout === 'succ\n'
}

const getPackageJSON = () => {
  return JSON.parse(sh.exec('cat package.json', { silent: true }).stdout)
}

module.exports = {
  verifyBranch,
  getCurrentBranch,
  getProjectPath,
  getProjectName,
  remoteTemplatePathCheck,
  getPackageJSON,
  getLastCommit
}

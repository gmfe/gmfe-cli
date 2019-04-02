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
    logger.fatalAndExit('无法定位git工程')
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
    logger.fatalAndExit(`分支${branch}不存在，请输入准确的分支名`)
  }
}

const getLastCommit = () => {
  return sh.exec('git rev-parse --short HEAD', { silent: true }).stdout.replace('\n', '')
}

const getLastMessage = () => {
  return sh.exec('git log -1 --pretty=%B', { silent: true }).stdout.replace('\n', '')
}

const getProjectName = () => {
  const projectPath = getProjectPath()

  let projectName = projectPath.split('/').pop().split('_')[2]
  if (!projectName) {
    logger.fatalAndExit('获取项目名称失败，请确认所在路径正确！')
  }
  return projectName
}

const remoteTemplatePathCheck = (branch) => {
  const check = sh.exec(`if ssh static.cluster.gm '[ -d /data/templates/${getProjectName()}/${branch || getCurrentBranch()}/ ]'; then echo "succ"; exit 1; else echo "fail"; fi`, { silent: true })

  return check.stdout === 'succ\n'
}

const getPackageJSON = () => {
  return JSON.parse(sh.exec('cat package.json', { silent: true }).stdout)
}

const getGrayDir = (projectName, grayBranch) => {
  return `.gray_release/gm_static_${projectName}_${grayBranch}`
}

const prefix = 'git@code.guanmai.cn:front-end/'
const getCodeUrl = () => {
  return prefix + 'gm_static_' + getProjectName()
}
const checkoutBranch = (branch) => {
  sh.exec(`git fetch origin ${branch}`)
  sh.exec(`git checkout ${branch}`)
  sh.exec(`git reset origin/${branch} --hard`)
}

module.exports = {
  verifyBranch,
  getCurrentBranch,
  getProjectPath,
  getProjectName,
  remoteTemplatePathCheck,
  getPackageJSON,
  getLastCommit,
  getGrayDir,
  getLastMessage,
  getCodeUrl,
  checkoutBranch
}

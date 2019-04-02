const sh = require('../common/shelljs_wrapper')
const fs = require('fs')
const Util = require('../util')
const logger = require('../logger')
const { getProjectName, getProjectPath, getGrayDir, getCodeUrl, checkoutBranch } = Util

function prepareGray (grayBranch) {
  if (!grayBranch.startsWith('release-')) {
    logger.fatalAndExit(`分支${grayBranch}不正确，请输入以“release-“开头的的灰度分支名`)
  }

  const projectName = getProjectName()
  const grayDir = getGrayDir(projectName, grayBranch)

  logger.info('>>>>>>>>>> 灰度发布准备')
  if (!fs.existsSync(grayDir)) {
    // 首次发布
    sh.exec(`mkdir -p ${grayDir}`, { silent: true })
    const url = getCodeUrl()
    sh.exec(`git clone ${url} ${grayDir}`)
  }
  sh.cd(`${getProjectPath()}/${grayDir}`)
  checkoutBranch(grayBranch)
}

module.exports = {
  prepareGray
}

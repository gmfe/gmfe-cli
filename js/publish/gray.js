const sh = require('../common/shelljs_wrapper')
const fs = require('fs')
const Util = require('../util')
const logger = require('../logger')
const { getProjectName, getProjectPath } = Util

function grayCheck (grayBranch) {
  if (!grayBranch.startsWith('release-')) {
    logger.fatal(`分支${grayBranch}不正确，请输入以“release-“开头的的灰度分支名`)
  }

  const projectName = getProjectName()
  const grayDir = `.gray_release/gm_static_${projectName}_${grayBranch}`

  logger.info('>>>>>>>>>> 灰度发布准备')
  sh.exec('mkdir -p .gray_release', { silent: true })

  if (!fs.existsSync(grayDir)) {
    sh.exec(`mkdir -p ${grayDir}`, { silent: true })
    sh.exec(`rsync -aztHv  --exclude .test_release --exclude .gray_release --exclude backup . ${grayDir}`, { silent: true })
  }

  sh.cd(`${getProjectPath()}/${grayDir}`)
  sh.exec(`git checkout ${grayBranch}`, { silent: true })
  sh.exec(`git pull origin ${grayBranch}`)
}

module.exports = grayCheck

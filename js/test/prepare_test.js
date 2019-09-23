const sh = require('../common/shelljs_wrapper')
const fs = require('fs')
const Util = require('../util')
const { getProjectName, getProjectPath, getCodeUrl, checkoutBranch } = Util

function prepareTest (testBranch) {
  const projectName = getProjectName()

  const testDir = `.test_release/gm_static_${projectName}_${testBranch}`
  const url = getCodeUrl()
  if (!fs.existsSync(testDir)) {
    sh.exec(`mkdir -p ${testDir}`, { silent: true })
    sh.exec(`git clone ${url} ${testDir}`)
    // 测试环境要同步一下配置
    sh.exec(`rsync ./config/local.json ${testDir}/config`, { silent: true })
    // sh.exec(`rsync -aztHv --exclude .test_release --exclude .gray_release --exclude backup . ${testDir}`, { silent: true })
  }

  sh.cd(`${getProjectPath()}/${testDir}`)
  const { stdout } = sh.exec('git config --get remote.origin.url')
  if (stdout.trim() !== url) {
    sh.exec(`git remote set-url origin ${url}`)
  }
  checkoutBranch(testBranch)
}

module.exports = prepareTest

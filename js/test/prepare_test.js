const sh = require('../common/shelljs_wrapper')
const fs = require('fs')
const Util = require('../util')
const { getProjectName, getProjectPath, getOrigin } = Util

function prepareTest(testBranch) {
  const projectName = getProjectName()

  const testDir = `.test_release/gm_static_${projectName}_${testBranch}`
  const url = getOrigin()

  if (!fs.existsSync(testDir)) {
    sh.exec(`mkdir -p ${testDir}`, { silent: true })
    sh.exec(`git clone ${url} ${testDir}`)
    // 测试环境要同步一下配置
    sh.exec(`rsync ./config ${testDir}/config`, { silent: true })
  }

  sh.cd(`${getProjectPath()}/${testDir}`)
}

module.exports = prepareTest

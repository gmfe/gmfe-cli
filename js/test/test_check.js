const sh = require('../common/shelljs_wrapper')
const fs = require('fs')
const Util = require('../util')
const { getProjectName, getProjectPath } = Util

function testCheck (testBranch) {
  const projectName = getProjectName()

  const testDir = `.test_release/gm_static_${projectName}_${testBranch}`

  sh.exec('mkdir -p .test_release', { silent: true })

  if (!fs.existsSync(testDir)) {
    sh.exec(`mkdir -p ${testDir}`, { silent: true })
    sh.exec(`rsync -aztHv --exclude .test_release --exclude .gray_release --exclude backup . ${testDir}`, { silent: true })
  }

  sh.cd(`${getProjectPath()}/${testDir}`)
  sh.exec(`git checkout ${testBranch}`, { silent: true })
  sh.exec(`git pull origin ${testBranch}`)
}

module.exports = testCheck

const tmp = require('tmp')
const logger = require('../logger')
const fs = require('fs-extra')
const sh = require('../common/shelljs_wrapper')
const { push } = require('../common/shelljs_wrapper').ErrorHandler
const CodingService = require('./coding_service')
const online = require('./online')
const { dingCIError } = require('./ding')
const resolveVersion = ({ tag: version, branch }) => {
  // 默认发 master latest
  // 有 branch 发 latest
  // 没有就直接发 version
  if (!version && !branch) {
    return {
      branch: 'master',
      hash: 'latest',
      version: 'master-latest'
    }
  } else if (branch) {
    return {
      branch,
      hash: 'latest',
      version: `${branch}-latest`
    }
  } else {
    // branch_hash
    const splitIndex = version.lastIndexOf('-')
    const branch = version.slice(0, splitIndex)
    const hash = version.slice(splitIndex + 1)
    return {
      branch,
      version,
      hash
    }
  }
}

const publish = async args => {
  const { user, projectName } = args
  const { branch, version, hash } = resolveVersion(args)
  const isCI = user === 'coding_ci'
  const ctx = {
    isCI,
    user,
    version,
    projectName,
    branch,
    hash
  }
  logger.info(
    `[${user}]开始发布项目[${projectName}] Branch: ${branch} Version: ${version}`
  )
  // if (isCI) {
  // ci 出错通知dingding
  push((cmd, errMsg) => {
    dingCIError(ctx, cmd)
  })
  // }

  const codingService = CodingService.create(ctx)
  const tarPath = codingService.getBuildTarPath()

  const tmpDir = tmp.tmpNameSync()
  fs.ensureDirSync(tmpDir)
  sh.exec(`tar zxvf ${tarPath} -C ${tmpDir}`)
  sh.cd(tmpDir)
  await online(ctx)
  fs.removeSync(tmpDir)
}
module.exports = publish

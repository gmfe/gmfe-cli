const tmp = require('tmp')
const logger = require('../logger')
const fs = require('fs-extra')
const sh = require('../common/shelljs_wrapper')
const { push } = require('../common/shelljs_wrapper').ErrorHandler
const CodingService = require('./coding_service')
const online = require('./online')
const { dingCIError } = require('./ding')
const resolveArgs = args => {
  // 默认 master latest
  const branch = args.branch || 'master'
  let { hash, projectName } = args
  if (hash) {
    hash = hash.slice(0, 7)
  } else {
    hash = 'latest'
  }

  if (projectName.includes('_')) {
    projectName = projectName.split('_')[2]
  }
  return {
    branch,
    hash,
    version: `${branch}-${hash}`,
    projectName
  }
}

const publish = async args => {
  const { user } = args

  const { branch, version, hash, projectName } = resolveArgs(args)
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
  if (isCI) {
    // ci 出错通知dingding
    push((cmd, errMsg) => {
      dingCIError(ctx, cmd)
    })
  }

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

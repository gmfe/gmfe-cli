const tmp = require('tmp')
const fs = require('fs-extra')
const sh = require('../common/shelljs_wrapper')
const CodingService = require('./coding_service')
const { postOnline, ding, rsyncTpl, syncTemplate } = require('./util')

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

  // 拉取版本
  const codingService = CodingService.create(ctx)
  const tarPath = codingService.getBuildTarPath()

  // 解压
  const tmpDir = tmp.tmpNameSync()
  fs.ensureDirSync(tmpDir)
  sh.exec(`tar zxvf ${tarPath} -C ${tmpDir}`)

  // 前往目录
  sh.cd(tmpDir)

  // 同步静态资源
  sh.exec(
    `rsync -aztHv --rsh=ssh ./build/ static.cluster.gm:/data/www/static_resource/${projectName}/`
  )

  // 同步模板
  // mes 模板不同
  const tplName = projectName === 'mes' ? 'mes' : 'index'
  rsyncTpl(projectName, branch, tplName)
  // 同步模板到机器
  await syncTemplate(projectName, branch)

  // 移除临时目录
  fs.removeSync(tmpDir)

  // 通知
  ding(user, projectName, branch, version)
  postOnline()
}

module.exports = publish

const sh = require('../common/shelljs_wrapper')
const preview = require('./preview')
const testCheck = require('./test_check')
const { getProjectPath, getProjectName, getLastCommit } = require('../util')
const logger = require('../logger')

function init (branch = 'master') {
  // 前往工程的父目录
  const projectPath = getProjectPath()
  sh.cd(projectPath)

  // 主要是对当前的工程检查一遍
  preview(branch)

  logger.info('>>>>>>>>>> 测试部署准备')
  // 测试发布 进入.test_release 拉最新代码
  if (branch !== 'master') {
    testCheck(branch)
  }

  logger.info('最近5次提交')
  sh.exec('git log -n 5 --decorate=full')
  logger.info('>>>>>>>>>> 测试部署准备就绪')

  logger.info('>>>>>>>>>> 执行打包')

  sh.exec(`BRANCH=${branch} COMMIT=${getLastCommit()} npm run testing`)

  logger.info('打包完成!')

  const projectName = getProjectName()
  const distPath = `/data/templates/${projectName}/${branch}/`

  sh.exec(`rsync -aztHv ./build/ /data/www/static_resource/${projectName}/`)

  // 确保distPath目录存在
  sh.exec(`mkdir -p ${distPath};`)
  sh.exec(`ssh devhost.guanmai.cn mkdir -p ${distPath};`)

  if (projectName === 'mes') {
    sh.exec(`rsync -aztHv ./build/mes.html dev.guanmai.cn:${distPath}`)
    sh.exec(`rsync -aztHv ./build/mes.html devhost.guanmai.cn:${distPath}`)
  } else {
    sh.exec(`rsync -aztHv ./build/index.html dev.guanmai.cn:${distPath}`)
    sh.exec(`rsync -aztHv ./build/index.html devhost.guanmai.cn:${distPath}`)
  }

  logger.info('测试部署完成!')

  // event
  process.on('exit', function () {
    logger.info('gmfe exit')
  })
}

module.exports = init

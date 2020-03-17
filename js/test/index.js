const sh = require('../common/shelljs_wrapper')
const prepareTest = require('./prepare_test')
const { getProjectPath, getProjectName, getLastCommit } = require('../util')

function init(branch = 'master') {
  // 前往工程的父目录
  const projectPath = getProjectPath()
  sh.cd(projectPath)

  // 测试部署准备
  if (branch !== 'master') {
    // 非 master 可能需要准备好
    prepareTest(branch)
  }
  sh.exec('git fetch')
  sh.exec(`git checkout ${branch}`)
  sh.exec(`git reset origin/${branch} --hard`)
  sh.exec('yarn')
  // 执行打包
  sh.exec(
    `GIT_BRANCH=${branch} GIT_COMMIT=${getLastCommit()} yarn run build:test`
  )

  const projectName = getProjectName()

  // 同步静态代码
  sh.exec(`rsync -aztHv ./build/ /data/www/static_resource/${projectName}/`)

  // cd
  const distPath = `/data/templates/${projectName}/${branch}/`
  if (projectName === 'mes') {
    sh.exec(`rsync -aztHv ./build/mes.html dev.guanmai.cn:${distPath}`)
    sh.exec(`rsync -aztHv ./build/mes.html devhost.guanmai.cn:${distPath}`)
  } else {
    sh.exec(`rsync -aztHv ./build/index.html dev.guanmai.cn:${distPath}`)
    sh.exec(`rsync -aztHv ./build/index.html devhost.guanmai.cn:${distPath}`)
  }

  console.log('测试部署完成!')

  // event
  process.on('exit', function() {
    console.log('gmfe exit')
  })
}

module.exports = init

const sh = require('../common/shelljs_wrapper')
const moment = require('moment')
const http = require('http')
const Util = require('../util')
const logger = require('../logger')
const { getCurrentBranch, getProjectName } = Util

function online () {
  logger.info('>>>>>>>>>> 执行上线')

  const branchName = getCurrentBranch()

  const projectName = getProjectName()

  const distPath = `/data/templates/${projectName}/${branchName}/`

  logger.info('执行同步脚本')

  sh.exec(`rsync -aztHv --rsh=ssh ./build/ static.cluster.gm:/data/www/static_resource/${projectName}/`)

  // 确保distPath目录存在
  sh.exec(`ssh template.cluster.gm mkdir -p ${distPath};`)

  // 特殊逻辑，mes的模板推送到/data/templates/station/${branchName}/
  if (projectName === 'mes') {
    sh.exec(`rsync -aztHv --rsh=ssh ./build/mes.html template.cluster.gm:${distPath}`)
  } else if (projectName === 'station' || projectName === 'bshop' || projectName === 'manage') {
    // station、manage、bshop在不同的机器上
    sh.exec(`rsync -aztHv --rsh=ssh ./build/index.html ${projectName}.cluster.gm:${distPath}`)
  } else {
    sh.exec(`rsync -aztHv --rsh=ssh ./build/index.html template.cluster.gm:${distPath}`)
  }

  logger.info('上线完成!')
}

function backup (user) {
  const branchName = getCurrentBranch()

  const tag = branchName.split('-')[0] + '_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '_' + user

  const fileName = `backup/${tag}.tar.gz`

  logger.info('>>>>>>>>>> 执行备份')

  logger.info('打版本tag ' + tag)
  sh.exec('git tag ' + tag + '; git push --tags')

  sh.exec('mkdir -p backup')
  logger.info(`备份 ${fileName}`)
  sh.exec(`tar zcvf ${fileName} build`, { silent: true })
  logger.info('备份完成')

  dingtalk(tag)
}

function dingtalk (tag) {
  const projectName = getProjectName()
  http.get('http://gate.guanmai.cn:8083/tag/' + tag + '  ' + projectName)
}

function postOnline (user, isNeedBackup = false) {
  isNeedBackup && backup(user)

  logger.info(`
    //
    //                       _oo0oo_
    //                      o8888888o
    //                      88" . "88
    //                      (| -_- |)
    //                      0\\  =  /0
    //                    ___/\`---'\\___
    //                  .' \\\\|     |// '.
    //                 / \\\\|||  :  |||// \\
    //                / _||||| -:- |||||- \\
    //               |   | \\\\\\  -  /// |   |
    //               | \\_|  ''\\---/''  |_/ |
    //               \\  .-\\__  '-'  ___/-. /
    //             ___'. .'  /--.--\\  \`. .'___
    //          ."" '<  \`.___\\_<|>_/___.' >' "".
    //         | | :  \`- \\\`.;\`\\ _ /\`;.\`/ - \` : | |
    //         \\  \\ \`_.   \\_ __\\ /__ _/   .-\` /  /
    //     =====\`-.____\`.___ \\_____/___.-\`___.-'=====
    //                       \`=---='
    //
    //     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    //               佛祖保佑         永无BUG
    //
    //             ❤ ❤ ❤ ❤ 棒棒哒，么么哒！❤ ❤ ❤ ❤
    //`)
}

module.exports = {
  online,
  postOnline
}

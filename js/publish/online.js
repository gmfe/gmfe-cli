const sh = require('../common/shelljs_wrapper')
const moment = require('moment')
const http = require('http')
const Util = require('../util')
const logger = require('../logger')
const _ = require('lodash')
const { getCurrentBranch, getProjectName } = Util
const confirm = require('../common/confirm')

// 项目名称 到 后端 gmdeploy 的模板名称映射 参考:
// https://doc.guanmai.cn/%E7%B3%BB%E7%BB%9F%E8%BF%90%E7%BB%B4/%E5%85%A8%E6%96%B0%E5%8F%91%E5%B8%83%E8%84%9A%E6%9C%AC%E4%BD%BF%E7%94%A8-2018-10-18/
// 如果有新增直接添加即可
const names = `station_branch_frontend_more，station_branch_frontend_driver，station_branch_frontend_cds，station_branch_frontend_mes`
const nameList = names.split(/[,，]/g)
const indexNames = {
  bshop: 'bshop_branch_frontend_index',
  manage: 'manage_branch_frontend_index',
  station: 'station_branch_frontend_index'
}

function getBackEndTplName (projectName) {
  let tplName = indexNames[projectName] || _.find(nameList, name => name.includes(projectName))
  return tplName
}
async function syncTemplate (branchName, backendTplName) {
  // 后端未发版本，是纯前端修改，需要手动同步 gate 的模板到后端所在机器
  let shouldSyncTemplate = !(await confirm(
    '本次发布是否跟后端相关?(Yes:后端需要发版本，由后端来同步模板. No:前端来同步模板)',
    false
  ))
  if (shouldSyncTemplate) {
    logger.info(
      '同步模板到后端机器...如果未成功可尝试手动执行以下 gmdeploy 命令'
    )
    sh.exec(`gmdeploy scp -p ${backendTplName} -b ${branchName}`,{ignoreError: true})
  }
}
function startRsyncTpl (distPath) {
  return (domain, tpl = 'index') => {
    sh.exec(`ssh ${domain} mkdir -p ${distPath};`)
    sh.exec(`rsync -aztHv --rsh=ssh ./build/${tpl}.html ${domain}:${distPath}`)
  }
}

async function online () {
  logger.info('>>>>>>>>>> 执行上线')

  const branchName = getCurrentBranch()

  const projectName = getProjectName()

  const distPath = `/data/templates/${projectName}/${branchName}/`

  logger.info('执行同步脚本')
  sh.exec(
    `rsync -aztHv --rsh=ssh ./build/ static.cluster.gm:/data/www/static_resource/${projectName}/`
  )

  // 同步模板 开始
  let rsync = startRsyncTpl(distPath)
  // mes 模板不同
  let tplName = projectName === 'mes' ? 'mes' : 'index'

  // 模板统一先放 gate 机器
  rsync('gate.guanmai.cn', tplName)

  // 同步到各个项目所在的后端机器
  let backendTplName = getBackEndTplName(projectName)
  if (backendTplName) {
    // 走 gmdeploy 同步
    await syncTemplate(branchName, backendTplName)
  } else {
    // gmdeploy 暂不支持，用旧的同步
    if (projectName === 'yunguanjia') {
      rsync(`${projectName}.cluster.gm`)
    } else {
      rsync(`template.cluster.gm`)
    }
  }

  logger.info('上线完成!')
}

function backup (user) {
  const branchName = getCurrentBranch()

  const tag =
    branchName.split('-')[0] +
    '_' +
    moment().format('YYYY_MM_DD_HH_mm_ss') +
    '_' +
    user

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

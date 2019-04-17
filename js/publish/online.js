const sh = require('../common/shelljs_wrapper')
const moment = require('moment')
const Util = require('../util')
const logger = require('../logger')
const _ = require('lodash')
const { getCurrentBranch, getProjectName, getLastMessage, getLastCommit } = Util
const confirm = require('../common/confirm')

// 项目名称 到 后端 gmdeploy 的模板名称映射 参考:
// https://doc.guanmai.cn/%E7%B3%BB%E7%BB%9F%E8%BF%90%E7%BB%B4/%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97/%E5%85%A8%E6%96%B0%E5%8F%91%E5%B8%83%E8%84%9A%E6%9C%AC%E4%BD%BF%E7%94%A8-2018-10-18/
// 如果有新增直接添加即可
const names = `station_branch_frontend_more，station_branch_frontend_cds，station_branch_frontend_mes`
const nameList = names.split(/[,，]/g)
const indexNames = {
  bshop: 'bshop_branch_frontend_index',
  manage: 'manage_branch_frontend_index',
  station: 'station_branch_frontend_index',
  upms: ['station_branch_frontend_upms', 'manage_branch_frontend_upms'],
  driver: ['station_branch_frontend_driver', 'sorting_branch_frontend_index']

}

function getBackEndTplName (projectName) {
  let tplName = indexNames[projectName] || _.find(nameList, name => name.includes(projectName))
  return tplName
}
async function syncTemplate (projectName, branchName, showConfirm = false) {
  let backendTplName = getBackEndTplName(projectName)
  if (backendTplName) {
    // 后端未发版本，是纯前端修改，需要手动同步 gate 的模板到后端所在机器
    let shouldSyncTemplate = true

    if (showConfirm) {
      shouldSyncTemplate = !(await confirm(
        '本次发布是否跟后端相关?(Yes:后端需要发版本，由后端来同步模板. No:前端来同步模板)',
        false
      ))
    }
    if (shouldSyncTemplate) {
      logger.info('同步模板到后端机器...如果未成功可尝试手动执行以下 gmdeploy 命令...')
      if (Array.isArray(backendTplName)) {
        backendTplName.forEach((name) => {
          sh.exec(`gmdeploy scp -p ${name} -b ${branchName}`, {ignoreError: true})
        })
      } else {
        sh.exec(`gmdeploy scp -p ${backendTplName} -b ${branchName}`, {ignoreError: true})
      }
    }
    return true
  }
  return false
}
function oldSyncTemplate (projectName, rsync) {
  if (projectName === 'admin') {
    return
  }
  let names = ['station', 'bshop', 'manage', 'yunguanjia']
  let domain = names.includes(projectName) ? `${projectName}.cluster.gm` : 'template.cluster.gm'
  rsync(domain)
}
function startRsyncTpl (distPath, tplName) {
  return (domain) => {
    sh.exec(`ssh ${domain} mkdir -p ${distPath};`)
    sh.exec(`rsync -aztHv --rsh=ssh ./build/${tplName}.html ${domain}:${distPath}`)
  }
}

async function online () {
  logger.info('>>>>>>>>>> 执行上线')

  const branchName = getCurrentBranch()
  const projectName = getProjectName()
  const distPath = `/data/templates/${projectName}/${branchName}/`

  logger.info('执行同步脚本')
  // 同步静态资源
  sh.exec(`rsync -aztHv --rsh=ssh ./build/ static.cluster.gm:/data/www/static_resource/${projectName}/`)

  // mes 模板不同
  let tplName = projectName === 'mes' ? 'mes' : 'index'
  // 同步模板 开始
  let rsync = startRsyncTpl(distPath, tplName)

  // 模板统一要放 gate 机器
  rsync('gate.guanmai.cn')

  let couldSync = await syncTemplate(projectName, branchName)
  // 逐步废弃旧的
  if (!couldSync) {
    oldSyncTemplate(projectName, rsync)
  }

  logger.info('上线完成!')
}

function backup (user) {
  const branch = getCurrentBranch()
  let time = moment().format('YYYY_MM_DD_HH_mm')
  const tag = [branch, time, user].join('_')

  const fileName = `backup/${tag}.tar.gz`

  logger.info('>>>>>>>>>> 执行备份')

  logger.info('打版本tag ' + tag)
  sh.exec('git tag ' + tag + '; git push --tags')

  sh.exec('mkdir -p backup')
  logger.info(`备份 ${fileName}`)
  sh.exec(`tar zcvf ${fileName} build`, { silent: true })
  logger.info('备份完成')

  logger.info('快速回滚到上一次发布步骤', '如下')
  logger.info('1. 查询之前发布的 Tag', 'git log --decorate=full / git log --tags --decorate --simplify-by-decoration --oneline')
  logger.info('2. 填入 Tag 并执行', `gmfe publish -u ${user} -t {tag}`)
  dingtalk(tag, user)
}

let start = moment()
function dingtalk (tag, user) {
  const axios = require('axios')
  const project = getProjectName()
  const branch = getCurrentBranch()
  const message = getLastMessage()
  const commit = getLastCommit()
  let end = moment()
  let time = Math.round(moment.duration(end.diff(start)).asMinutes())
  let params = {
    tag,
    project,
    user,
    message,
    commit,
    branch,
    time
  }

  logger.info('本次发布时长:', time + ' minutes')
  axios.post('http://trace.guanmai.cn/api/webhook/gmfe', params).catch((e) => {
    logger.error('发送钉钉失败', e.message)
  })
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

const sh = require('../common/shelljs_wrapper')
const logger = require('../logger')
const _ = require('lodash')
const { dingPublish } = require('./ding')

// 项目名称 到 后端 gmdeploy 的模板名称映射 参考:
// https://doc.guanmai.cn/%E7%B3%BB%E7%BB%9F%E8%BF%90%E7%BB%B4/%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97/%E5%85%A8%E6%96%B0%E5%8F%91%E5%B8%83%E8%84%9A%E6%9C%AC%E4%BD%BF%E7%94%A8-2018-10-18/
// 如果有新增直接添加即可
const names = `station_branch_frontend_more，station_branch_frontend_cds，station_branch_frontend_mes`
const nameList = names.split(/[,，]/g)
const indexNames = {
  bshop: 'bshop_branch_frontend_index',
  manage: 'manage_branch_frontend_index',
  station: ['station_branch_frontend_index', 'templates_branch_frontend_index'],
  upms: ['station_branch_frontend_upms', 'manage_branch_frontend_upms'],
  driver: ['station_branch_frontend_driver', 'sorting_branch_frontend_index'],
  pa: ['stock_branch_frontend_pa']
}

function getBackEndTplName(projectName) {
  const tplName =
    indexNames[projectName] ||
    _.find(nameList, name => name.includes(projectName))
  return tplName
}
async function syncTemplate(projectName, branchName, showConfirm = false) {
  const backendTplName = getBackEndTplName(projectName)
  if (backendTplName) {
    // 后端未发版本，是纯前端修改，需要手动同步 gate 的模板到后端所在机器

    logger.info(
      '同步模板到后端机器...如果未成功可尝试手动执行以下 gmdeploy 命令...'
    )
    if (Array.isArray(backendTplName)) {
      backendTplName.forEach(name => {
        sh.exec(`gmdeploy scp -p ${name} -b ${branchName}`)
      })
    } else {
      sh.exec(`gmdeploy scp -p ${backendTplName} -b ${branchName}`)
    }
    return true
  }
  return false
}

function startRsyncTpl(distPath, tplName) {
  return domain => {
    sh.exec(`ssh ${domain} mkdir -p ${distPath};`)
    sh.exec(
      `rsync -aztHv --rsh=ssh ./build/${tplName}.html ${domain}:${distPath}`
    )
  }
}

async function online(ctx) {
  const { projectName, branch } = ctx
  logger.info('>>>>>>>>>> 执行上线')

  const distPath = `/data/templates/${projectName}/${branch}/`

  logger.info('执行同步脚本')
  // 同步静态资源
  sh.exec(
    `rsync -aztHv --rsh=ssh ./build/ static.cluster.gm:/data/www/static_resource/${projectName}/`
  )

  // mes 模板不同
  const tplName = projectName === 'mes' ? 'mes' : 'index'
  // 同步模板 开始
  const rsync = startRsyncTpl(distPath, tplName)

  // 模板统一要放 gate 机器
  rsync('10.104.49.96')

  await syncTemplate(projectName, branch)
  logger.info('上线完成！开始发送钉钉...')
  dingPublish(ctx)
  postOnline()
}

function postOnline() {
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

module.exports = online

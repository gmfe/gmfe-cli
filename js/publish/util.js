const ChatBot = require('dingtalk-robot-sender')
const ORIGIN = 'https://oapi.dingtalk.com/robot/send'
const sh = require('../common/shelljs_wrapper')

// 项目名称 到 后端 gmdeploy 的模板名称映射 参考:
// https://doc.guanmai.cn/%E7%B3%BB%E7%BB%9F%E8%BF%90%E7%BB%B4/%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97/%E5%85%A8%E6%96%B0%E5%8F%91%E5%B8%83%E8%84%9A%E6%9C%AC%E4%BD%BF%E7%94%A8-2018-10-18/
// 如果有新增直接添加即可
function getBackEndTplName(projectName) {
  const pNames = {
    bshop: ['bshop_branch_frontend_index'],
    manage: ['manage_branch_frontend_index'],
    station: [
      'station_branch_frontend_index',
      'templates_branch_frontend_index'
    ],
    upms: ['station_branch_frontend_upms', 'manage_branch_frontend_upms'],
    driver: ['station_branch_frontend_driver', 'sorting_branch_frontend_index'],
    pa: ['stock_branch_frontend_pa'],
    more: ['station_branch_frontend_more'],
    cds: ['station_branch_frontend_cds'],
    mes: ['station_branch_frontend_mes']
  }
  return pNames[projectName]
}

const ding = (user, projectName, branch, version) => {
  const tokenMap = {
    tongzhi: '444c8cdecd6d7667757ae64a774ab9851dd9b365d85433bac7b41087afd6e2f9'
  }
  const type = branch === 'master' ? '全量' : '灰度'
  const title = `版本已发布`

  const text = `**${user}** 发布了 **${projectName}${type}**\n\n---\n\n**Version:**\n\n${version}\n\n`

  const params = {
    msgtype: 'markdown',
    markdown: {
      title,
      text
    }
  }

  const robots = ['tongzhi']
  robots.forEach(name => {
    const webhook = `${ORIGIN}?access_token=${tokenMap[name]}`
    const robot = new ChatBot({ webhook })
    robot.send(params)
  })
}

function rsyncTpl(projectName, branch, tplName) {
  // 模板统一要放 gate 机器
  const domain = '10.104.49.96'
  const distPath = `/data/templates/${projectName}/${branch}/`
  sh.exec(`ssh ${domain} mkdir -p ${distPath};`)
  sh.exec(
    `rsync -aztHv --rsh=ssh ./build/${tplName}.html ${domain}:${distPath}`
  )
}

async function syncTemplate(projectName, branchName) {
  let backendTplName = getBackEndTplName(projectName)
  if (backendTplName) {
    return false
  }

  if (!Array.isArray(backendTplName)) {
    backendTplName = [backendTplName]
  }

  backendTplName.forEach(name => {
    sh.exec(`gmdeploy scp -p ${name} -b ${branchName}`)
  })

  return true
}

function postOnline() {
  console.log(`
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
  postOnline,
  ding,
  rsyncTpl,
  syncTemplate
}

const ChatBot = require('dingtalk-robot-sender')
const ORIGIN = 'https://oapi.dingtalk.com/robot/send'

const tokenMap = {
  qianduanjishuzhongxin:
    'cbaef287a95e1625c540b1ed56e28c7b440c98e0dc0909191156888987c3219b',
  chanpin: '2ca2921d1f17eb7cdd67e26114d223bfd7c7f47b7487bdfb2d4bbfb8daba35a5',
  banbenfabu:
    '81898c17e5aaea32b2125f5ba53ad65cfdeffa889695e6764dfd533f7ac5863c',
  dev: '6821b5c3b2034de2c3027e572c87dcc447f10d3765ec950d15883105f8eb50fa'
}

const getUrl = name => {
  const token = tokenMap[name]
  return `${ORIGIN}?access_token=${token}`
}

const send = (dingTalkNames, data) => {
  if (!Array.isArray(dingTalkNames)) {
    dingTalkNames = [dingTalkNames]
  }
  dingTalkNames.forEach(name => {
    const webhook = getUrl(name)
    const robot = new ChatBot({ webhook })
    robot.send(data)
  })
}

const dingPublish = ({ user, projectName, branch, version }) => {
  // const dingNames = ['banbenfabu', 'chanpin', 'qianduanjishuzhongxin']
  const dingNames = ['dev']
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
  send(dingNames, params)
}

const dingCIError = ({ user, projectName, branch, version }, cmd) => {
  // const dingNames = ['banbenfabu', 'qianduanjishuzhongxin']
  const dingNames = ['dev']
  const title = `CD发布出错`
  const type = branch === 'master' ? '全量' : '灰度'
  const text = `！！！**${user}** 发布 **${projectName}(${type})出错**\n\n---\n\n**Version:**\n\n${version} \n\n**Cmd:**\n\n${cmd} \n\n`

  const params = {
    msgtype: 'markdown',
    markdown: {
      title,
      text
    }
  }
  send(dingNames, params)
}

module.exports = {
  dingPublish,
  dingCIError
}

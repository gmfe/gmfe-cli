const ChatBot = require('dingtalk-robot-sender')
const ORIGIN = 'https://oapi.dingtalk.com/robot/send'

const tokenMap = {
  tongzhi: '444c8cdecd6d7667757ae64a774ab9851dd9b365d85433bac7b41087afd6e2f9'
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
  const dingNames = ['tongzhi']
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
  const dingNames = ['tongzhi']
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

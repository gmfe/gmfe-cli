const sh = require('../common/shelljs_wrapper')
const fs = require('fs')
const path = require('path')
const logger = require('../logger')
const confirm = require('../common/confirm')
const { getGrayDir, getProjectName } = require('../util')

async function rollback (tag, branch) {
  if (branch !== 'master') {
    sh.cd(getGrayDir(getProjectName(), branch))
  }
  const fileName = `backup/${tag}.tar.gz`
  if (!fs.existsSync(fileName)) {
    logger.fatalAndExit(`${path.resolve(fileName)}不存在`)
  }

  await confirm(`回滚${branch}到${tag}`)

  logger.info('>>>>>>>>>> 执行rollback')
  logger.info(`解压 ${fileName}`)
  sh.exec(`tar zxvf ${fileName} -C ./`)
  logger.info(`解压完成`)
}

module.exports = rollback

const sh = require('../common/shelljs_wrapper')
const fs = require('fs')
const logger = require('../logger')

function rollback (tag) {
  const fileName = `backup/${tag}.tar.gz`

  const isExist = fs.existsSync(fileName)

  logger.info('>>>>>>>>>> 执行rollback')

  if (!isExist) {
    logger.fatal(`${fileName}不存在`)
  }

  logger.info(`解压 ${fileName}`)
  sh.exec(`tar zxvf ${fileName} -C ./`)
  logger.info(`解压完成`)
}

module.exports = rollback

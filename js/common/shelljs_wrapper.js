const sh = require('shelljs')
const logger = require('../logger')

let extra = {
  cd (destPath) {
    logger.info('切换目录', destPath)
    sh.cd(destPath)
  },
  exec (command, options = {}) {
    logger.info('执行命令', command)
    const execResult = sh.exec(command, options)
    if (execResult.code !== 0) {
      const msg = execResult.stderr
      logger.error(`【${command}】执行出错 \n${msg}`)
      throw new Error('')
    }
    return execResult
  }
}

module.exports = Object.assign(
  {},
  sh,
  extra
)

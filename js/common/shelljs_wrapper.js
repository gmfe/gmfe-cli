const sh = require('shelljs')
const logger = require('../logger')

const extra = {
  cd(destPath) {
    logger.info('切换目录', destPath)
    const execResult = sh.cd(destPath)
    if (execResult.code !== 0) {
      const msg = execResult.stderr
      logger.error(`路径【${destPath}】错误 \n${msg}`)
      throw new Error('')
    }
    return execResult
  },
  exec(command, options = {}) {
    logger.info('执行命令', command)
    const execResult = sh.exec(command, options)
    if (execResult.code !== 0) {
      const msg = execResult.stderr
      logger.error(`【${command}】执行出错 \n${msg}`)
      if (!options.ignoreError) {
        throw new Error('')
      }
    }
    return execResult
  }
}

module.exports = Object.assign({}, sh, extra)

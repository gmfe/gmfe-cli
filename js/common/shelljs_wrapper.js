const sh = require('shelljs')
const logger = require('../logger')

const handlers = []
const ErrorHandler = {
  push(func) {
    handlers.push(func)
  }
}

const extra = {
  cd(destPath) {
    logger.info('切换目录', '' + destPath)
    const execResult = sh.cd(destPath)
    logger.info(execResult.stdout)
    if (execResult.code !== 0) {
      const msg = execResult.stderr
      handlers.forEach(func => {
        func(`cd ${destPath}`, msg)
      })
      logger.error(`路径【${destPath}】错误 \n${msg}`)
      throw new Error('')
    }
    return execResult
  },
  exec(command, options = {}) {
    logger.info('执行命令', command)
    const execResult = sh.exec(command, {
      ...options,
      silent: true
    })
    logger.info(execResult.stdout)
    if (execResult.code !== 0) {
      const msg = execResult.stderr
      logger.error(`【${command}】执行出错 \n${msg}`)
      handlers.forEach(func => {
        func(command, msg)
      })
      throw new Error('')
    }
    return execResult
  }
}

module.exports = Object.assign({}, sh, extra, { ErrorHandler })

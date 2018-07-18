const sh = require('../common/shelljs_wrapper')
const { getLastCommit } = require('../util')
const logger = require('../logger')

function build (branch = 'master') {
  logger.info('>>>>>>>>>> 执行打包')

  logger.info('npm run deploy')
  sh.exec(`BRANCH=${branch} COMMIT=${getLastCommit()} npm run deploy`)

  logger.info('打包完成!')
}

module.exports = build

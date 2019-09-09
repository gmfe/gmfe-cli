const sh = require('shelljs')
const logger = require('./logger')

const help = require('./help')
const publishInit = require('./publish/index')
const testInit = require('./test/index')
const npmPublish = require('./npm_publish')
const check = require('./check')

// help 信息
const argv = help()

logger.debug('gmfe argv:', argv)

// 参数校验
if (argv._.length === 0) {
  sh.exec('gmfe -h')
  process.exit(0)
}

if (argv._.includes('publish') && argv.u) {
  publishInit(argv.t, argv.u, argv.b)
} else if (argv._.includes('test')) {
  testInit(argv.b)
} else if (argv._.includes('npm_publish')) {
  npmPublish(argv.a)
} else if (argv._.includes('check')) {
  check()
} else {
  sh.exec('gmfe -h')
  process.exit(0)
}

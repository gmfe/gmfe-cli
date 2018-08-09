const sh = require('../common/shelljs_wrapper')
const fs = require('fs')
const logger = require('../logger')
const path = require('path')

const root = process.cwd()

// image size
const size_array = [
  '16', '512', '60', '120', '72',
  '144', '76', '152', '32', '48',
  '96', '29', '58', '40', '80',
  '50', '100', '57'
]

function init (dir, filename) {
  if (!fs.existsSync(filename)) {
    logger.error('无法定位至文件')
    process.exit(1)
  }

  const suffixReg = /\.[^.]+$/
  const suffix = suffixReg.exec(filename)
  let m_dir = ''

  const dirname = path.resolve(root, dir || './logo')

  if (!fs.existsSync(dirname)) {
    sh.exec('mkdir ' + dirname)
  }

  for (var i = 0, len = size_array.length; i < len; i++) {
    m_dir = dirname + '/' + size_array[i] + suffix

    sh.exec('cp ' + filename + ' ' + m_dir)
    sh.exec('sips -Z ' + size_array[i] + ' ' + m_dir, { silent: true })
  }

  process.on('exit', function () {
    logger.info('图片裁剪完成!')
    logger.info('gmfe exit')
  })
}

module.exports = init

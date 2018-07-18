const fs = require('fs')
const path = require('path')
const sh = require('../common/shelljs_wrapper')
const logger = require('../logger')
const pinyin = require('gm-pinyin')
const _ = require('lodash')

function batchRenameDirToEN (dir = './images', dist = './rename') {
  const dirPath = path.resolve(dir)
  const distPath = path.resolve(dist)

  if (!fs.existsSync(dirPath)) {
    logger.error('无法定位文件')
    process.exit(1)
  }

  if (fs.existsSync(distPath)) {
    sh.exec('rm -rf ' + distPath)
  }

  sh.exec('mkdir ' + distPath)

  const files = fs.readdirSync(dirPath)

  _.each(files, filename => {
    fs.copyFileSync(path.join(dirPath, filename), path.join(distPath, getPinyinStr(filename)))
  })
}

function batchPinyin (dir = './name.txt', dist = './rename.txt') {
  const dirPath = path.resolve(dir)
  const distPath = path.resolve(dist)

  if (!fs.existsSync(dirPath)) {
    logger.error('无法定位文件')
    process.exit(1)
  }

  const text = fs.readFileSync(dirPath, 'utf-8')
  const arr = []
  text.split('/\r?\n/').forEach(line => {
    arr.push(getPinyinStr(line))
  })

  fs.writeFile(distPath, getPinyinStr(text), 'utf-8')
}

function batchRenameToEN (dir, dist) {
  if (dir.includes('.')) {
    batchPinyin(dir, dist)
  } else {
    batchRenameDirToEN(dir, dist)
  }
}

function getPinyinStr (text) {
  return _.map(pinyin(text, {
    style: pinyin.STYLE_NORMAL
  }), v => v[0]).join('')
}

module.exports = batchRenameToEN

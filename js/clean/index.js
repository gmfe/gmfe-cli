const sh = require('../common/shelljs_wrapper')
const { getProjectPath } = require('../util')
const logger = require('../logger')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const confirm = require('../common/confirm')

// 默认清理三个月前的
const DEFAULT_FILTER = '3_month'

async function clean (rootDir, filter = DEFAULT_FILTER) {
  const subDirs = fs.readdirSync(rootDir)
  let [num, unit] = filter.split('_')
  let count = 1
  let targetDirs = []
  subDirs.forEach((dirName) => {
    let targetDir = path.join(rootDir, dirName)
    let stats = fs.statSync(targetDir)
    if (moment(stats.ctime).add(num, unit).isBefore(moment())) {
      let createDate = moment(stats.ctime).format('YYYY-MM-DD')
      logger.info(`[${count++}] 待清理文件 ${dirName} -> ${createDate}`)
      targetDirs.push(targetDir)
    }
  })
  if (targetDirs.length === 0) {
    logger.info('没找到符合条件的文件!')
    return
  }
  await confirm(`确认删除以上文件？`)
  targetDirs.forEach((dir) => {
    sh.exec(`rm -rf ${dir}`)
  })
}

function main (type, filter) {
  const basePath = '' + getProjectPath()
  if (type === 'test') {
    let rootDir = path.join(basePath, '.test_release')
    clean(rootDir, filter)
  } else if (type === 'backup') {
    // 清理 master backup
    let rootDir = path.join(basePath, 'backup')
    clean(rootDir, filter)
  } else {
    // 默认清理灰度
    let rootDir = path.join(basePath, '.gray_release')
    clean(rootDir, filter)
  }
}

module.exports = main

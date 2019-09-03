const sh = require('../common/shelljs_wrapper')
const logger = require('../logger')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const confirm = require('../common/confirm')

// 默认清理三个月前的
const DEFAULT_FILTER = '1_month'

const getCleanDirs = (projectPaths, cleanDirName, filter) => {
  const targetDirs = []
  let count = 1
  for (let projectPath of projectPaths) {
    const rootDir = path.join(projectPath, cleanDirName)
    if (!fs.existsSync(rootDir)) {
      logger.info(`${rootDir} 不存在，exit`)
      continue
    }

    const subDirs = fs.readdirSync(rootDir)
    let [num, unit] = filter.split('_')
    subDirs.forEach((dirName) => {
      let targetDir = path.join(rootDir, dirName)
      let stats = fs.statSync(targetDir)
      if (moment(stats.ctime).add(num, unit).isBefore(moment())) {
        let createDate = moment(stats.ctime).format('YYYY-MM-DD')
        logger.info(`[${count++}] 待清理文件 ${dirName} -> ${createDate}`)
        targetDirs.push(targetDir)
      }
    })
  }

  return targetDirs
}

async function clean (cleanDirName, filter, showConfirm) {
  const basePath = process.cwd()
  const projectPaths = fs.readdirSync(basePath).filter((dirName) => dirName.startsWith('gm_static')).map((dir) => path.join(basePath, dir))
  const cleanDirs = getCleanDirs(projectPaths, cleanDirName, filter)
  if (cleanDirs.length === 0) {
    logger.info('没找到符合条件的文件!')
    return
  }

  showConfirm && await confirm(`确认删除以上文件？`)
  cleanDirs.forEach((dir) => {
    sh.exec(`rm -rf ${dir}`)
  })
  logger.info('done!')
}

function main (type, filter = DEFAULT_FILTER, confirm) {
  if (type === 'test') {
    clean('.test_release', filter, confirm)
  } else if (type === 'backup') {
    // 清理 backup
    clean('backup', filter, confirm)
  } else {
    // 默认清理灰度
    clean('.gray_release', filter, confirm)
  }
}

module.exports = main

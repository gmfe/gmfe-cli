
// 防止并行发同一个目录下的版本

const fs = require('fs')
const logger = require('../logger')
const moment = require('moment')
const path = require('path')

class FileLock {
  constructor () {
    this.isLocked = false
  }
  init (releaseDir, user) {
    this.lockPath = path.join(releaseDir, 'release.lock')
    this.user = user
  }
  warningAndExit (msg) {
    if (!msg) {
      msg = String(fs.readFileSync(this.lockPath)) + `(手动解除文件锁：rm -rf ${this.lockPath})`
    }
    logger.fatalAndExit(msg)
  }
  writeLock () {
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    try {
      fs.writeFileSync(this.lockPath, `[${this.user}]正在发布该版本(${time})，请稍后再试`, { flag: 'wx' })
      this.isLocked = true
      logger.info('添加文件锁', this.lockPath)
    } catch (e) {
      if (e.code === 'EEXIST') {
        this.warningAndExit()
      } else {
        logger.info(`添加文件锁${this.lockPath}失败`)
        throw e
      }
    }
  }
  check () {
    let stats = fs.statSync(this.lockPath)
    // 占用超过时间 (1h)
    if (moment(stats.ctime).add(1, 'h').isBefore(moment())) {
      try {
        fs.unlinkSync(this.lockPath)
      } catch (e) {
        if (e.code === 'ENOENT') {
          this.warningAndExit('有其他人正在操作...请稍后再试')
        }
        logger.info('解除文件锁失败')
        throw e
      }
      this.lock()
    } else {
      this.warningAndExit()
    }
  }
  lock () {
    if (fs.existsSync(this.lockPath)) {
      this.check()
    } else {
      this.writeLock()
    }
  }
  unLock () {
    if (this.isLocked) {
      logger.info('解除文件锁', fileLock.lockPath)
      try {
        fs.unlinkSync(this.lockPath)
      } catch (e) {
        logger.info('解除文件锁出错', e.message)
      }
    }
  }
}
const fileLock = new FileLock()

const onExit = require('signal-exit')

onExit(function () {
  fileLock.unLock()
})

module.exports = fileLock

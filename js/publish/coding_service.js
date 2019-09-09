const fs = require('fs-extra')
const sh = require('../common/shelljs_wrapper')
const logger = require('../logger')
const path = require('path')

const BASE_PATH = '/data/frontend_release/_gmfe_store'
class CodingService {
  constructor(ctx) {
    this.ctx = ctx
    this.projectName = ctx.projectName
    this.version = ctx.version
    this.targetDir = path.join(BASE_PATH, this.projectName)
    this.filePath = path.join(this.targetDir, this.version)
  }

  getUserAndPwd() {
    const userPath = path.join(BASE_PATH, 'user.json')
    // name, password
    return fs.readJSONSync(userPath)
  }

  getDownloadUrl() {
    return `https://gmfe-generic.pkg.coding.net/gm_static_${this.projectName}/build/build?version=${this.version}`
  }

  getFileSize() {
    let size = 0
    if (fs.existsSync(this.filePath)) {
      size = fs.statSync(this.filePath).size
    }
    return size
  }

  download() {
    const downloadUrl = this.getDownloadUrl()
    const { name, password } = this.getUserAndPwd()
    fs.ensureDirSync(this.targetDir)
    try {
      // 获取 status code https://superuser.com/a/442395
      const { stdout: statusCode } = sh.exec(
        `curl -L -s -o /dev/null -I -w "%{http_code}" -u ${name}:${password} "${downloadUrl}"`
      )
      if (statusCode.trim() === '404') {
        logger.error(
          `文件不存在，请确认项目(${this.projectName})和版本(${this.version})正确`
        )
        throw new Error('')
      }

      sh.exec(
        `curl -L -u ${name}:${password} "${downloadUrl}" -o ${this.filePath}`
      )
      // 再检查下
      const size = this.getFileSize()
      if (size === 0) {
        logger.error(`${this.filePath} 下载失败`)
        throw new Error('')
      }
    } catch (e) {
      sh.exec(`rm -rf ${this.filePath}`)
      throw new Error('')
    }
  }

  getBuildTarPath() {
    const size = this.getFileSize()
    if (this.ctx.hash === 'latest' || size === 0) {
      this.download()
    }
    return this.filePath
  }
}
CodingService.create = (...args) => {
  return new CodingService(...args)
}

module.exports = CodingService

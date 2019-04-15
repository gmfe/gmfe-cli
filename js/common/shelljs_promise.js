const sh = require('shelljs')

function exec (command) {
  return new Promise((resolve, reject) => {
    const result = sh.exec(command)
    if (result.code !== 0) {
      reject(result.stderr)
      return
    }

    resolve(result.stdout)
  })
}

module.exports = {
  exec: exec
}

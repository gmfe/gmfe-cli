const sh = require('shelljs');
const Log = require('../util').Log;

function online() {
    Log.info('>>>>>>>>>> 执行打包');

    Log.step('npm run deploy');
    sh.exec('npm run deploy');
}

module.exports = online;
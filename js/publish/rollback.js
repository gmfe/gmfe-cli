const sh = require('shelljs');
const Log = require('./util').Log;

function rollback(tag) {
    Log.info('>>>>>>>>>> 执行rollback');

    const fileName = `bak/${tag}.tar.gz`;

    Log.step(`解压 ${fileName}`);
    sh.exec(`tar zxvf ${fileName} -C ./`);

    Log.step('执行后置上线脚本 ./deploy/after_online');
    sh.exec('./deploy/after_online');
}

module.exports = rollback;
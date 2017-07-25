const sh = require('shelljs');
const Log = require('./util').Log;
const fs = require('fs');

function rollback(tag) {
    Log.info('>>>>>>>>>> 执行rollback');

    const fileName = `backup/${tag}.tar.gz`;
    const isExist = fs.existsSync(fileName);

    if (!isExist) {
        Log.error(`${fileName}不存在`);
        process.exit(1);
    }

    Log.step(`解压 ${fileName}`);
    sh.exec(`tar zxvf ${fileName} -C ./`);

    Log.step('执行后置上线脚本 ./deploy/after_online');
    sh.exec('./deploy/after_online');
}

module.exports = rollback;
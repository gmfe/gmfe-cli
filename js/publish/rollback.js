const sh = require('shelljs');
const fs = require('fs');
const Util = require('../util');
const {Log} = Util;

function rollback(tag) {
    const fileName = `backup/${tag}.tar.gz`,
        isExist = fs.existsSync(fileName);

    Log.info('>>>>>>>>>> 执行rollback');

    if (!isExist) {
        Log.error(`${fileName}不存在`);
        process.exit(1);
    }

    Log.step(`解压 ${fileName}`);
    sh.exec(`tar zxvf ${fileName} -C ./`);
    Log.step(`解压完成`);
}

module.exports = rollback;
const sh = require('shelljs');
const fs = require('fs');
const Util = require('../util');
const { logger } = Util;

function rollback(tag) {
    const fileName = `backup/${tag}.tar.gz`,
        isExist = fs.existsSync(fileName);

    logger.info('>>>>>>>>>> 执行rollback');

    if (!isExist) {
        logger.error(`${fileName}不存在`);
        process.exit(1);
    }

    logger.info(`解压 ${fileName}`);
    sh.exec(`tar zxvf ${fileName} -C ./`);
    logger.info(`解压完成`);
}

module.exports = rollback;
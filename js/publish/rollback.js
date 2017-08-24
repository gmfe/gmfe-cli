const sh = require('shelljs');
const Log = require('../util').Log;
const fs = require('fs');
const path = require('path');
const Util = require('../util');

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

    Log.step('执行上线脚本');

    const projectName = Util.getProjectPath().split('/').pop().replace('gm_static_', '');
    sh.exec(`rsync -aztH --exclude .git --exclude .svn --exclude .swp --exclude node_modules --rsh=ssh ./build/ static.cluster.gm:/data/www/static_resource/${projectName}/`);
}

module.exports = rollback;
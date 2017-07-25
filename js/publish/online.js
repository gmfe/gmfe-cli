const sh = require('shelljs');
const Log = require('./util').Log;
const readline = require('readline');
const moment = require('moment');
const _ = require('underscore');

function online(u) {
    Log.info('>>>>>>>>>> 执行上线');

    const tag = 'online_' + moment().format('YYYY_MM_DD_HH_mm') + '_' + u;

    Log.step('打版本tag ' + tag);
    sh.exec('git tag ' + tag + '; git push --tags');

    sh.exec('mkdir -p backup');
    const fileName = `backup/${tag}.tar.gz`;
    Log.step(`备份 ${fileName}`);
    sh.exec(`tar zcvf ${fileName} build`);

    Log.step('执行后置上线脚本 ./deploy/after_online');
    sh.exec('./deploy/after_online');
}

module.exports = online;
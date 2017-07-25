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

    sh.exec('mkdir -p bak');
    Log.step(`备份 bak/bak${tag}`);
    sh.exec(`tar zcvf ./bak/${tag}.tar.gz build`);

    Log.step('执行后置上线脚本 ./deploy/after_online');
    sh.exec('./deploy/after_online');
}

module.exports = online;
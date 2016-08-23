var sh = require('shelljs');
var Log = require('./util').Log;
var readline = require('readline');
var moment = require('moment');
var _ = require('underscore');

function online(u) {
    Log.info('>>>>>>>>>> 执行发布');

    var tag = 'online_' + moment().format('YY_MM_DD_HH_mm') + '_' + u;

    Log.step('打版本tag ' + tag);
    sh.exec('git tag ' + tag + '; git push --tags');

    Log.step('执行后置脚本 ./deploy/after_online');
    sh.exec('./deploy/after_online');
}

module.exports = online;
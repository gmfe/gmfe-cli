var sh = require('shelljs');
var Log = require('./util').Log;

function preview() {
    Log.info('Step1: preview');

    var diff = sh.exec('git diff', {silent: true});
    if (diff.stdout !== '') {
        Log.warn('Dirty！确保你本地代码是干净的。');
        return false;
    }

    var branch = sh.exec('git branch', {silent: true});
    if (branch.stdout.indexOf('* master\n') === -1) {
        Log.warn('No master！确保你处于master分支');
        return false;
    }

    // 拉最新代码
    sh.exec('git pull');

    // 比较远端代码
    var oDiff = sh.exec('git diff master origin/master');
    

    // 推送到deploy/preview。预发布环境，目前没有什么用。
    sh.exec('git push origin HEAD:deploy/preview');
}

module.exports = {
    preview
};
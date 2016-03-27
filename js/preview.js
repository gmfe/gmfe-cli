var sh = require('shelljs');
var Log = require('./util').Log;

function preview() {
    Log.info('>>>>>>>>>> 发布前检测');

    Log.step('检测本地代码');
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

    Log.step('拉远端代码');
    sh.exec('git pull');

    Log.step('比较远端代码');
    var oDiff = sh.exec('git diff master origin/master', {silent: true});
    if (oDiff.stdout !== '') {
        Log.warn('master不同于origin/master。是否忘记git push?');
        return false;
    }

    // deploy/preview预发布环境，目前没有什么用。
    Log.step('推送到预发布环境deploy/preview');
    sh.exec('git push origin HEAD:deploy/preview');

    return true;
}

module.exports = {
    preview
};
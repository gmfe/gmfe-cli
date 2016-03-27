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
    if (branch.stdout !== '* master\n') {
        Log.warn('No master！确保你处于master分支');
        return false;
    }

    sh.exec('git fetch; git reset --hard origin/master');

    // var mDiff = sh.exec('git diff master origin/master', {silent: true});
    // if (mDiff.stdout !== '') {
    //     Log.warn('Your master branch is different from origin/master. Maybe you forgot git push!');
    //     return false;
    // }

    sh.exec('git push origin HEAD:deploy/preview');
}

module.exports = {
    preview
};
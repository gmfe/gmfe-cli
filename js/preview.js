var sh = require('shelljs');
var Log = require('./util').Log;

function preview() {
    var diff = sh.exec('git diff', {silent: true});
    if (diff.stdout !== '') {
        Log.warn('Dirty, please make sure your working directory clean');
        return false;
    }

    var branch = sh.exec('git branch', {silent: true});
    if (branch.stdout !== '* master\n') {
        Log.warn('Make sure your branch is master');
        return false;
    }

    sh.exec('git fetch; git reset --hard origin/master');

    // var mDiff = sh.exec('git diff master origin/master', {silent: true});
    // if (mDiff.stdout !== '') {
    //     Log.warn('Your master branch is different from origin/master. Maybe you forgot git push!');
    //     return false;
    // }
    
    sh.exec('git push origin master:deploy/preview');
}

module.exports = {
    preview
};
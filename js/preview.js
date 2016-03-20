var sh = require('shelljs');
var Log = require('./log');

function preview() {
    var diff = sh.exec('git diff', {silent: true});
    if (diff.stdout !== '') {
        Log.warn('Dirty , please make sure your working directory clean');
        return false;
    }

    var branch = sh.exec('git branch');
    if(branch.stdout !== '* master\n'){
        Log.warn('Make sure your branch is master');
        return false;
    }

    sh.exec('git fetch');
    
    var mDiff = sh.exec('git diff master origin/master', {silent: true});
    if (mDiff.stdout !== '') {
        Log.warn('Your master branch is different from origin/master.');
        return false;
    }

    

}

module.exports = {
    preview: preview
};
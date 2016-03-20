var sh = require('shelljs');
var Log = require('./log');

function preview() {
    var diff = sh.exec('git diff', {silent: true});
    if (diff.stdout !== '') {
        Log.warn('dirty work directory, please confirm not forgetting git commit');
        return false;
    }

    var branch = sh.exec('git branch');
    if(branch.stdout !== '* master\n'){
        Log.warn('Make sure your branch is master');
        return false;
    }


}

module.exports = {
    preview: preview
};
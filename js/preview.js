var sh = require('shelljs');
var Log = require('./log');

function preview() {
    var diff = sh.exec('git diff', {silent: true});
    if (diff.code === 0) {
        if (diff.stdout !== '') {
            Log.warn('dirty work directory, please confirm not forgetting git commit', 'adfadf');
            return 1;
        }else{
            Log('gif diff ok');
            return 0;
        }
    } else {
        Log.error(diff.stderr);
    }
}

module.exports = {
    preview: preview
};
var sh = require("shelljs");

function preview() {
    var diff = sh.exec('git diff', {silent: true});
    if (diff.code === 0) {
        if (diff.stdout !== '') {
            console.warn('Warning: dirty work directory, please confirm not forgetting git commit');
        }else{
            console.log('gif diff ok');
        }
    } else {
        console.log(diff.stderr);
    }
}

module.exports = {
    preview: preview
};
var sh = require('shelljs');
var colors = require('colors');
var _ = require('underscore');

var Log = {
    log() {
        console.log.call(this, _.values(arguments).join(' '));
    },
    info() {
        console.log.call(this, colors.green('[Info] ' + _.values(arguments).join(' ')));
    },
    warn() {
        console.log.call(this, colors.yellow('[Warning] ' + _.values(arguments).join(' ')));
    },
    error() {
        console.log.call(this, colors.red('[Error] ' + _.values(arguments).join(' ')));
    },
    step(){
        console.log.call(this, colors.blue('' + _.values(arguments).join(' ')));
    }
};

var getProjectPath = function () {
    var dir = sh.exec('git rev-parse --git-dir', {silent: true});
    if (dir.code === 0) {
        if (dir.stdout === '.git\n') {
            return sh.pwd();
        } else {
            return dir.stdout.replace('/.git', '').replace('\n', '');
        }
    } else {
        return false;
    }
};

module.exports = {
    Log: Log,
    getProjectPath: getProjectPath
};
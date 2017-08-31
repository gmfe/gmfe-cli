const sh = require("shelljs");
const Util = require('../util');
const preview = require('./preview');
const confirm = require('./confirm');
const build = require('./build');
const online = require('./online');
const rollback = require('./rollback');
const Log = require('../util').Log;

function init(tag, user) {
    // 前往工程的父目录
    const projectPath = Util.getProjectPath();
    if (projectPath === false) {
        Log.error('无法定位git工程');
        process.exit(1);
    }
    sh.cd(projectPath);

    if (tag) {
        confirm(`回滚到${tag}`).then(() => {
            rollback(tag);
            process.exit(0);
        }).catch(() => {
            process.exit(1);
        });
    } else {
        // preview
        // 主要是对当前的工程检查一遍。 确认是Master，且clean。
        if (preview() === false) {
            process.exit(1);
        }

        // build
        confirm('打包').then(() => {
            build();

            return confirm('上线');
        }).then(() => {
            return online(user)
        }).catch(() => {
            process.exit(1);
        });
    }

    // event
    process.on('exit', function () {
        console.log('gmfe exit');
    });
}

module.exports = init;
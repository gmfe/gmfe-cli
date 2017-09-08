const sh = require("shelljs");
const preview = require('./preview');
const confirm = require('./confirm');
const build = require('./build');
const {online, postOnline} = require('./online');
const rollback = require('./rollback');
const gray = require('./gray');
const {getBranchName, getProjectPath, Log} = require('../util');

function init(tag, user, branch) {
    // 前往工程的父目录
    const projectPath = getProjectPath();
    if (projectPath === false) {
        Log.error('无法定位git工程');
        process.exit(1);
    }
    sh.cd(projectPath);

    // preview
    // 主要是对当前的工程检查一遍
    if (preview(branch) === false) {
        process.exit(1);
    }

    // 灰度发布
    if (branch) {
        gray(branch);
    }

    // rollback
    if (tag) {
        confirm(`回滚到${tag}`).then(() => {
            rollback(tag);
            online(user);
            postOnline(user);
        }).catch(() => {
            process.exit(1);
        });
    } else {
        confirm(`打包${getBranchName()}分支`).then(() => {
            build();

            return confirm(branch ? '灰度上线' : '上线');
        }).then(() => {
            online(user);
            postOnline(user, true);
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
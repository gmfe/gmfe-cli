const sh = require("shelljs");
const Util = require('./util');
const fs = require('fs');
const help = require('./help');
const preview = require('./preview');
const confirm = require('./confirm');
const build = require('./build');
const online = require('./online');
const rollback = require('./rollback');
const Log = require('./util').Log;

// help 信息
const argv = help();

// 参数校验
if (argv._.length === 0) {
    sh.exec('gmfe -h');
    process.exit(0);
}

// 目前只有publish一个模块
if (!argv._.includes('publish') || !argv.u) {
    sh.exec('gmfe -h');
    process.exit(0);
}

// 前往工程的父目录
const projectPath = Util.getProjectPath();
if (projectPath === false) {
    Log.error('无法定位git工程');
    process.exit(1);
}
sh.cd(projectPath);

if (argv.t) {
    confirm(`回滚到${argv.t}`).then(() => {
        rollback(argv.t);
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
        Log.info('打包完成!');

        return confirm('上线').then(() => {
            online(argv.u);
            Log.info('上线完成!');

            Log.info(`
//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\\  =  /0
//                    ___/\`---'\\___
//                  .' \\\\|     |// '.
//                 / \\\\|||  :  |||// \\
//                / _||||| -:- |||||- \\
//               |   | \\\\\\  -  /// |   |
//               | \\_|  ''\\---/''  |_/ |
//               \\  .-\\__  '-'  ___/-. /
//             ___'. .'  /--.--\\  \`. .'___
//          ."" '<  \`.___\\_<|>_/___.' >' "".
//         | | :  \`- \\\`.;\`\\ _ /\`;.\`/ - \` : | |
//         \\  \\ \`_.   \\_ __\\ /__ _/   .-\` /  /
//     =====\`-.____\`.___ \\_____/___.-\`___.-'=====
//                       \`=---='
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//             ❤ ❤ ❤ ❤ 棒棒哒，么么哒！❤ ❤ ❤ ❤
//`);
        });
    }).catch(() => {
        process.exit(1);
    });
}

// event
process.on('exit', function () {
    console.log('gmfe exit');
});
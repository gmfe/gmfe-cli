const sh = require('shelljs');
const readline = require('readline');
const moment = require('moment');
const _ = require('lodash');
const path = require('path');
const Util = require('../util');
const {Log, getBranchName, getProjectName} = Util;

function online(u) {
    Log.info('>>>>>>>>>> 执行上线');

    const branchName = getBranchName(),
        projectName = getProjectName(),
        tag = branchName.split('-')[0] + '_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '_' + u;

    Log.step('打版本tag ' + tag);
    sh.exec('git tag ' + tag + '; git push --tags');

    sh.exec('mkdir -p backup');
    const fileName = `backup/${tag}.tar.gz`;
    Log.step(`备份 ${fileName}`);
    sh.exec(`tar zcvf ${fileName} build`);

    Log.step('执行同步脚本');

    sh.exec(`rsync -aztH --exclude .git --exclude .svn --exclude .swp --exclude node_modules --rsh=ssh ./build/ static.cluster.gm:/data/www/static_resource/${projectName}/`);
    sh.exec(`rsync -aztH --exclude .git --exclude .svn --exclude .swp --exclude node_modules --rsh=ssh ./build/index.html static.cluster.gm:/data/templates/${projectName}/${branchName}/`); // 同步模板文件

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
}

module.exports = online;
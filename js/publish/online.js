const sh = require('shelljs');
const moment = require('moment');
const Util = require('../util');
const {Log, getBranchName, getProjectName} = Util;

function online() {
    Log.info('>>>>>>>>>> 执行上线');

    const branchName = getBranchName(),
        projectName = getProjectName();

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

function postOnline(user) {
    const branchName = getBranchName(),
        tag = branchName.split('-')[0] + '_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '_' + user,
        fileName = `backup/${tag}.tar.gz`;

    Log.info('>>>>>>>>>> 执行备份');

    Log.step('打版本tag ' + tag);
    sh.exec('git tag ' + tag + '; git push --tags');

    sh.exec('mkdir -p backup');
    Log.step(`备份 ${fileName}`);
    sh.exec(`tar zcvf ${fileName} build`);
    Log.step('备份完成');
}

module.exports = {
    online,
    postOnline
};
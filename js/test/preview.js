const sh = require('shelljs');
const Util = require('../util');
const { Log } = Util;

function preview() {
    let branch = sh.exec("git branch | sed -n '/\\* /s///p'").stdout.replace('\n', '');

    Log.info('>>>>>>>>>> 测试部署前检测');

    Log.step('检测本地代码状态');
    const diff = sh.exec('git diff', { silent: true });
    if (diff.stdout !== '') {
        Log.warn('Dirty！确保你本地代码是干净的');
        return false;
    }

    if (branch !== 'master') {
        sh.exec('git checkout master');
        branch = 'master';
    }

    Log.step('拉远端代码');
    sh.exec('git pull');

    Log.step('比较远端代码');
    const oDiff = sh.exec(`git diff ${branch} origin/${branch}`, { silent: true });
    if (oDiff.stdout !== '') {
        Log.warn(`${branch}不同于origin/${branch}。请检查！`);
        return false;
    }

    return true;
}

module.exports = preview;
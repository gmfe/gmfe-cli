const sh = require('shelljs');
const Log = require('./util').Log;

function preview() {
    Log.info('>>>>>>>>>> 发布前检测');

    Log.step('检测本地代码状态');
    const diff = sh.exec('git diff', {silent: true});
    if (diff.stdout !== '') {
        Log.warn('Dirty！确保你本地代码是干净的');
        return false;
    }

    const branch = sh.exec('git branch', {silent: true}),
        branchNameMatch = branch.stdout.match(/\*\s+(master)\n/) || branch.stdout.match(/\*\s+(online-.+)\n/),
        branchName = branchNameMatch && branchNameMatch[1];

    if (!branchName) {
        Log.warn('确保你处于master或online分支');
        return false;
    }

    Log.step('拉远端代码');
    sh.exec('git pull');

    Log.step('比较远端代码');
    const oDiff = sh.exec(`git diff ${branchName} origin/${branchName}`, {silent: true});
    if (oDiff.stdout !== '') {
        Log.warn(`${branchName}不同于origin/${branchName}。请检查！`);
        return false;
    }

    Log.step('最近3次提交');
    sh.exec('git log -n 3 --decorate=full');

    return true;
}

module.exports = preview;
const sh = require('shelljs');
const Log = require('../util').Log;
const Util = require('../util');

function preview(grayBranch) {
    Log.info('>>>>>>>>>> 发布前检测');

    Log.step('检测本地代码状态');
    const diff = sh.exec('git diff', {silent: true});
    if (diff.stdout !== '') {
        Log.warn('Dirty！确保你本地代码是干净的');
        return false;
    }

    if (grayBranch) {
        sh.exec(`git checkout ${grayBranch}`, {silent: true});
        sh.exec(`git pull origin ${grayBranch}`, {silent: true});
    }

    const currentBranch = Util.getBranchName();

    if (!currentBranch) {
        Log.warn('确保你处于master、online或release分支');
        return false;
    } else if (grayBranch && grayBranch !== currentBranch) {
        Log.warn(`分支${grayBranch}不存在，请输入准确的灰度分支名`);
        return false;
    }

    Log.step('拉远端代码');
    sh.exec('git pull');

    Log.step('比较远端代码');
    const oDiff = sh.exec(`git diff ${currentBranch} origin/${currentBranch}`, {silent: true});
    if (oDiff.stdout !== '') {
        Log.warn(`${currentBranch}不同于origin/${currentBranch}。请检查！`);
        return false;
    }

    Log.step('最近3次提交');
    sh.exec('git log -n 3 --decorate=full');

    return true;
}

module.exports = preview;
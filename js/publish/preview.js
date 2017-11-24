const sh = require('shelljs');
const Util = require('../util');
const { logger, getBranchName } = Util;

function preview(grayBranch) {
    const currentBranch = getBranchName();

    logger.info('>>>>>>>>>> 发布前检测');

    logger.info('检测本地代码状态');
    const diff = sh.exec('git diff', { silent: true });
    if (diff.stdout !== '') {
        logger.warn('Dirty！确保你本地代码是干净的');
        return false;
    }

    if (!currentBranch) {
        logger.warn('确保你处于master、online或release分支');
        return false;
    }

    logger.info('拉远端代码');
    sh.exec('git pull');

    logger.info('比较远端代码');
    const oDiff = sh.exec(`git diff ${currentBranch} origin/${currentBranch}`, { silent: true });
    if (oDiff.stdout !== '') {
        logger.warn(`${currentBranch}不同于origin/${currentBranch}。请检查！`);
        return false;
    }

    if (!grayBranch) {
        logger.info('最近5次提交');
        sh.exec('git log -n 5 --decorate=full');
    }

    return true;
}

module.exports = preview;
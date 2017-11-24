const sh = require('shelljs');
const {logger, getProjectPath, getPackageJSON, getBranchName} = require('../util');

function _init(addWhat) {
    // 前往工程的父目录
    const projectPath = getProjectPath();
    if (projectPath === false) {
        logger.error('无法定位git工程');
        return false;
    }
    sh.cd(projectPath);

    // 检测代码是否干净
    const diff = sh.exec('git diff', {silent: true});
    if (diff.stdout !== '') {
        logger.warn('Dirty！确保你本地代码是干净的');
        return false;
    }

    // master
    const currentBranch = getBranchName();
    if (!currentBranch === 'master') {
        logger.warn('确保你处于master分支');
        return false;
    }

    const info = getPackageJSON();
    if (!(info.repository && info.repository.url && info.repository.url.indexOf('https://github.com/gmfe/') > -1)) {
        logger.warn('确保是 github gmfe 的库');
        return false;
    }

    if (!sh.exec('npm whoami', {silent: true}).stdout.startsWith('gmfe')) {
        logger.info('npm account is not gmfe');
        return false;
    }

    if (addWhat) {
        if (addWhat === 'major' || addWhat === 'minor' || addWhat === 'patch') {
            // 需要移除 package-lock.json 文件才能 npm version。
            sh.exec(`rm -rf package-lock.json; npm version ${addWhat}; git push origin master:master;`);
        } else {
            logger.warn('-a 参数错误');
            return false;
        }
    }

    logger.info(`start to publish ${info.name} ...`);
    sh.exec('npm publish --registry="https://registry.npmjs.org"; cnpm sync ' + info.name + ';');

    logger.info(`如果 cnpm 同步失败（最近经常同步失败），请访问 https://npm.taobao.org/sync/${info.name} 手动触发更新。`);
}

const init = (addWhat) => {
    _init(addWhat) === false || process.exit(1);
};

module.exports = init;
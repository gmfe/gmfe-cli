const sh = require('shelljs');
const {logger, getProjectPath, getPackageJSON, getBranchName} = require('../util');
const npm_publish = require('../npm_publish');

const _init = (filePath, commit = '新增icon') => {
    const projectPath = getProjectPath();
    if(projectPath === false) {
        logger.err('无法定位git工程');
        process.exit(1);
    }

    const packageJSON = getPackageJSON();
    if(packageJSON.name !== 'gm-xfont') {
        logger.err('当前工程不是gm-xfont');
        process.exit(1);
    }

    if(/\.zip$/.test(filePath) === false) {
        logger.err('请确认icon压缩包路径');
        process.exit(1);
    }
    // icon包解压到工程目录,覆盖
    sh.exec('unzip -o -j -d ' + projectPath + ' ' + filePath);
    logger.info('解压完毕');

    // master
    const currentBranch = getBranchName();
    if (!currentBranch === 'master') {
        logger.warn('确保你处于master分支');
        process.exit(1);
    }

    logger.info('正在推送代码到origin...');
    sh.exec('git add . && git commit -m ' + commit + ' && git push origin master:master;');

    npm_publish('patch');
};

module.exports = _init;
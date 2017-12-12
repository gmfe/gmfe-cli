const sh = require('shelljs');
const fs = require('fs');
const Util = require('../util');
const { logger, getBranchName, getProjectName, getProjectPath } = Util;

function grayCheck(grayBranch) {
    if (grayBranch.indexOf('release-') === -1) {
        logger.warn(`分支${grayBranch}不正确，请输入以“release-“开头的的灰度分支名`);
        process.exit(1);
    }

    const projectName = getProjectName(),
        grayDir = `.gray_release/gm_static_${projectName}_${grayBranch}`;

    logger.info('>>>>>>>>>> 灰度发布准备');

    sh.exec('mkdir -p .gray_release', { silent: true });

    if (!fs.existsSync(grayDir)) {
        sh.exec(`mkdir -p ${grayDir}`, { silent: true });
        sh.exec(`rsync -aztHv  --exclude .test_release --exclude .gray_release --exclude backup . ${grayDir}`, { silent: true });
    }

    sh.cd(`${getProjectPath()}/${grayDir}`);

    sh.exec('git pull');
    sh.exec(`git checkout ${grayBranch}`, { silent: true });

    const currentBranch = getBranchName();

    if (currentBranch && currentBranch !== grayBranch) {
        logger.warn(`分支${grayBranch}不存在，请输入准确的灰度分支名`);
        process.exit(1);
    }

    logger.info('最近5次提交');
    sh.exec('git log -n 5 --decorate=full');

    logger.info('>>>>>>>>>> 灰度发布准备就绪');
}

module.exports = grayCheck;
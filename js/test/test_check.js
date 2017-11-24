const sh = require('shelljs');
const fs = require('fs');
const Util = require('../util');
const { logger, getProjectName, getProjectPath } = Util;

function testCheck(testBranch) {
    const projectName = getProjectName(),
        testDir = `.test_release/gm_static_${projectName}_${testBranch}`;

    logger.info('>>>>>>>>>> 测试部署准备');

    sh.exec('mkdir -p .test_release', { silent: true });

    if (!fs.existsSync(testDir)) {
        sh.exec(`mkdir -p ${testDir}`, { silent: true });
        sh.exec(`rsync -aztHv --exclude .test_release --exclude .gray_release --exclude backup . ${testDir}`, { silent: true });
    }

    sh.cd(`${getProjectPath()}/${testDir}`);

    sh.exec(`git checkout ${testBranch}`, { silent: true });
    sh.exec(`git pull origin ${testBranch}`);

    const currentBranch = sh.exec("git branch | sed -n '/\\* /s///p'", { silent: true }).stdout.replace('\n', '');

    if (currentBranch !== testBranch) {
        logger.warn(`分支${testBranch}不存在，请输入准确的分支名`);
        process.exit(1);
    }

    logger.info('最近5次提交');
    sh.exec('git log -n 5 --decorate=full');

    logger.info('>>>>>>>>>> 测试部署准备就绪');
}

module.exports = testCheck;
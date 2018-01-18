const sh = require("shelljs");
const preview = require('./preview');
const testCheck = require('./test_check');
const { getProjectPath, getProjectName, logger, getLastCommit } = require('../util');

function init(branch = "master") {
    // 前往工程的父目录
    const projectPath = getProjectPath();
    if (projectPath === false) {
        logger.error('无法定位git工程');
        process.exit(1);
    }
    sh.cd(projectPath);

    // preview
    // 主要是对当前的工程检查一遍
    if (preview() === false) {
        process.exit(1);
    }

    // 灰度发布
    if (branch !== 'master')
        testCheck(branch);

    logger.info('>>>>>>>>>> 执行打包');

    sh.exec(`BRANCH=${branch} COMMIT=${getLastCommit()} npm run testing`);

    logger.info('打包完成!');

    const projectName = getProjectName();

    sh.exec(`rsync -aztHv ./build/ /data/www/static_resource/${projectName}/`);

    if (projectName === 'mes') {
        sh.exec(`rsync -aztHv ./build/mes.html /data/templates/station/${branch}/`);
        sh.exec(`rsync -aztHv ./build/mes.html devhost.guanmai.cn:/data/templates/station/${branch}/`);
    } else {
        sh.exec(`rsync -aztHv ./build/index.html /data/templates/${projectName}/${branch}/`);
        sh.exec(`rsync -aztHv ./build/index.html devhost.guanmai.cn:/data/templates/${projectName}/${branch}/`);
    }

    logger.info('测试部署完成!');

    // event
    process.on('exit', function () {
        logger.info('gmfe exit');
    });
}

module.exports = init;

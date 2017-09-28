const sh = require("shelljs");
const preview = require('./preview');
const testCheck = require('./test_check');
const { getProjectPath, getProjectName, Log } = require('../util');

function init(branch = "master") {
    // 前往工程的父目录
    const projectPath = getProjectPath();
    if (projectPath === false) {
        Log.error('无法定位git工程');
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

    Log.info('>>>>>>>>>> 执行打包');
    Log.step('npm run testing');
    sh.exec(`BRANCH=${branch} npm run testing`);
    Log.info('打包完成!');

    const projectName = getProjectName();

    sh.exec(`rsync -aztHv ./build/ /data/www/static_resource/${projectName}/`);
    sh.exec(`rsync -aztHv ./build/index.html /data/templates/${projectName}/${branch}/`); // 同步模板文件

    Log.info('测试部署完成!');

    // event
    process.on('exit', function () {
        console.log('gmfe exit');
    });
}

module.exports = init;

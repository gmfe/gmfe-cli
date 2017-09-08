const sh = require("shelljs");
const help = require('./help');
const publishInit = require('./publish/index');
const versionInfo = require('./version_info/index');

// help 信息
const argv = help();

// 参数校验
if (argv._.length === 0) {
    sh.exec('gmfe -h');
    process.exit(0);
}

if (argv._.includes('publish') && argv.u) {
    publishInit(argv.t, argv.u, argv.b);
} else if (argv._.includes('versioninfo')) {
    versionInfo(argv.w);
} else {
    sh.exec('gmfe -h');
    process.exit(0);
}
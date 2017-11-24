const sh = require("shelljs");
const help = require('./help');
const publishInit = require('./publish/index');
const testInit = require('./test/index');
const versionInfo = require('./version_info/index');
const imageCut = require('./image_cut/index');
const npmPublish = require('./npm_publish');
const { logger } = require('./util');

const exec = sh.exec;

sh.exec = function (command, options) {
    const temp = exec.apply(this, Array.prototype.slice.call(arguments));

    if (!options || !options.silent) {
        if (temp.stderr) {
            logger.error(`【${command}】${temp.stdout} ${temp.stderr.replace(/\n$/, '')}`);
        } else {
            logger.info(`【${command}】 ${temp.stdout.replace(/\n$/, '')}`);
        }
    }

    return temp;
};

// help 信息
const argv = help();

logger.debug('gmfe argv:', argv);

// 参数校验
if (argv._.length === 0) {
    sh.exec('gmfe -h');
    process.exit(0);
}

if (argv._.includes('publish') && argv.u) {
    publishInit(argv.t, argv.u, argv.b);
} else if (argv._.includes('test')) {
    testInit(argv.b);
} else if (argv._.includes('versioninfo')) {
    versionInfo(argv.w);
} else if (argv._.includes('imagecut')) {
    imageCut(argv.d, argv._[1]);
} else if (argv._.includes('npm_publish')) {
    npmPublish(argv.a);
} else {
    sh.exec('gmfe -h');
    process.exit(0);
}

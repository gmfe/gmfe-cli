const sh = require('shelljs');
var fs = require('fs');
const log4js = require('log4js');

const log4jsConfig = {
    appenders: {
        console: {
            type: 'console',
            layout: { type: 'coloured' }
        }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' },
        log2file: { appenders: ['console'], level: 'debug' }
    }
};

const projectPath = getProjectPath();

// 只在工程目录下时才记录到日志文件
if (projectPath) {
    const logDirectory = `${projectPath}/logs`;

    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }

    log4jsConfig.appenders.log2file = {
        type: 'fileSync', filename: `${logDirectory}/gmfe.log`, maxLogSize: 10458760, pattern: '.yyyy-MM', compress: true,
        layout: { type: 'coloured' }
    };

    log4jsConfig.categories = {
        default: { appenders: ['log2file', 'console'], level: 'debug' },
        log2file: { appenders: ['log2file'], level: 'debug' }
    };
}

log4js.configure(log4jsConfig);

const logger = log4js.getLogger('default');
console.log = logger.info.bind(logger);
console.error = logger.error.bind(logger);


function getProjectPath() {
    const dir = sh.exec('git rev-parse --git-dir', { silent: true });
    if (dir.code === 0) {
        if (dir.stdout === '.git\n') {
            return sh.pwd();
        } else {
            return dir.stdout.replace('/.git', '').replace('\n', '');
        }
    } else {
        return false;
    }
}

// TODO 貌似语义不符
const getBranchName = () => {
    const branch = sh.exec('git branch', { silent: true }),
        branchNameMatch = branch.stdout.match(/\*\s+(master)\n/) || branch.stdout.match(/\*\s+(online-.+)\n/) || branch.stdout.match(/\*\s+(release-.+)\n/);

    return branchNameMatch && branchNameMatch[1];
};

const getProjectName = () => {
    const projectPath = getProjectPath();

    if (!projectPath) return null;

    return projectPath.split('/').pop().split('_')[2];
};

const remoteTemplatePathCheck = (branch) => {
    const check = sh.exec(`if ssh static.cluster.gm '[ -d /data/templates/${getProjectName()}/${branch || getBranchName()}/ ]'; then echo "succ"; exit 1; else echo "fail"; fi`, { silent: true });

    return check.stdout === 'succ\n';
};

const getPackageJSON = () => {
    return JSON.parse(sh.exec('cat package.json', { silent: true }).stdout);
};

module.exports = {
    logger,
    getProjectPath,
    getBranchName,
    getProjectName,
    remoteTemplatePathCheck,
    getPackageJSON
};
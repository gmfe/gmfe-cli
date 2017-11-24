const sh = require('shelljs');
const log4js = require('log4js');

const getProjectPath = function () {
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
};

log4js.configure({
    appenders: {
        everything: {
            type: 'fileSync', filename: `${getProjectPath()}/logs/gmfe.log`, maxLogSize: 10458760, pattern: '.yyyy-MM', compress: true,
            layout: { type: 'coloured' }
        },
        console: {
            type: 'console',
            layout: { type: 'coloured' }
        }
    },
    categories: { default: { appenders: ['everything', 'console'], level: 'debug' } }
});

const logger = log4js.getLogger();
console.log = logger.info.bind(logger);

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
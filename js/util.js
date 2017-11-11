const sh = require('shelljs');
const colors = require('colors');
const _ = require('lodash');

const Log = {
    log() {
        console.log.call(this, _.values(arguments).join(' '));
    },
    info() {
        console.log.call(this, colors.green('[Info] ' + _.values(arguments).join(' ')));
    },
    warn() {
        console.log.call(this, colors.yellow('[Warning] ' + _.values(arguments).join(' ')));
    },
    error() {
        console.log.call(this, colors.red('[Error] ' + _.values(arguments).join(' ')));
    },
    step() {
        console.log.call(this, colors.cyan('  [step]' + _.values(arguments).join(' ')));
    }
};

const getProjectPath = function () {
    const dir = sh.exec('git rev-parse --git-dir', {silent: true});
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

// TODO 貌似语义不符
const getBranchName = () => {
    const branch = sh.exec('git branch', {silent: true}),
        branchNameMatch = branch.stdout.match(/\*\s+(master)\n/) || branch.stdout.match(/\*\s+(online-.+)\n/) || branch.stdout.match(/\*\s+(release-.+)\n/);

    return branchNameMatch && branchNameMatch[1];
};

const getProjectName = () => {
    const projectPath = getProjectPath();

    if (!projectPath) return null;

    return projectPath.split('/').pop().split('_')[2];
};

const remoteTemplatePathCheck = (branch) => {
    const check = sh.exec(`if ssh static.cluster.gm '[ -d /data/templates/${getProjectName()}/${branch || getBranchName()}/ ]'; then echo "succ"; exit 1; else echo "fail"; fi`, {silent: true});

    return check.stdout === 'succ\n'
};

const getPackageJSON = () => {
    return JSON.parse(sh.exec('cat package.json', {silent: true}).stdout);
};

module.exports = {
    Log,
    getProjectPath,
    getBranchName,
    getProjectName,
    remoteTemplatePathCheck,
    getPackageJSON
};
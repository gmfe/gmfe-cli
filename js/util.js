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

module.exports = {
    Log,
    getProjectPath,
    getBranchName,
    getProjectName
};
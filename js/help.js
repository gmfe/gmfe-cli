const yargs = require('yargs');

function help() {
    return yargs.usage('gmfe publish [options]')
        .locale('en')
        .command('publish', 'publish project')
        .command('test', 'test project')
        .command({
            command: 'versioninfo',
            desc: 'show recently version'
        })
        .demandCommand()
        .option('u', {
            alias: 'user',
            demand: false,
            describe: 'name who publish project',
            type: 'string'
        }).option('t', {
            alias: 'tag',
            demand: false,
            describe: 'which tag to rollback',
            type: 'string'
        }).option('b', {
            alias: 'branch',
            demand: false,
            describe: 'which branch to gray or test release'
        }).option('w', {
            alias: 'week',
            demand: false,
            describe: 'how many weeks to show'
        })
        .example('gmfe publish -u name\ngmfe publish -u name -t online_2017_08_21_17_50_name\ngmfe publish -u name -b release-xxx\ngmfe versioninfo')
        .version()
        .argv;
}

module.exports = help;
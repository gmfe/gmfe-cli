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
        .command('imagecut', 'image cut')
        .command('renametoen', 'rename to en')
        .command('npm_publish', 'publish a package to npm and sync to taobao')
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
        }).option('d', {
            alias: 'dir',
            demand: false,
            describe: 'where the image will be generated'
        }).option('a', {
            alias: 'add',
            demand: false,
            describe: 'npm version major or minor or patch'
        })
        .example('' +
            'gmfe publish -u name\n' +
            'gmfe publish -u name -t online_2017_08_21_17_50_name\n' +
            'gmfe publish -u name -b release-xxx\n' +
            'gmfe test -b release-xxx\n' +
            'gmfe versioninfo\n' +
            'gmfe imagecut ./js/logo.jpg -d ./img\n' +
            'gmfe npm_publish\n' +
            'gmfe npm_publish -a patch' +
            'gmfe renametoen' +
            'gmfe renametoen ./images ./rename'
        )
        .version()
        .argv;
}

module.exports = help;
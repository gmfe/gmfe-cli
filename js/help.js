var yargs = require('yargs');

function help() {
    return yargs.usage('gmfe publish [options]')
        .locale('en')
        .command('publish', 'publish project')
        .option('u', {
            alias: 'user',
            demand: false,
            describe: 'name who publish project',
            type: 'string'
        })
        .example('gmfe publish -u user')
        .help('h')
        .alias('h', 'help')
        .version()
        .argv;
}

module.exports = help;
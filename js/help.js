var yargs = require('yargs');

var argv = yargs.usage('Usage: gmfe publish [options]')
    .command('publish', 'published project')
    .option('u', {
        alias: 'user',
        describe: 'name who published',
        type: 'string'
    })
    .option('m', {
        alias: 'module',
        demand: false,
        describe: 'module which will run after published'
    })
    .example('gmfe publish -u user')
    .example('gmfe publish -u user -m module')
    .help('h')
    .alias('h', 'help')
    .argv;
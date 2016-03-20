const yargs = require('yargs');
const sh = require("shelljs");
const Util = require('./util');

const Preview = require('./preview');
const Log = Util.Log,
    confirmOnline = Util.confirmOnline;

var argv = yargs.usage('Usage: gmfe publish [options]')
    .locale('en')
    .command('publish', 'published project')
    .option('u', {
        alias: 'user',
        demand: false,
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


if (argv._.length === 0) {
    sh.exec('./bin/gmfe.sh -h');
    process.exit(0);
}

if (argv._[0] !== 'publish' || !argv.u) {
    sh.exec('./bin/gmfe.sh -h');
    process.exit(0);
}


// if(Preview.preview() === false){
//     process.exit(1);
// };


confirmOnline().then(() => {
    console.log('yes');
}, () => {
    console.log('no');
    process.exit(0);
});
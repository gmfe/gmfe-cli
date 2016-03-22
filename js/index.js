const yargs = require('yargs');
const sh = require("shelljs");
const Util = require('./util');
const SSH = require('simple-ssh');

const Preview = require('./preview');
const Online = require('./online');
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


// 前往工程的父目录
const projectPath = Util.getProjectPath();
if (projectPath === false) {
    process.exit(1);
}
sh.cd(projectPath);
// sh.exec('pwd');



// if (argv._.length === 0) {
//     sh.exec('./bin/gmfe.sh -h');
//     process.exit(0);
// }
//
// if (argv._[0] !== 'publish' || !argv.u) {
//     sh.exec('./bin/gmfe.sh -h');
//     process.exit(0);
// }


// if(Preview.preview() === false){
//     process.exit(1);
// };


// confirmOnline().then(() => {
//     Online.online();
// }, () => {
//     process.exit(0);
// });

const hosts = Util.getOnlineHosts();
console.log(hosts);

const ssh = new SSH({
    host: 'guanmai.cn',
    user: 'liyatang'
});
ssh.exec('pwd', {
    out: (stdout) => {
        console.log(stdout);
    },
    err: (stderr) => {
        console.log(stderr);
    }
}).start();

// sh.exec('ssh -oConnectTimeout=3 -oStrictHostKeyChecking=no liyatang@guanmai.cn', (code, stdout, stderr) => {
//     console.log(code);
// });
var yargs = require('yargs');
var sh = require("shelljs");
var Util = require('./util');
var path = require('path');
var fs = require('fs');
var Preview = require('./preview');
var Online = require('./online');
var Connect = require('./connect');
var _ = require('underscore');
var Log = Util.Log,
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
var projectPath = Util.getProjectPath();
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

var hosts = Util.getOnlineHosts();
console.log(hosts);


var connects = [];
_.each(hosts, function (value) {
    var commands = [
        'cd ' + value.directory,
        'pwd'
    ];
    if (fs.existsSync(path.resolve(value.directory, './deploy/before_online.sh'))) {
        commands.push('./deploy/before_online.sh')
    }
    if (fs.existsSync(path.resolve(value.directory, './deploy/after_online.sh'))) {
        commands.push('./deploy/after_online.sh')
    }

    console.log(path.resolve(value.directory, './deploy/before_online.sh'));
    console.log(commands);
    connects.push(Connect.connect(value, commands, function (promise) {
        promise.then(() => {
            console.log('suc');
        }, () => {
            console.log('err');
        }, data => {
            console.log(data);
        });
    }));

});

process.on('exit', function () {
    console.log('gmfe exit');
});

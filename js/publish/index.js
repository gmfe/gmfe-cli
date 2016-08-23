var sh = require("shelljs");
var Util = require('./util');
var fs = require('fs');
var help = require('./help');
var preview = require('./preview');
var confirm = require('./confirm');
var online = require('./online');
var Log = require('./util').Log;

// help 信息
var argv = help();


// 参数校验
if (argv._.length === 0) {
    sh.exec('node ./bin/gmfe.js -h');
    process.exit(0);
}

// 目前只有publish一个模块
if (argv._[0] !== 'publish' || !argv.u) {
    sh.exec('node ./bin/gmfe.js -h');
    process.exit(0);
}


// 前往工程的父目录
var projectPath = Util.getProjectPath();
if (projectPath === false) {
    Log.error('无法定位git工程');
    process.exit(1);
}
sh.cd(projectPath);


// preview
// 主要是对当前的工程检查一遍。 确认是Master，且clean。
if (preview() === false) {
    process.exit(1);
}


// online
confirm().then(function () {
    online(argv.u);
}, function () {
    process.exit(0);
});


// event
process.on('exit', function () {
    console.log('gmfe exit');
});
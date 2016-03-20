require('./help');
var argv = require('yargs').argv;
var sh = require("shelljs");

var Preview = require('./preview');

if(argv._.length === 0){
    sh.exec('./bin/gmfe.sh -h');
    return;
}

if(argv._[0] !== 'publish' || !argv.u){
    sh.exec('./bin/gmfe.sh -h');
    return;
}


Preview.preview();

console.log(1);
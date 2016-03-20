require('./help');
var Preview = require('./preview');
var argv = require('yargs').argv;
var sh = require("shelljs");

if(process.argv.length === 2){
    sh.exec('./bin/gmfe.sh -h');
    return;
}

console.log('1');

Preview.preview();

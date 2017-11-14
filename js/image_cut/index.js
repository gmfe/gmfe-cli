const sh = require('shelljs');
const fs = require('fs');
const {Log} = require('../util');
const path = require('path');

var root = process.cwd();

// image size
var size_array = [
    "16", "512", "60", "120", "72",
    "144", "76", "152", "32", "48",
    "96", "29", "58", "40", "80",
    "50", "100", "57"
]

function init(dir, filename) {
    if(!fs.existsSync(filename)) {
        Log.error('无法定位至文件');
        process.exit(1);
    }

    var suffixReg = /\.[^.]+$/, m_dir = '';
    var suffix = suffixReg.exec(filename);

    dirname = path.resolve(root,  dir ? dir : './logo');

    if (!fs.existsSync(dirname)) {
        sh.exec('mkdir ' + dirname);
    }

    for(var i=0, len=size_array.length; i<len; i++){
        m_dir = dirname + '/' + size_array[i] + suffix;

        sh.exec('cp ' + filename + ' ' + m_dir);
        sh.exec('sips -Z ' + size_array[i] + ' ' + m_dir,  { silent: true });
    }

    process.on('exit', function () {
        Log.info('图片裁剪完成!');
        console.log('gmfe exit');
    });
}

module.exports = init;
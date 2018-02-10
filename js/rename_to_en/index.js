const fs = require('fs');
const path = require('path');
const sh = require('shelljs');
const {logger} = require('../util');
const pinyin = require('gm-pinyin');
const _ = require('lodash');

function batchRenameToEN(dir = './images', dist = './rename') {
    const dirPath = path.resolve(dir);
    const distPath = path.resolve(dist);

    console.log(dirPath, distPath);

    if (!fs.existsSync(dirPath)) {
        logger.error('无法定位文件');
        process.exit(1);
    }

    if (fs.existsSync(distPath)) {
        sh.exec('rm -rf ' + distPath);
    }

    sh.exec('mkdir ' + distPath);

    const files = fs.readdirSync(dirPath);

    _.each(files, filename => {
        fs.copyFileSync(path.join(dirPath, filename), path.join(distPath, getPinyinStr(filename)));
    });
}

function getPinyinStr(text) {
    return _.map(pinyin(text, {
        style: pinyin.STYLE_NORMAL
    }), v => v[0]).join('');
}

module.exports = batchRenameToEN;
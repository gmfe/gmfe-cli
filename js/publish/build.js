const sh = require('shelljs');
const Log = require('../util').Log;

function build(branch = 'master') {
    Log.info('>>>>>>>>>> 执行打包');

    Log.step('npm run deploy');
    sh.exec(`BRANCH=${branch} npm run deploy`);

    Log.info('打包完成!');
}

module.exports = build;

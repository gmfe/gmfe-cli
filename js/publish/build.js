const sh = require('shelljs');
const logger = require('../util').logger;

function build(branch = 'master') {
    logger.info('>>>>>>>>>> 执行打包');

    logger.info('npm run deploy');
    sh.exec(`BRANCH=${branch} npm run deploy`);

    logger.info('打包完成!');
}

module.exports = build;

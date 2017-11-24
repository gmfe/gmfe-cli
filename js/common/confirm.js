const logger = require('../util').logger;
const readline = require('readline');

function confirm(action) {
    logger.info(`>>>>>>>>>> 确认是否${action}`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = function (callback) {
        rl.question(`Are you sure to ${action}?(yes|no) `, function (answer) {
            if (answer === 'yes' || answer === 'no') {
                rl.close();
                callback(answer);
            } else {
                question(callback);
            }
        });
    };
    return new Promise(function (resolve, reject) {
        question(function (answer) {
            if (answer === 'yes') {
                resolve();
            } else {
                reject();
            }
        });
    });
}

module.exports = confirm;
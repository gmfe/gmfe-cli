var Log = require('./util').Log;
var readline = require('readline');
var moment = require('moment');

function confirm() {
    Log.info('>>>>>>>>>> 确认是否执行发布');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var question = function (callback) {
        rl.question('Are you sure to online?(yes|no) ', function (answer) {
            if (answer === 'yes' || answer === 'no') {
                rl.close();
                callback(answer)
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
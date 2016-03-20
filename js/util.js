const colors = require('colors');
const _ = require('underscore');

const Log = {
    log() {
        console.log.call(this, _.values(arguments).join(' '));
    },
    info() {
        console.log.call(this, colors.green('[Info] ' + _.values(arguments).join(' ')));
    },
    warn() {
        console.log.call(this, colors.yellow('[Warning] ' + _.values(arguments).join(' ')));
    },
    error() {
        console.log.call(this, colors.red('[Error] ' + _.values(arguments).join(' ')));
    }
};

const confirmOnline = ()=> {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });


    const question = (callback)=> {
        rl.question('Are you sure to online?(yes|no) ', (answer) => {
            if (answer === 'yes' || answer === 'no') {
                rl.close();
                callback(answer)
            } else {
                question(callback);
            }
        });
    };
    return new Promise((resolve, reject) => {
        question(function (answer) {
            if (answer === 'yes') {
                resolve();
            } else {
                reject();
            }
        });
    });
};

module.exports = {
    Log,
    confirmOnline
};
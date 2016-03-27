var sh = require('shelljs');
var Log = require('./util').Log;
var readline = require('readline');
var moment = require('moment');

function online() {
    var git = [
        'git fetch',
        'git reset --hard origin/deploy/preview',
        'git push origin HEAD:deploy/online',
        'git tag online_' + moment().format('YYYY_MM_DD_hh_mm'),
        'git push --tags'
    ];
    sh.exec(git.join(';'));

    var hosts = Util.getOnlineHosts();
    console.log(hosts);


    var connects = [];
    _.each(hosts, function (value) {
        var commands = [
            'cd ' + value.directory,
            './deploy/before_online.sh',
            './deploy/after_online.sh',
        ];

        connects.push(Connect.connect(value, commands, function (promise) {
            promise.then(() => {
                console.log('suc');
            }, () => {
                console.log('err');
            }, data => {
                console.log(data);
            });
        }));
    });
}

function confirmOnline() {
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
}

module.exports = {
    online,
    confirmOnline
};
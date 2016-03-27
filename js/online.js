var sh = require('shelljs');
var Log = require('./util').Log;
var readline = require('readline');
var moment = require('moment');
var Util = require('./util');
var _ = require('underscore');

function confirmOnline() {
    Log.info('Step2: 确认是否执行发布');

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

function hostTag(host) {
    return '[' + host.host + '] ';
}

function online(u, m) {
    Log.info('Step3: 执行发布');

    var tag = 'online_' + moment().format('YYYY_MM_DD_hh_mm') + '_' + u;
    if (m) {
        tag += '_' + m;
    }
    var git = [
        'git push origin HEAD:deploy/online',
        'git tag ' + tag,
        'git push --tags'
    ];
    Log.step('推送到deploy/online, 打tag:' + tag);
    sh.exec(git.join(';'));

    var hosts = Util.getOnlineHosts();

    Log.step('登录发布机器:');
    Log.log(_.map(hosts, function (value) {
        return value.origin;
    }).join('\n'));

    var connects = [];
    _.each(hosts, function (value) {
        var commands = [
            'cd ' + value.directory,
            'git fetch',
            'git reset --hard origin/deploy/online',
            './deploy/before_online.sh',
            './deploy/after_online.sh',
        ];

        Log.step(hostTag(value), '拉最新代码 and 执行 before_online.sh after_online.sh');
        connects.push(Connect.connect(value, commands, function (promise) {
            promise.then(() => {
                Log.info(hostTag(value), 'success');
            }, (reason) => {
                Log.error(hostTag(value), reason);
            }, data => {
                Log.log(hostTag(value), data);
            });
        }));
    });
}

module.exports = {
    confirmOnline,
    online
};
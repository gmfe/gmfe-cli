var sh = require('shelljs');
var Log = require('./util').Log;
var readline = require('readline');
var moment = require('moment');
var Util = require('./util');
var _ = require('underscore');
var Connect = require('./connect');

function confirmOnline() {
    Log.info('>>>>>>>>>> 确认是否执行发布');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var question = (callback)=> {
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
    return '[' + host.username + '@' + host.host + '] ';
}

function online_git(u, m) {
    var tag = 'online_' + moment().format('YYYY_MM_DD_hh_mm') + '_' + u;
    if (m) {
        tag += '_' + m;
    }
    var git = [
        'git push origin HEAD:deploy/online',
        'git tag ' + tag,
        'git push --tags'
    ];
    Log.step('推送到发布环境deploy/online, 打版本tag:' + tag);
    sh.exec(git.join(';'));
}

function online_exec(u, m) {
    var hosts = Util.getOnlineHosts();

    Log.step('登录发布机器:');
    Log.log(_.map(hosts, function (value) {
        return value.origin;
    }).join('\n'));

    var timer;
    var now = new Date();
    var buf = [];

    var count = 0;
    var check = function () {
        if (count === hosts.length) {
            clearInterval(timer);
            Log.info('DONE');
        }
    };

    var checkLog = function () {
        if (buf.length > 0) {
            Log.log(buf.join(' '));
            buf = [];
        }
    };

    var connects = [];
    _.each(hosts, function (value) {
        var commands = [
            'cd ' + value.directory,
            // 'git fetch',
            // 'git reset --hard origin/deploy/online',
            './deploy/before_online.sh ' + (m ? m : ''),
            './deploy/after_online.sh ' + (m ? m : ''),
        ];

        Log.step(hostTag(value), '拉最新代码and执行before_online.sh after_online.sh');
        connects.push(Connect.connect(value, commands, function (promise) {
            promise.then(() => {
                checkLog();
                Log.info(hostTag(value), 'success');
                count++;
                check();
            }, (reason) => {
                checkLog();
                Log.info(hostTag(value), 'error');
                count++;
                check();
                Log.error(hostTag(value), reason);
            }, data => {
                buf.push(hostTag(value) + ' ' + data);
            });
        }));
    });

    timer = setInterval(function () {
        Log.step(Util.toNow(now));
        if (buf.length > 0) {
            Log.log(buf.join(' '));
            buf = [];
        }
    }, 2000);
}

function online(u, m) {
    Log.info('>>>>>>>>>> 执行发布');

    // online_git(u, m);

    online_exec(u, m);
}

module.exports = {
    confirmOnline,
    online
};
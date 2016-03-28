var ssh2 = require('ssh2');
var jsonconf = require('gm-jsonconf');
var path = require('path');
var when = require('when');
var fs = require('fs');
var config = jsonconf.parse(path.resolve(__dirname, '../config/deploy.json'));


function connect(onlineHost, commands, getPromise) {
    var conn = new ssh2.Client();
    var host = onlineHost.host,
        username = onlineHost.username;

    var promise = when.promise((resolve, reject, notify) => {
        conn.on('ready', function () {
            conn.exec(commands.join('\n'), function (err, stream) {
                if (err) {
                    throw err;
                }

                stream.on('close', function (code) {
                    conn.end();
                    if (code === 0) {
                        resolve();
                    } else {
                        reject();
                    }
                }).on('data', function (data) {
                    notify('' + data);
                }).stderr.on('data', function (data) {
                    notify('' + data);
                });
            });
        }).on('error', function () {
            reject('链接', host, '出错');
        }).connect({
            host: host,
            port: 22,
            username: username,
            privateKey: fs.readFileSync(config.privateKey)
        });
    });

    getPromise(promise);

    return conn;
}

module.exports = {
    connect
};
'use strict';

var sh = require("shelljs");
var colors = require('colors');
var _ = require('underscore');
var moment = require('moment');

var Log = {
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
    },
    step(){
        console.log.call(this, colors.blue('' + _.values(arguments).join(' ')));
    }
};

var getOnlineHosts = function () {
    var hosts = sh.cat('./deploy/online_hosts.conf') || '';
    hosts = _.map(hosts.split('\n'), function (value) {
        return value.trim();
    });
    hosts = _.filter(hosts, function (value) {
        return !value.startsWith('#') && value !== '';
    });
    return _.map(hosts, function (value) {
        return {
            host: value.split(':')[0].split('@')[1],
            username: value.split(':')[0].split('@')[0],
            directory: value.split(':')[1],
            origin: value
        }
    });
};

var getProjectPath = function () {
    var dir = sh.exec('git rev-parse --git-dir', {silent: true});
    if (dir.code === 0) {
        if (dir.stdout === '.git\n') {
            return sh.pwd();
        } else {
            return dir.stdout.replace('/.git', '').replace('\n', '');
        }
    } else {
        return false;
    }
};

var toNow = function (date) {
    var diff = new Date() - date;
    diff = Math.floor(diff / 1000);
    return Math.floor(diff / 60) + 'm ' + diff % 60 + 's';
};

module.exports = {
    Log: Log,
    getOnlineHosts: getOnlineHosts,
    getProjectPath: getProjectPath,
    toNow: toNow
};
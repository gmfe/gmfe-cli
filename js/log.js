var colors = require('colors');
var _ = require('underscore');

module.exports = {
    log: function(){
        console.log.call(this, _.values(arguments).join(' '));
    },
    info: function() {
        console.log.call(this, colors.green('[Info] ' + _.values(arguments).join(' ')));
    },
    warn: function(){
        console.log.call(this, colors.yellow('[Warning] ' + _.values(arguments).join(' ')));
    },
    error: function(){
        console.log.call(this, colors.red('[Error] ' + _.values(arguments).join(' ')));
    }
};
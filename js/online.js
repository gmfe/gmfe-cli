var sh = require('shelljs');
var Log = require('./util').Log;

function online() {
    sh.exec('git fetch; git reset --hard origin/master')
}

module.exports = {
    online
};
var sh = require('shelljs');
var Log = require('./util').Log;

function online() {
    sh.exec('git fetch; git reset --hard origin/deploy/preview');
}

module.exports = {
    online
};
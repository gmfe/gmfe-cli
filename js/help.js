const yargs = require('yargs')

function help() {
  return yargs
    .usage('gmfe <command> [options]')
    .command('test', 'test project', function(yargs) {
      return yargs.option('b', {
        alias: 'branch',
        demand: false,
        describe: 'which branch to test'
      })
    })
    .command(
      'npm_publish',
      'publish a package to npm and sync to taobao',
      function(yargs) {
        return yargs.option('a', {
          alias: 'add',
          demand: true,
          describe: 'npm version major or minor or patch'
        })
      }
    )
    .command('check', 'check some')
    .demandCommand()
    .example(
      '' +
        'gmfe test -b release-xxx\n' +
        '\n' +
        'gmfe npm_publish\n' +
        'gmfe npm_publish -a patch\n'
    )
    .version().argv
}

module.exports = help

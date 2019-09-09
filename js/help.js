const yargs = require('yargs')

function help() {
  return yargs
    .usage('gmfe <command> [options]')
    .command('publish', 'publish project', function(yargs) {
      return yargs
        .option('u', {
          alias: 'user',
          demand: true,
          describe: 'name who publish project',
          type: 'string'
        })
        .option('p', {
          alias: 'projectName',
          demand: true,
          describe: 'specify project',
          type: 'string'
        })
        .option('b', {
          alias: 'branch',
          demand: false,
          describe: 'which branch to gray',
          type: 'string'
        })
        .option('h', {
          alias: 'hash',
          demand: false,
          describe: 'specify a commit hash to publish',
          type: 'string'
        })
    })
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
        'gmfe publish -u name -p station\n' +
        'gmfe publish -u name -p manage -h 1ea3cd5 \n' +
        'gmfe publish -u name -p manage -h 1ea3cd5 -b release-2019-09-03\n' +
        '\n' +
        'gmfe test -b release-xxx\n' +
        '\n' +
        'gmfe npm_publish\n' +
        'gmfe npm_publish -a patch\n'
    )
    .version().argv
}

module.exports = help

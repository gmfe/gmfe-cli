const yargs = require('yargs')

function help() {
  return yargs
    .usage('gmfe <command> [options]')
    .command('publish', 'publish project')
    .command('test', 'test project')
    .command('npm_publish', 'publish a package to npm and sync to taobao')
    .command('clean', 'clean release directory')
    .command('check', 'check some')
    .demandCommand()
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
    .option('t', {
      alias: 'tag',
      demand: false,
      describe: 'specify a build version to publish',
      type: 'string'
    })
    .option('b', {
      alias: 'branch',
      demand: false,
      describe: 'which branch to gray(can not use with -t)'
    })
    .option('a', {
      alias: 'add',
      demand: false,
      describe: 'npm version major or minor or patch'
    })
    .example(
      '' +
        'gmfe publish -u name\n' +
        'gmfe publish -p station -u name -v master_332fae23\n' +
        'gmfe test -b release-xxx\n' +
        'gmfe npm_publish\n' +
        'gmfe npm_publish -a patch\n' +
        'gmfe check'
    )
    .version().argv
}

module.exports = help

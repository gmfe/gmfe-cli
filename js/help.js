const yargs = require('yargs')

function help () {
  return yargs.usage('gmfe publish [options]')
    .locale('en')
    .command('publish', 'publish project')
    .command('test', 'test project')
    .command({
      command: 'versioninfo',
      desc: 'show recently version'
    })
    .command('imagecut', 'image cut')
    .command('renametoen', 'rename to en')
    .command('npm_publish', 'publish a package to npm and sync to taobao')
    .command('icon_publish', 'add icon to gm-xfont and publish gm-xfont to npm')
    .command('svg_publish', 'add svg to gm-svg and publish gm-svg to npm')
    .command('clean', 'clean release directory')
    .demandCommand()
    .option('u', {
      alias: 'user',
      demand: false,
      describe: 'name who publish project',
      type: 'string'
    }).option('t', {
      alias: 'tag',
      demand: false,
      describe: 'which tag to rollback',
      type: 'string'
    }).option('b', {
      alias: 'branch',
      demand: false,
      describe: 'which branch to gray or test release'
    }).option('w', {
      alias: 'week',
      demand: false,
      describe: 'how many weeks to show'
    }).option('d', {
      alias: 'dir',
      demand: false,
      describe: 'where the image will be generated'
    }).option('a', {
      alias: 'add',
      demand: false,
      describe: 'npm version major or minor or patch'
    }).option('m', {
      alias: 'message',
      demand: false,
      describe: 'commit message or comment'
    })
    .example('' +
            'gmfe publish -u name\n' +
            'gmfe publish -u name -t online_2017_08_21_17_50_name\n' +
            'gmfe publish -u name -b release-xxx\n' +
            'gmfe test -b release-xxx\n' +
            'gmfe versioninfo\n' +
            'gmfe imagecut ./js/logo.jpg -d ./img\n' +
            'gmfe npm_publish\n' +
            'gmfe npm_publish -a patch\n' +
            'gmfe icon_publish -d ./icon.zip\n' +
            'gmfe icon_publish -d ./icon.zip -m add_new_icon\n' +
            'gmfe svg_publish -d ./svgs.zip\n' +
            'gmfe renametoen\n' +
            'gmfe renametoen ./images ./rename\n' +
            'gmfe renametoen ./name.txt ./rename.txt' +
            'gmfe clean' +
            'gmfe clean -t test -f 3_month'
    )
    .version()
    .argv
}

module.exports = help

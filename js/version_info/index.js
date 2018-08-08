const sh = require('../common/shelljs_wrapper')
const _ = require('lodash')
const moment = require('moment')
const logger = require('../logger')
const fs = require('fs')
const colors = require('colors')

const configProject = [
  { name: 'gm_static_station', desc: 'Station' },
  { name: 'gm_static_manage', desc: 'MA' },
  { name: 'gm_static_bshop', desc: 'BShop' },
  { name: 'gm_static_dealer', desc: '配送商导航' },
  { name: 'gm_static_admin', desc: 'Admin' },
  { name: 'gm_official', desc: '官网' }

  // {name: 'gmrnbshop', desc: 'BShop APP'},
  // {name: 'gmrnmes', desc: 'pad 称重打印'},
  // {name: 'gmrnpa', desc: '采购工具'},
]

function showVersionInfo (project, desc, w = 1) {
  sh.cd(project)

  const stdout = sh.exec(`git log --merges -n ${w * 20} --decorate=full --pretty="format:>>>>>>>>>>%n-->>hash: %h%n-->>author: %an%n-->>date: %aI%n-->>subject: %s%n-->>body: %b"`, { silent: true }).stdout

  let result = []
  _.each(stdout.split('>>>>>>>>>>').slice(1), str => {
    const arr = str.split('-->>').slice(1)

    result.push({
      hash: arr[0].slice(6, -1),
      author: arr[1].slice(8, -1),
      date: arr[2].slice(6, -1),
      subject: arr[3].slice(9, -1),
      body: arr[4].slice(6, -1)
    })
  })

  const minDate = moment().add(-w + 1, 'w').startOf('week')

  result = _.filter(result, info => moment(info.date) >= minDate)

  console.log(colors.green(`${desc} ${w} 周内（${moment().format('YYYY-MM-DD')}~${minDate.format('YYYY-MM-DD')}）${result.length} 次发布`))

  _.each(result, info => {
    console.log(colors.cyan('>>>>>>>>>>'))
    console.log(`hash: ${info.hash}
author: ${info.author}
date: ${info.date}˚
subject: ${info.subject}
body: ${info.body}
`)
  })
}

function init (week) {
  const root = '~/.gmfe_version_info'

  logger.info('********************')
  logger.info('列出工程最近发布记录')

  const isPathExist = fs.existsSync(root)

  if (!isPathExist) {
    sh.exec('mkdir -p ' + root)
  }

  sh.cd(root)

  _.each(configProject, p => {
    sh.cd(root)
    if (!fs.existsSync(p.name)) {
      sh.exec('mkdir -p ' + p.name)
      sh.exec(`git clone git@code.guanmai.cn:front-end/${p.name}.git`)
    }
    sh.cd(p.name)
    sh.exec('git checkout master; git pull;')
  })

  _.each(configProject, p => {
    sh.cd(root)
    sh.pwd()
    console.log('')
    console.log('')
    console.log('')
    showVersionInfo(p.name, p.desc, week)
  })
}

module.exports = init

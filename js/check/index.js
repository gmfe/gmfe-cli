const shp = require('../common/shelljs_promise')

const versionMap = {
  node: '10.15.3',
  npm: '6.9.0'
}

console.log(`
检测环境
- shell zsh
- node@${versionMap.node}
- npm@${versionMap.npm}
- rnpm and taobao
- git config rebase

建议
- cdn
- brew
`)

async function checkBase () {
  console.log('zsh?(非bash)')
  let zsh = await shp.exec('echo $SHELL')
  if (zsh !== '/bin/zsh\n') {
    throw new Error(`请确保使用 zsh。
安装 https://github.com/robbyrussell/oh-my-zsh
切换为 zsh: chsh -s /bin/zsh
`)
  }

  console.log('ssh key?')
  const key = await shp.exec('cat ~/.ssh/id_rsa.pub')
  if (key === '\n') {
    throw new Error(`请设置 ssh key: ssh-keygen`)
  }
}

async function checkNode () {
  console.log('Node 版本是')
  let nodeV = await shp.exec('node -v')
  if (nodeV !== `v${versionMap.node}\n`) {
    throw new Error(`请确保 Node 版本是 ${versionMap.node}`)
  }

  console.log('NPM 版本是')
  let npmV = await shp.exec('npm -v')
  if (npmV !== `${versionMap.npm}\n`) {
    throw new Error(`请确保 NPM 版本是 ${versionMap.npm}, 原因见 https://github.com/gmfe/Think/issues/65`)
  }

  console.log('nrm?淘宝源?')
  let nrmV = await shp.exec('nrm -V')
  if (nrmV.includes('command not found')) {
    throw new Error('没有安装 nrm，请安装')
  }
  let npmRegistry = await shp.exec('nrm current')
  if (npmRegistry !== 'taobao\n') {
    throw new Error('请设置淘宝源 nrm use taobao')
  }
}

async function checkGit () {
  console.log('Git 全局设置？')
  let gn = await shp.exec('git config --get user.name')
  let ge = await shp.exec('git config --get user.email')
  if (gn === '\n' || ge === '\n') {
    throw new Error(`请设置。 
git config --global user.name "name"
git config --global user.email email`)
  }

  console.log('rebase?')
  const rebase = await shp.exec('cat ~/.gitconfig')
  if (!rebase.includes('rebase = true')) {
    throw new Error(`请设置默认rebase。
git config --global pull.rebase true`)
  }
}

async function checkOther () {
  console.log('DNS')
  const resolve = await shp.exec('cat /etc/resolv.conf')
  if (!resolve.includes('nameserver 1.1.1.1')) {
    throw new Error('建议配置dns，公司网络dns略坑，https://1.1.1.1/zh-Hans/dns/')
  }
}

async function check () {
  try {
    await checkBase()
    await checkNode()
    await checkGit()

    console.log('******建议******')

    await checkOther()

    console.log('\n\n\n\n~~~Congratulate~~~')
  } catch (e) {
    console.warn(e)
  }
}

module.exports = check

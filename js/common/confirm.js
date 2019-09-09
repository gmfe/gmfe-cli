const inquirer = require('inquirer')
const name = 'confirm'

async function confirm(action, exitIfNo = true) {
  const result = await inquirer.prompt({
    type: 'input',
    name,
    message: `确认: ${action} (yes/no)`,
    validate(input) {
      if (input !== 'yes' && input !== 'no') {
        return 'please input yes or no'
      }
      return true
    }
  })
  const yes = result[name] === 'yes'
  if (!yes && exitIfNo) {
    process.exit(0)
  }
  return yes
}

module.exports = confirm

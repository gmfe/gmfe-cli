const inquirer = require('inquirer')

async function confirm (action) {
  let result = await inquirer.prompt({
    type: 'input',
    name: action,
    message: `确认是否 ${action} (yes/no)`,
    validate (input) {
      if (input !== 'yes' && input !== 'no') {
        return 'please input yes or no'
      }
      return true
    }
  })
  if (result[action] === 'no') {
    process.exit(0)
  }
}

module.exports = confirm

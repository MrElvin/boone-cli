const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec
const chalk = require('chalk')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const CLI = require('clui')
const figlet = require('figlet')
const Spinner = CLI.Spinner
const tpl = require('../tpl')

module.exports = function () {
  const tplNameList = Object.keys(tpl)
  const downloadCountdown = new Spinner(chalk.cyan('Downloading Template...  '), ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷'])
  const installCountdown = new Spinner(chalk.cyan('Installing dependencies...  '), ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷'])
  const questions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'What\' s your project name?',
      validate (val) {
        if (val) return true
        return 'Please enter your project name';
      },
      filter (val) {
        return val.replace(/\//g, '_')
      }
    },
    {
      type: 'list',
      name: 'tplName',
      message: 'Choose your template',
      choices: tplNameList,
      filter (val) {
        return val.toLowerCase()
      }
    }
  ]
  let downloadUrl, projectName
  inquirer.prompt(questions)
    .then(answers => {
      const { tplName } = answers
      downloadUrl = tpl[tplName].downloadUrl
      projectName = answers.projectName
      downloadCountdown.start()
    })
    .then(() => new Promise((resolve, reject) => {
      download(downloadUrl, path.resolve(process.cwd(), projectName), err => {
        if (err) reject()
        resolve()
      })
    }))
    .then(() => {
      const pkg = JSON.parse(fs.readFileSync(`${projectName}/package.json`))
      pkg.name = projectName
      fs.writeFileSync(`${projectName}/package.json`, JSON.stringify(pkg))
    })
    .then(() => new Promise((resolve, reject) => {
      downloadCountdown.stop()
      const commandStr = `cd ${projectName} && npm install && cd ..`
      installCountdown.start()
      exec(commandStr, err => {
        if (err) reject()
        resolve()
      })
    }))
    .then(() => fs.writeFileSync(`${projectName}/.env`, 'SKIP_PREFLIGHT_CHECK=true'))
    .then(() => new Promise((resolve, reject) => {
      installCountdown.stop()
      figlet('Enjoy your project!', 'Standard', (err, data) => {
        if (err) reject()
        resolve(data)
      })
    }))
    .then(data => console.log(data, '\n'))
    .then(() => console.log(
      `  Your project has been inited! To launch your app please

      ${chalk.yellow(`cd ${projectName} && npm start`)}`
    ))
    .catch(console.log)
}

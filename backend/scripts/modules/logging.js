const chalk = require("chalk")

function log(...msg) {
    console.log(...msg)
}

function warn(...msg) {
    console.warn(chalk.bold.yellow(...msg))
}

function error(...msg) {
    console.error(chalk.bold.red(...msg))
}

function success(...msg) {
    log(chalk.bold.green(...msg))
}

function notice(...msg) {
    log(chalk.bold.blue(...msg))
}



module.exports = {
    error,
    warn,
    log,
    notice,
    success
}
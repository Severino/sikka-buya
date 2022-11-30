require("dotenv").config()
const spawn = require('child_process').spawn;
const child = spawn(`npx cypress run --record --key=${process.env.CYPRESS_RECORD_KEY}`, [], {
    shell: true
})

child.on("exit", function (code) {
    console.log(`Program exited with code ${code}.`)
})

child.on("error", function (code) {
    console.log(`Program exited with code ${Array.from(arguments).join(" - ")}.`)
})

child.stdout.on("data", function (data) {
    console.log(data.toString())
})

child.stderr.on("data", function (data) {
    console.error(data.toString())
})
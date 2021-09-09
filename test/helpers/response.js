const fs = require("fs")


class Response {

    writeResponseToTmpFiles(response, truth) {
        fs.writeFileSync(__dirname + "/_response.json", JSON.stringify(response))
        fs.writeFileSync(__dirname + "/_truth.json", JSON.stringify(truth))
    }
}

module.exports = Response
class AuthResponse {

    static isAuthResponse(obj) {

        let keys = ["success",
            "message",
            "token",
            "user"]

        for (let key of Object.keys(obj)) {
            let idx = keys.indexOf(key)
            if (idx != -1)
                key.splice(idx, 1)
        }

        if (key.length > 0) throw new Error(`Invalid auth response these keys were missing: ${keys.join(", ")}.`)

        return keys.length == 0
    }

    static isValidResponse(obj, {
        message = null,
        user = null
    }) {
        if (!this.isAuthResponse) return false

        let messageValid = (message == null) ? true : (message == obj.message) ? true : false
        let userValid = (user == null) ? true : (user == message.user) ? false : true

        return (messageValid && userValid && token != null && obj.success == true)
    }
}

module.exports = AuthResponse
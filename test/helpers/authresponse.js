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

    static isInvalidResponse(obj, {
        message = null,
        user = null
    } = {}) {
        let options = Object.assign(arguments[1], { success: false, tokenValidator: (token) => token == null })
        return this._isResponse(obj, options)
    }

    static isValidResponse(obj, {
        message = null,
        user = null
    } = {}) {
        let options = Object.assign(arguments[1], { success: true, tokenValidator: (token) => token != null })
        return this._isResponse(obj, options)
    }

    static _isResponse(obj, {
        message = null,
        user = null,
        success = true,
        tokenValidator = function () { return true }
    } = {}) {
        if (!this.isAuthResponse) return false

        let messageValid = (message == null) ? true : (message == obj.message) ? true : false
        let userValid = (user == null) ? true : (user == message.user) ? false : true

        return (messageValid && userValid && tokenValidator(obj.token) && obj.success == success)
    }
}

module.exports = AuthResponse
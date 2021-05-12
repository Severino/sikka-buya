const bcrypt = require("bcrypt")
const { RegExValidationRule, FunctionValidationRule } = require("./validation")
const jwt = require("jsonwebtoken")
const { Database } = require("./utils/database")
const validator = require("email-validator")

class Auth {
    static get saltIterations() {
        return 10
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, this.saltIterations)
    }

    static async checkPassword(password, hashedPW) {
        return await bcrypt.compare(password, hashedPW)
    }

    static validatePassword(str) {
        let rule = new RegExValidationRule(/^([\x21-\x7E]){6,}$/gi, "Ungültiges Password: Passwörter dürfen nur Buchstaben, Zeichen und gängige Sonderzeichen enthalten.")
        return rule.validate(str)
    }

    static validateEmail(str) {
        let rule = new FunctionValidationRule(validator.validate, "Ungültige Email-Adresse")
        return rule.validate(str)
    }


    static isAuthenticated() {
        console.log("AUTH WORING")
        return false
    }

    static async login(_, args) {
        const { email, password } = args.data
        /* 
        We don't want to break out of the function, when we found no user, to
        not provide a potential attacker, that the user does (not) exist!  
        */
        try {
            let user = await Database.one("SELECT * FROM app_user WHERE email=$1", email)
            let result = await Auth.checkPassword(password, user.password)
            if (result) {
                const token = jwt.sign({
                    id: user.id,
                    email: user.email
                }, process.env.JWT_KEY, {
                    expiresIn: "12h"
                })

                return {
                    success: true,
                    message: "Successfully authenticated.",
                    token
                }
            }
        } catch (e) { /*Wrong user was passed. Thats fine! */ console.log(e) }


        return {
            success: false,
            message: "Die Angaben waren Falsch! Bitte überprüfen Sie ihren Nutzernamen und das Passwort.",
            token: null
        }
    }

    static verify(token) {
        try {
            jwt.verify(token, process.env.JWT_KEY)
            return true
        } catch (e) {
            return false
        }

    }
}

module.exports = Auth
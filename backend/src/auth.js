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
        let rule = new RegExValidationRule(/^([\x21-\x7E]){6,}$/gi, "Ungültiges Password: Passwort muss mindestens 6 Zeichen lang sein und darf nur Buchstaben, Zeichen und gängige Sonderzeichen enthalten.")
        return rule.validate(str)
    }

    static validateEmail(str) {
        let rule = new FunctionValidationRule(validator.validate, "Ungültige Email-Adresse")
        return rule.validate(str)
    }

    /**
  * Login method checks the database for the hashed version of the password 
  * to authenticate the user.
  * 
  * @param {*} _ 
  * @param {{email:string, password:string}} args.data - Provide email and password for the login.
  * @returns {{success:boolean, message:string, token:string, user:object}} Returns an authentication object, that is send and stored at the client. 
  */
    static async login(_, args) {
        const { email, password } = args
        /* 
        We don't want to break out of the function, when we found no user, to
        not provide a potential attacker, with the information that the user does (not) exist!  
        */

        try {
            let user = await Database.oneOrNone("SELECT * FROM app_user WHERE email=$1", email)
            let result = await Auth.checkPassword(password, user.password)

            if (result) {
                return {
                    success: true,
                    message: "Successfully authenticated.",
                    token: this.sign({
                        superUser: user.super,
                        id: user.id,
                        email: user.email
                    }),
                    user: {
                        id: user.id,
                        email: user.email,
                        super: user.super
                    }
                }
            }
        } catch (e) {
            /*Wrong user was passed. Thats fine! */
            console.error(e)
        }

        return {
            success: false,
            message: "Die Angaben waren Falsch! Bitte überprüfen Sie ihren Nutzernamen und das Passwort.",
            token: null
        }
    }

    static sign({ id = null, email = null, superUser = null } = {}) {
        return jwt.sign({
            id,
            email,
            super: superUser
        }, process.env.JWT_SECRET, {
            expiresIn: "12h"
        })

    }


    /**
     * Verifies a jwt token to authenticate the user. 
     * 
     * @param {object} token - JWT token, that was created and stored at the client by the servers {@link login}  
     * @returns {boolean} - True if valid, false otherwise.
     */
    static verify(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (e) {
            throw new Error("401")
        }
    }

    static getTokenFromContext(context) {
        return (context && context.headers) ? context.headers.auth : null
    }

    static verifyContext(context) {
        let token = this.getTokenFromContext(context)

        if (!token) throw new Error("401")
        else return this.verify(token)
    }

    static requireAuthContext(context) {
        let auth = Auth.verifyContext(context)
        if (!auth) {
            throw new Error('You are not authenticated!')
        }
    }

    static requireSuperUser(context) {
        const token = this.verifyContext(context)

        if (token) {
            if (token.super === true) {
                return true
            }
        }
        throw new Error(`Only a super user can do this!`)
    }
}

module.exports = Auth
class TestUser {

    static _superUser = null
    static _users = []

    token = null

    constructor(email, password) {
        this.email = email
        this.password = password
    }

    isLoggedIn() {
        return this.token != null
    }


    authenticate(token) {
        this.token = token
    }

    static hasSuperUser() {
        return this.superUser != null
    }

    static get superUser() {
        return this._superUser
    }

    static setSuperUser(user) {
        this._superUser = user
    }

    static hasUser() {
        return this._users.length > 0
    }

    static get users() {
        return this._users
    }

    static addUser(user) {
        this.users.push(user)
    }



}

module.exports = TestUser
import Query from "../database/query"

export default class Auth {

    static get tokenStore() {
        return "auth-jwt-token"
    }

    static get userStore() {
        return "auth-user"
    }

    static saveUser(user) {
        localStorage.setItem(this.userStore, JSON.stringify(user))
    }

    static loadUser() {
        let userStr = localStorage.getItem(this.userStore)
        let user = { id: 0, email: "Unknown" }
        try {
            user = JSON.parse(userStr)
        } catch (e) {
            console.error(`User could not be loaded. Forced a user logout!`, e)
        }

        return user
    }

    static saveToken(token) {
        localStorage.setItem(this.tokenStore, token)
    }

    static loadToken() {
        return localStorage.getItem(this.tokenStore)
    }

    static async check() {
        const token = this.loadToken()
        let status = true
        if (token) {
            let response = await Query.raw(`{
                auth(token:"${token}")
            }`)



            return (response && response.data && response.data.data && response.data.data.auth) ? response.data.data.auth : null
        } else {
            status = false
        }
        return status
    }

    static logout() {
        localStorage.removeItem(this.tokenStore)
        localStorage.removeItem(this.userStore)
    }

    static async login(email, password) {
        let result = await Query.raw(`{
            login(data: {
              email: "${email}",
              password: "${password}"
            }){
                success
                message
                token
                user {
                    id
                    email
                    super
                }
              }
            }`);



        let response = { success: false, message: "Interner Fehler, melden Sie das Problem dem Admin. ", user: null }

        if (result && result.data && result.data.data && result.data.data.login) {
            const login = result.data.data.login
            const { success, message, token, user } = login
            response = Object.assign(response, {
                success, message, user
            })

            if (success) {
                this.saveToken(token)
                this.saveUser(user)
            }
        }

        console.log(result)

        return response
    }
}
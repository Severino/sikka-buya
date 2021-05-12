import Query from "../database/query"

export default class Auth {

    static get tokenName() {
        return "auth-jwt-token"
    }

    static saveToken(token) {
        localStorage.setItem(this.tokenName, token)
    }

    static loadToken() {
        return localStorage.getItem(this.tokenName)
    }

    static async check() {
        const token = this.loadToken()
        let status = true
        console.log({ token })
        if (token) {
            let response = await Query.raw(`{
                auth(token:"${token}")
            }`)
            console.log(response)

            return response?.data?.data?.auth
        } else {
            status = false
        }
        console.log({ status })
        return status
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
              }
            }`);

        const login = result?.data?.data?.login

        let response = { success: false, message: "Interner Fehler, melden Sie das Problem dem Admin. " }
        console.log(login)

        if (login) {
            const { success, message, token } = login
            response = Object.assign(response, {
                success, message
            })

            if (success) {
                this.saveToken(token)
            }
        }

        return response
    }
}
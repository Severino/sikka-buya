const { warn } = require("../../backend/scripts/modules/logging.js")
const { graphql } = require('./graphql.js')

class TestUser {

    constructor(email, password, superUser = false) {
        this.id = null
        this.token = null
        this.email = email
        this.password = password
        this.superUser = superUser
    }

    isLoggedIn() {
        return this.token != null
    }

    authenticate(token) {
        this.token = token
    }

    async login() {
        let response = await TestUser.login(this.email, this.password)
        if (response?.data?.data?.login?.success) {
            let data = response?.data?.data?.login
            this.token = data.token
            let { id, super: superUser } = data.user
            this.superUser = superUser
            this.id = id
        } else warn(`Could not login test user ${this.email}!`, response)
        return response
    }


    static async login(email, password, debug = false) {
        return await graphql(`query Login($email: String!, $password:String!){ login(
            email: $email,
            password: $password
          ){
              success
              message
              token
              user {
                  id
                  email
                  super
              }
            }
          }`, { email, password }, null, debug)
    }
}

module.exports = TestUser
const chai = require('chai')
const expect = chai.expect
// const chaiGraphQL = require('chai-graphql')
// chai.use(chaiGraphQL)

const AuthResponse = require('../helpers/authresponse')

const { graphql } = require('../helpers/graphql')
const { User1, User2, SuperUser } = require('../mockdata/users')

describe(`User management`, function () {

    it(`Regular user is not logged in.`, function () {
        expect(User1.isLoggedIn()).to.be.false
    })

    it(`Unregistered user cannot login`, async function () {
        const user = User1
        const result = await graphql(`{ login(
            email: "${user.email}",
            password: "${user.password}"
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
          }`)

        expect(AuthResponse.isInvalidResponse(result.data.data.login, {
            message: "Die Angaben waren Falsch! Bitte überprüfen Sie ihren Nutzernamen und das Passwort."
        })).to.be.true

    })


    it(`Super user can log in`, async function () {
        const result = await graphql(`{ login(
            email: "${SuperUser.email}",
            password: "${SuperUser.password}"
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
          }`)

        expect(result.data.data.login.token).is.not.null
        SuperUser.authenticate(result.data.data.login.token)
    })

    it(`Uninvited user cannot accept an invite`, async function () {
        const user = User1
        const response = graphql(`mutation{ acceptInvite(
            email: "${user.email}",
            password: "${user.password}"
          )
          }`)

        await expect(response).to.be.rejectedWith(['Could not set password!'])

    })

    it(`Uninvited user cannot send an invite`, async function () {
        const response = graphql(`
            mutation {
                inviteUser(email: "${User2.email}" )
            }
        `)

        await expect(response).to.be.rejectedWith(["401"])

    })

    it(`Super user can invite new users`, async function () {
        const response = graphql(`
            mutation {
                inviteUser(email: "${User1.email}" )
            }
        `, {}, SuperUser.token)


        await expect(response).to.be.fulfilled
    })


    it(`User can accept invite`, async function () {
        const response = graphql(`mutation{ acceptInvite(
            email: "${User1.email}",
            password: "${User1.password}"
          )
          }`)

        await expect(response).to.be.fulfilled
    })


    it(`Invited user can log in`, async function () {
        const result = await graphql(`{ login(
            email: "${User1.email}",
            password: "${User1.password}"
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
          }`)

        expect(result.data.data.login.token).is.not.null
        User1.authenticate(result.data.data.login.token)
    })


    it(`Externals cannot view users list`, async function () {
        const result = graphql(`{users{id, super, email}}`)
        expect(result).to.be.rejectedWith(["401"])
    })

    it(`Regular user cannot view users list`, async function () {
        const result = graphql(`{users{id, super, email}}`, {}, User1.token)
        expect(result).to.be.rejectedWith(["401"])
    })


    it(`Super user can view users list`, async function () {
        const result = graphql(`{users{id, super, email}}`, {}, SuperUser.token)
        expect(result).to.be.fulfilled
    })

})
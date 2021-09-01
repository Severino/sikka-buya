const chai = require('chai')
const expect = chai.expect
// const chaiGraphQL = require('chai-graphql')
// chai.use(chaiGraphQL)

const AuthResponse = require('../helpers/authresponse')

const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')

describe(`User management`, function () {

    it(`Super user must be set, or nothing works.`, function () {
        expect(TestUser.hasSuperUser()).to.be.true
    })

    it(`Has a regular user`, function () {
        expect(TestUser.hasUser()).to.be.true
    })

    it(`Regular user is not logged in.`, function () {
        expect(TestUser.users[0].isLoggedIn()).to.be.false
    })

    it(`Unregistered user cannot login`, async function () {
        const user = TestUser.users[0]
        const result = await graphql(`{ login(data: {
            email: "${user.email}",
            password: "${user.password}"
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
          }`)

        expect(AuthResponse.isInvalidResponse(result.data.data.login, {
            message: "Die Angaben waren Falsch! Bitte überprüfen Sie ihren Nutzernamen und das Passwort."
        })).to.be.true

    })


    it(`Super user can log in`, async function () {
        const superUser = TestUser.superUser
        const result = await graphql(`{ login(data: {
            email: "${superUser.email}",
            password: "${superUser.password}"
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
          }`)

        expect(result.data.data.login.token).is.not.null
        superUser.authenticate(result.data.data.login.token)
    })

    it(`Uninvited user cannot accept an invite`, async function () {
        const user = TestUser.users[0]
        const response = graphql(`mutation{ acceptInvite(
            email: "${user.email}",
            password: "${user.password}"
          )
          }`)

        await expect(response).to.be.rejectedWith(['Could not set password!'])

    })

    it(`Uninvited user cannot send an invite`, async function () {

        const otherUser = new TestUser("sergent.pepper@lonelyheartsclubband.uk", "ringo")
        TestUser.addUser(otherUser)

        const response = graphql(`
            mutation {
                inviteUser(email: "${otherUser.email}" )
            }
        `)

        await expect(response).to.be.rejectedWith(["401"])

    })

    it(`Super user can invite new users`, async function () {
        const user = TestUser.users[0]
        const response = graphql(`
            mutation {
                inviteUser(email: "${user.email}" )
            }
        `, {}, TestUser.superUser.token)

        await expect(response).to.be.fulfilled
    })


    it(`User can accept invite`, async function () {
        const user = TestUser.users[0]
        const response = graphql(`mutation{ acceptInvite(
            email: "${user.email}",
            password: "${user.password}"
          )
          }`)

        await expect(response).to.be.fulfilled
    })


    it(`Invited user can log in`, async function () {
        const user = TestUser.users[0]
        const result = await graphql(`{ login(data: {
            email: "${user.email}",
            password: "${user.password}"
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
          }`)

        expect(result.data.data.login.token).is.not.null
        user.authenticate(result.data.data.login.token)
    })


    it(`Externals cannot view users list`, async function () {
        const result = graphql(`{users{id, super, email}}`)
        expect(result).to.be.rejectedWith(["401"])
    })

    it(`Regular user cannot view users list`, async function () {
        const user = TestUser.users[0]
        const result = graphql(`{users{id, super, email}}`, {}, user.token)
        expect(result).to.be.rejectedWith(["401"])
    })


    it(`Super user can view users list`, async function () {
        const user = TestUser.superUser
        const result = graphql(`{users{id, super, email}}`, {}, user.token)
        expect(result).to.be.fulfilled
    })

})
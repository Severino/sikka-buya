const chai = require('chai');
const expect = chai.expect

const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

const { graphql, authenticate } = require('../helpers/graphql');



describe(`Run tests on GraphQL interface`, async function () {

    // after(function () {
    //     process.exit()
    // })

    /**
     * The env file describes how the database is accessed!
     * 
     * We have to verify first, that it was created properly.
     */
    describe("Check .env variables", function () {
        ["user",
            "password",
            "port",
            "host",
            "database"].forEach(var_name => {
                it(`Is env variable is set: ${var_name}`, function () {
                    expect(process.env[var_name]).to.not.be.undefined
                })
            })
    })

    describe("Setup Test Environment", function () {

        const User = {
            email: "tom.testa@example.com",
            password: "secure_password"
        }

        it(`Test if application is running properly`, async function () {
            let result = await graphql(`{
                ping
                }`)

            expect(result?.data?.data?.ping).to.not.be.undefined
        })

        it(`Setup the application with super user`, async function () {

            let result = await graphql(`mutation {
                setup(data: {email: "${User.email}", password: "${User.password}"}) {
                  user {
                    id
                    email
                    super
                  }
                  token
                  success
                  message
                }
              }`)



            expect(result.data.data.setup).to.deep.include({
                success: true,
                message: null,
                user: {
                    id: "1",
                    email: User.email,
                    super: true
                }
            })
        })

        it(`Additional setup results in an error`, async function () {

            const User = {
                email: "susan.sugar@example.com",
                password: "super_secure_password"
            }


            let promise = graphql(`mutation {
                setup(data: {email: "${User.email}", password: "${User.password}"}) {
                  user {
                    id
                    email
                    super
                  }
                  token
                  success
                  message
                }
              }`)

            await expect(promise).to.be.rejected

        })
    })
})



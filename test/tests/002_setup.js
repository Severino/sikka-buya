const chai = require('chai');
const expect = chai.expect
const fs = require("fs/promises")

const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

const { graphql } = require('../helpers/graphql');
const TestUser = require('../helpers/test-user');
const path = require('path');



describe(`Setup test environment`, async function () {
  let user;
  before(function () {
    user = new TestUser("tom.testa@example.com", "secure_password")
    TestUser.setSuperUser(user)

    user = { email: "tom.testa@example.com", password: "secure_password" }
  })


  it(`Test if application is running properly`, async function () {
    let result = await graphql(`{
                ping
                }`)

    expect(result?.data?.data?.ping).to.not.be.undefined
  })

  it(`Setup the application with super user`, async function () {

    let result = await graphql(`mutation {
                setup(data: {email: "${user.email}", password: "${user.password}"}) {
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




    await fs.writeFile(path.join(__dirname, "..", "token.txt"), result.data.data.setup.token)

    expect(result.data.data.setup).to.deep.include({
      success: true,
      message: null,
      user: {
        id: "1",
        email: user.email,
        super: true
      }
    })
  })

  it(`Additional setup results in an error`, async function () {

    const user = new TestUser("susan.sugar@example.com", "super_secure_password")
    TestUser.addUser(user)

    let promise = graphql(`mutation {
                setup(data: {email: "${user.email}", password: "${user.password}"}) {
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



    await expect(promise).to.be.rejectedWith(['Superuser was already initialized!'])

  })
})
const TestUser = require('../helpers/test-user')

const SuperUser = new TestUser("tom.testa@example.com", "secure_password", true)
const User1 = new TestUser("susan.sugar@example.com", "super_secure_password")
const User2 = new TestUser("michelle.mohrruebe@example.com", "always_use_strong_passwords")

module.exports = {
    SuperUser,
    User1,
    User2
}
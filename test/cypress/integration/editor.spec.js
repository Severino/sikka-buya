import coin_mark from './editor/coin_mark';
import dynasty from './editor/dynasty';
import honorific from './editor/honorific';
import material from './editor/material';
import mint from './editor/mint';
import nominal from './editor/nominal';
import person from './editor/person';
import province from './editor/province';
import role from './editor/role';
import title from './editor/title';
import type from './editor/type';

describe('Testing Editor Pages', function () {

    let user;

    this.beforeAll(function () {
        cy.task("MountMinimalDatabase")
        cy.fixture("users/admin").then(_user => {
            user = _user
            cy.login(user.email, user.password)
        })
    })

    this.beforeEach(function () {
        cy.restoreLocalStorage()
    })

    // describe("Coin Mark", coin_mark.bind(this))
    // describe("Dynasty", dynasty.bind(this))
    // describe("Honorific", honorific.bind(this))
    // describe("Material", material.bind(this))
    // describe("Mint", mint.bind(this))
    // describe("Nominal", nominal.bind(this))
    // describe("Person", person.bind(this))
    // describe("Provinz", province.bind(this))
    // describe("Role", role.bind(this))
    // describe("Title", title.bind(this))

    describe("Type", type.bind(this))
})
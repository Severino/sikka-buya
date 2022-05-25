describe('Testing Editor Pages', function () {

    let user;

    this.beforeAll(function () {
        cy.task("MountMinimalDatabase")
        cy.fixture("users/admin").then(_user => {
            user = _user
            cy.wait(30000)
            cy.login(user.email, user.password)
        })

    })

    describe("Material", function () {

        it("Item in editor list", function () {
            cy.visit('/editor')
        })

    })

})
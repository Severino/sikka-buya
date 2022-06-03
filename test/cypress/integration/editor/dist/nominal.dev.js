"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default() {
  it("Item in editor list", function () {
    cy.visit('/editor');
    cy.get(".list-item").contains("Nominal");
  });
  it("Navigate to List", function () {
    cy.get(".list-item").contains("Nominal").click();
    cy.location("pathname").should(function (pathname) {
      expect(pathname).to.eq("/editor/nominal");
    });
    cy.get(".list-item").contains("Dinar");
    cy.get(".list-item").contains('Ruknī-Dinar');
  });
  it("List is showing", function () {
    cy.visit('/editor/nominal');
    cy.get(".list").children().should("have.length", 2);
  });
  it("List item is visible", function () {
    cy.visit('/editor/nominal');
    cy.get(".list-item").contains("Dinar").should("be.visible");
  });
  it("Can filter", function () {
    cy.visit('/editor/nominal');
    cy.get("input[type=search]").type("rukni");
    cy.get(".list").children().should("have.length", 1);
  });
  describe("Create Nominal", function () {
    it("Can reach create page", function () {
      cy.visit("/editor/nominal");
      cy.get("#create-button").click();
      cy.location("pathname").should(function (pathname) {
        expect(pathname).to.eq("/editor/nominal/create");
      });
      cy.get("#nominal-name").should("have.value", "");
    });
    it("Can cancel create", function () {
      cy.visit("/editor/nominal/create");
      cy.get("#nominal-name").type("xxxxx");
      cy.get("#cancel-button").click();
      cy.location("pathname").should(function (pathname) {
        expect(pathname).to.eq("/editor/nominal");
      });
      cy.get(".list-item").children().should("have.length", 2);
      cy.get(".list-item").contains("Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
    });
    it("Can create new", function () {
      cy.visit("/editor/nominal/create");
      cy.get("#nominal-name").type("Ǧalālī-Dinar");
      cy.get("#submit-button").click();
      cy.location("pathname").should(function (pathname) {
        expect(pathname).to.eq("/editor/nominal");
      });
      cy.get(".list-item").children().should("have.length", 3);
      cy.get(".list-item").contains("Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list-item").contains("Ǧalālī-Dinar");
    });
  }); //"Muṭīʿī-Dinar"

  describe("Edit Nominal", function () {
    it("Access edit page", function () {
      cy.visit('/editor/nominal');
      cy.get(".list-item").contains("Ruknī-Dinar").click();
      cy.location("pathname").should(function (pathname) {
        expect(pathname).to.eq("/editor/nominal/2");
      });
      cy.get("#nominal-id").should("have.value", "2");
      cy.get("#nominal-name").should("have.value", "Ruknī-Dinar");
    });
    it("Cannot edit with wrong id", function () {
      cy.visit('/editor/nominal/22');
      cy.get(".information.error").should("not.be.empty");
      cy.get("button").contains("senden").should("have.attr", "disabled");
    });
    it("Correct id set", function () {
      cy.visit('/editor/nominal/3');
      cy.get("#nominal-id").should("have.value", 3);
    });
    it("Can cancel", function () {
      cy.visit('/editor/nominal/3');
      cy.get("#nominal-name").clear().type("xxxxxxxx");
      cy.get("#cancel-button").click();
      cy.get(".list-item").contains("Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list-item").contains("Ǧalālī-Dinar");
    });
    it("Can update", function () {
      cy.visit('/editor/nominal/3');
      cy.get("#nominal-name").clear().type("Muṭīʿī-Dinar");
      cy.get("#cancel-button").click();
      cy.get(".list-item").contains("Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list-item").contains("Ǧalālī-Dinar");
    });
  });
  describe("List Order", function () {
    it("List is in alphabetical order", function () {
      cy.visit("/editor/nominal");
      cy.get('.list-item .cell').then(function ($items) {
        var arr = $items.map(function (_, html) {
          return Cypress.$(html).text();
        }).get();
        console.log(arr);
        return arr;
      }).should('deep.eq', ["Dinar", 'Ǧalālī-Dinar', 'Ruknī-Dinar']);
    });
  });
  describe("Delete Nominal", function () {
    it("Delete", function () {
      cy.visit("/editor/nominal");
      cy.triggerDeleteButton(".list-item:nth-child(2) .dynamic-delete-button");
      cy.get(".list-item").contains("Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list-item").contains("Ǧalālī-Dinar").should("not.exist");
    });
    it("Still Deleted On Reload", function () {
      cy.visit("/editor/nominal");
      cy.get(".list-item").contains("Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list-item").contains("Ǧalālī-Dinar").should("not.exist");
    });
  });
}
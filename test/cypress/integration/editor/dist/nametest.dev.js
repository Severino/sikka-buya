"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default(name) {
  var initData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var createData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var updateData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  function capitalize(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  return function () {
    it("Item in editor list", function () {
      cy.visit('/editor');
      cy.get(".list-item").contains("Nominal");
    });
    it("Navigate to List", function () {
      cy.get(".list-item").contains("Nominal").click();
      cy.location("pathname").should(function (pathname) {
        expect(pathname).to.eq("/editor/".concat(name));
      });
      initData.forEach(function (data) {
        cy.get(".list-item").contains(data.name);
      });
    });
    it("".concat(capitalize(name), " list is showing"), function () {
      cy.visit("/editor/".concat(name));
      cy.get(".list").children().should("have.length", 2);
    });
    it("List item is visible", function () {
      cy.visit("/editor/".concat(name));
      cy.get(".list-item").contains(initData[0].name).should("be.visible");
    });
    it("Can filter", function () {
      cy.visit("/editor/".concat(name));
      cy.get("input[type=search]").type("rukni");
      cy.get(".list").children().should("have.length", 1);
    });
    it("Can edit", function () {
      cy.visit("/editor/".concat(name));
      cy.get(".list-item").contains("Ruknī-Dinar").click();
      cy.location("pathname").should(function (pathname) {
        expect(pathname).to.eq("/editor/".concat(name, "/2"));
      });
    });
    it("Correct id set", function () {
      cy.visit("/editor/".concat(name, "/2"));
      cy.get("#nominal-id").should("have.value", 2);
    });
    it("Can cancel", function () {
      cy.visit("/editor/".concat(name, "/2"));
      cy.get("#nominal-name").clear().type("xxxxxxxx");
      cy.get("#cancel-button").click();
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list-item").contains("Dinar");
    });
    it("Can update", function () {
      cy.visit("/editor/".concat(name, "/1"));
      cy.get("#nominal-name").clear().type("Muṭīʿī-Dinar");
      cy.get("#submit-button").click();
      cy.get(".list-item").contains("Muṭīʿī-Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list").children().should("have.length", 2);
    });
    it("Can reach create page", function () {
      cy.visit("/editor/".concat(name));
      cy.get("#create-button").click();
      cy.location("pathname").should(function (pathname) {
        expect(pathname).to.eq("/editor/".concat(name, "/create"));
      });
      cy.get("#nominal-name").should("have.value", "");
    });
    it("Can cancel create", function () {
      cy.visit("/editor/".concat(name, "/create"));
      cy.get("#nominal-name").type("xxxxx");
      cy.get("#cancel-button").click();
      cy.location("pathname").should(function (pathname) {
        expect(pathname).to.eq("/editor/".concat(name));
      });
      cy.get(".list-item").children().should("have.length", 2);
      cy.get(".list-item").contains("Muṭīʿī-Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
    });
    it("Can create new nominal", function () {
      cy.visit("/editor/".concat(name, "/create"));
      cy.get("#nominal-name").type("Ǧalālī-Dinar");
      cy.get("#submit-button").click();
      cy.location("pathname").should(function (pathname) {
        expect(pathname).to.eq("/editor/".concat(name));
      });
      cy.get(".list-item").children().should("have.length", 3);
      cy.get(".list-item").contains("Muṭīʿī-Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list-item").contains("Ǧalālī-Dinar");
    });
    it("List is in alphabetical order", function () {
      cy.visit("/editor/".concat(name));
      cy.get('.list-item .cell').then(function ($items) {
        var arr = $items.map(function (_, html) {
          return Cypress.$(html).text();
        }).get();
        console.log(arr);
        return arr;
      }).should('deep.eq', ['Ǧalālī-Dinar', 'Muṭīʿī-Dinar', 'Ruknī-Dinar']);
    });
    it("Delete", function () {
      cy.visit("/editor/".concat(name));
      cy.triggerDeleteButton(".list-item:nth-child(1) .dynamic-delete-button");
      cy.get(".list-item").contains("Muṭīʿī-Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list-item").contains("Ǧalālī-Dinar").should("not.exist");
    });
    it("Still Deleted On Reload", function () {
      cy.visit("/editor/".concat(name));
      cy.get(".list-item").contains("Muṭīʿī-Dinar");
      cy.get(".list-item").contains("Ruknī-Dinar");
      cy.get(".list-item").contains("Ǧalālī-Dinar").should("not.exist");
    });
  };
}
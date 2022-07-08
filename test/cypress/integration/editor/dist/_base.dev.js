"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default() {
  it("Item in editor list", function () {
    cy.visit('/editor');
    cy.get(".list-item").contains();
  });
  it("Navigate to List", function () {
    cy.get(".list-item").contains().click();
    cy.location("pathname").should(function (pathname) {
      expect(pathname).to.eq("/editor/material");
    });
  });
  it("***** list is showing", function () {});
  it("List item is visible", function () {});
  it("Can filter", function () {});
  it("Can edit", function () {});
  it("Correct id set", function () {});
  it("Can cancel", function () {});
  it("Can update", function () {});
  it("Can reach create page", function () {});
  it("Can cancel create", function () {});
  it("Can create new *****", function () {});
  it("Delete", function () {});
}
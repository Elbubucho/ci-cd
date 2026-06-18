function fillValidForm() {
  cy.get("#firstname").type("Jean");
  cy.get("#name").type("Dupont");
  cy.get("#email").type(`jean.${Date.now()}@example.com`);
  cy.get("#birth").type("1998-01-22");
  cy.get("#postcode").type("75001");
  cy.get("#city").type("Paris");
}

describe("Tests en mode Offline", () => {
  beforeEach(function () {
    if (!Cypress.env("offline")) this.skip();
  });

  it("affiche un toaster d'erreur quand le backend est down au submit", () => {
    cy.visit("/");
    fillValidForm();
    cy.contains("button", /^send$/i).click();
    cy.get('[data-testid="toast"]', { timeout: 10000 })
      .should("contain.text", "Error saving user");
  });

  it("affiche '0 user(s) already registered' en fallback quand /users échoue", () => {
    cy.visit("/");
    cy.contains("0 user(s) already registered");
  });

  it("la liste des utilisateurs tombe sur 'No registered users' quand le backend est down", () => {
    cy.visit("/");
    cy.contains("button", /show registered users/i).click();
    cy.contains(/no registered users/i);
  });
});

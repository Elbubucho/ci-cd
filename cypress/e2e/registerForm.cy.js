const api = Cypress.env("apiUrl");

function resetUsers() {
  cy.request("GET", `${api}/users`).then((res) => {
    (res.body.users || []).forEach((u) => {
      cy.request("DELETE", `${api}/users/${u.id}`);
    });
  });
}

function fillValidForm(overrides = {}) {
  const values = {
    firstname: "Jean",
    name: "Dupont",
    email: `jean.${Date.now()}@example.com`,
    birth: "1998-01-22",
    postcode: "75001",
    city: "Paris",
    ...overrides,
  };
  cy.get("#firstname").type(values.firstname);
  cy.get("#name").type(values.name);
  cy.get("#email").type(values.email);
  cy.get("#birth").type(values.birth);
  cy.get("#postcode").type(values.postcode);
  cy.get("#city").type(values.city);
}

describe("RegisterForm E2E (online)", () => {
  beforeEach(function () {
    if (Cypress.env("offline")) this.skip();
    resetUsers();
  });

  it("0 user → add a valid user → 1 user", () => {
    cy.visit("/");
    cy.contains("0 user(s) already registered");

    fillValidForm();
    cy.contains("button", /^send$/i).should("not.be.disabled").click();
    cy.get('[data-testid="toast"]').should("contain.text", "Saved Successfully");

    cy.reload();
    cy.contains("1 user(s) already registered");
  });

  it("1 user → try to add an invalid user → still 1 user", () => {
    cy.request("POST", `${api}/user`, {
      first_name: "Marie",
      name: "Curie",
      email: `marie.${Date.now()}@example.com`,
      birth: "1990-05-10",
      postcode: "69001",
      city: "Lyon",
    });

    cy.visit("/");
    cy.contains("1 user(s) already registered");

    fillValidForm({ email: "not-an-email" });
    cy.contains(/invalid email/i).should("exist");
    cy.contains("button", /^send$/i).should("be.disabled");

    cy.reload();
    cy.contains("1 user(s) already registered");
  });
});

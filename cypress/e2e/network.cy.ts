describe("Category Network", () => {
    it("Should not show any races when the network response is empty", () => {
      cy.intercept("GET", "/v2/racing/next-races-category-group?count=*", {}).as(
        "races"
      );
      cy.visit("");
      cy.get("[data-testid=cypress-race-name]").should("not.exist");
    });
  });
  
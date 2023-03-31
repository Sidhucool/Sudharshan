const getArrayOfElementsAndAssert = require("../support/utility.js")

describe("Countdown Timer", () => {
  // Making the timestamp available to all tests
  const timestamp = 1674273745469;
  beforeEach("Set the races and set the clock", () => {
    // Setting the races to hard coded time to make tests deterministic
    cy. ("GET", "/v2/racing/next-races-category-group?count=*", {
      fixture: "setRaces.json",
    }).as("races");
    // Setting the time to control the timestamps
    cy.clock(timestamp);
  });

  it("Should have correct timers when the app loads", () => {
    cy.visit("");
    getArrayOfElementsAndAssert("[data-testid=cypress-counter]", [
      "0s",
      "0s",
      "0s",
      "1m",
      "1m",
    ]);
    getArrayOfElementsAndAssert("[data-testid=cypress-race-name]", [
      "R1Murray Bridge",
      "R1Wagga",
      "R1Cobram",
      "R2Dalby",
      "R2Townsville"
  ])
  });

  it("Should advance the timers when time advances", () => {
    cy.visit("");
    cy.clock(timestamp).tick(10000);
    getArrayOfElementsAndAssert("[data-testid=cypress-counter]", [
      "-10s",
      "-10s",
      "-10s",
      "50s",
      "50s",
    ]);
    getArrayOfElementsAndAssert("[data-testid=cypress-race-name]", [
      "R1Murray Bridge",
      "R1Wagga",
      "R1Cobram",
      "R2Dalby",
      "R2Townsville"
  ])
  });

  it("Should advance the races as the time advances", () => {
    cy.visit("");
    cy.clock(timestamp).tick(500000);
    getArrayOfElementsAndAssert("[data-testid=cypress-counter]", [
      "-4m 20s",
      "-4m 20s",
      "-3m 20s",
      "-3m 20s",
      "-2m 20s",
    ]);
    getArrayOfElementsAndAssert("[data-testid=cypress-race-name]", [
      "R5Yonkers Raceway",
      "R5Healesville",
      "R6Yonkers Raceway",
      "R6Penn National",
      "R7Delta Downs"
  ])
  });
});
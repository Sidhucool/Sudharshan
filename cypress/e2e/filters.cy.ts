const getArrayOfElementsAndAssert = require("../support/utility.js");
import { CATEGORY_ID_GREYHOUND } from "../config/constants";

describe("Category Filters", () => {
  // Making the timestamp available to all tests
  const timestamp = 1674273745469;
  beforeEach("Set the races and set the clock", () => {
    // Setting the races to hard coded time to make tests deterministic
    cy.intercept("GET", "/v2/racing/next-races-category-group?count=*", {
      fixture: "setRaces.json",
    }).as("races");
    // Setting the time to control the timestamps
    cy.clock(timestamp);
    // Check default state of filters for each test
    cy.visit("");
    cy.get("[data-testid=category-filter-checkbox]").each(($el) => {
      cy.wrap($el).should("be.checked");
    });
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
      "R2Townsville",
    ]);
  });

  it("Should filter results correctly", () => {
    cy.get("[data-testid=category-filter-checkbox]").first().uncheck();
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
      "R2Townsville",
      "R2Waterlea",
    ]);
  });

  it("Should reset filters when all are unchecked", () => {
    cy.get("[data-testid=category-filter-checkbox]").each(($el) => {
      cy.wrap($el).uncheck();
    });
    cy.get("[data-testid=category-filter-checkbox]").each(($el) => {
      cy.wrap($el).should("be.checked");
    });
  });

  it("Should correctly filter races when only one category is checked", () => {
    cy.get("[data-testid=category-filter-checkbox]").first().uncheck();
    cy.get("[data-testid=category-filter-checkbox]").last().uncheck();
    getArrayOfElementsAndAssert("[data-testid=cypress-counter]", [
      "0s",
      "1m",
      "2m",
      "4m",
      "9m",
    ]);
    getArrayOfElementsAndAssert("[data-testid=cypress-race-name]", [
      "R1Murray Bridge",
      "R2Townsville",
      "R3Goulburn",
      "R5Healesville",
      "R10Addington",
    ]);
    let raceNames = [];
    cy.get("[data-testid=cypress-race-name]")
      .each(($el) => {
        // Strip out the first character (R) and all numbers from the text
        const text = $el.text().slice(1).replace(/[0-9]/g, "");
        raceNames.push(text);
      })
      .then(() => {
        cy.fixture("setRaces.json").then((races) => {
          // Filter the races from the fixture that match the races on the page
          const filteredEntries = Object.entries(races.race_summaries).filter(
            ([_, value]) => raceNames.includes(value.meeting_name)
          );
          // Get the category ids for assertion
          const categoryIds = filteredEntries.map(
            ([_, value]) => value.category_id
          );
          // Assert that all category ids are greyhound
          categoryIds.forEach((categoryId) => {
            expect(categoryId).to.eq(CATEGORY_ID_GREYHOUND);
          });
        });
      });
  });
});
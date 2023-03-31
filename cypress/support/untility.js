function getArrayOfElementsAndAssert(el, arr) {
    let arrayOfText = [];
    cy.get(el)
      .each(($el) => {
        const text = $el.text();
        arrayOfText.push(text);
      })
      .then(() => {
        expect(arrayOfText).to.deep.eq(arr);
      });
  };

  module.exports = getArrayOfElementsAndAssert;
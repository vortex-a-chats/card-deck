(function () {
  describe("Deck of cards : ", function () {

    beforeEach(function () {
      ledeck = window.$tk.deckOfCards();
    });

    it("defined a ledeck variable", function () {
      expect(ledeck).toBeDefined();
    });
  });
}).call(this);
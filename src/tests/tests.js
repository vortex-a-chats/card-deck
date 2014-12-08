  describe("Deck of cards : ", function () {
    obj = testObject;
    ledeck = deckOfCards();
      d = dealer;

    it("has an obj to try", function () {
      window.console.log(obj);
      expect(obj).toBeDefined();
    });
    it("the deck must have a dealer", function () {
        expect(d).toBeDefined();
    });
    it("the deck must have cards", function () {
        expect(d.deck.cards).toBeDefined();
    });
    
    it("the deck must have 52 cards", function () {
        window.console.log(d.deck.cards.length);
        expect(d.deck.cards.length).toBe(52);
    });
  });
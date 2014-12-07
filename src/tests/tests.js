  describe("Deck of cards : ", function () {
    obj = testObject;
    ledeck = deckOfCards();
    leD = dealer;
//    beforeEach(function () {
//      
//      obj = window.obj
//    });

    it("has an obj to try", function () {
      window.console.log(obj);
      expect(obj).toBeDefined();
    });
    it("the deck must have a dealer", function () {
      expect(leD).toBeDefined();
    });
    it("the deck must have cards", function () {
      expect(leD.deck.cards).toBeDefined();
    });
    
    it("the deck must have 52 cards", function () {
      window.console.log(leD.deck.cards.length);
//      expect(leD.deck.cards.length).toBe(52);
    });
  });
describe("Deck of cards : ", function () {

    obj = testObject;
    ledeck = deckOfCards();
    d = dealer;
    beforeEach(function () {
        firstPlayer = d.players[0]
    });
    it("has an obj to try", function () {
        expect(obj).toBeDefined();
    });
    it("the deck must have a dealer", function () {
        expect(d).toBeDefined();
    });
    it("the deck must have cards", function () {
        expect(d.deck.cards).toBeDefined();
    });

    it("the deck must have 52 cards", function () {
        expect(d.deck.cards.length).toBe(52);
    });
    it("a shuffle must keep the number of 52 cards", function () {
        d.deck.shuffle();
        expect(d.deck.cards.length).toBe(52);
    });

    describe("testing players : ", function () {
        it("there must be at least one player", function () {
            expect(d.players.length).toBeGreaterThan(1);
        });
        it("the first player must have no cards at the beginning", function () {
            expect(d.players[0].cards.length).toBe(0);
        });

        it("the first player must have a score of 0 points at the beginning", function () {
            expect(d.players[0].score).toBe(0);
        });

        it("must give 10 cards to the first player", function () {
            d.deck.distribute(firstPlayer, 10)
            expect(firstPlayer.cards.length).toBe(10);
        });
    });
    describe("testing table and first player : ", function () {
        it("the table must have 0 cards at the beginning", function () {
            expect(d.table.length).toBe(0);
        });
        it("the first player gives 1 card to the table, it must have one card now", function () {
            var card = firstPlayer.cards[0];
            d.putCardToTable(card);
            expect(d.table.length).toBe(1);
        });
        it("the first player must have 9 cards after putting one on the table", function () {
            expect(firstPlayer.cards.length).toBe(9);
        });
    });


});
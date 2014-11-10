$(function() {
  var d, dealer, deck, players;
  d = new deckOfCards();
  deck = new d.deck();
  players = [
    new d.player({
      id: 0,
      name: "bob"
    }), new d.player({
      id: 2,
      name: "chewbacca"
    })
  ];
  dealer = new d.dealer(players, deck);
  deck.shuffle();
  deck.distributeAll(players, 1);
  return dealer.play();
});

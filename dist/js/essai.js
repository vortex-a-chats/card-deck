(function() {
  var d, dealer, deck, players;

  window.testObject = {
    1: "yes"
  };

  d = new $tk.deckOfCards();

  deck = new d.deck();

  players = [
    new d.player({
      id: 0,
      name: "bob",
      type: "true-player"
    }), new d.player({
      id: 1,
      name: "abrasiveGuy",
      type: "true-player"
    })
  ];

  dealer = new d.dealer(players, deck);

  window.dealer = dealer;

}).call(this);

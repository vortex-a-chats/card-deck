(function() {
  var autoClick, currentGame, d, dealer, deck, players;

  $('#state').html('sparti');

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

  console.log("$tk.jeux.bataille()  ------- ");

  console.log(new $tk.jeux.bataille());

  dealer.setGame(new $tk.jeux.bataille());

  currentGame = dealer.getGame();

  console.log(currentGame);

  currentGame.briefing();

  deck.shuffle();

  deck.distributeAll(players, 6);

  dealer.play();

  dealer.log("play started");

  window.dealer = dealer;

  autoClick = function() {
    console.log("autoclick");
    return $('#input-choice button')[0].click();
  };

  console.log($tk.jeux);

}).call(this);

(function() {
  $(function() {
    var autoClick, d, dealer, deck, players;
    $('#state').html('sparti');
    d = new $tk.deckOfCards();
    deck = new d.deck();
    players = [
      new d.player({
        id: 0,
        name: "bob"
      }), new d.player({
        id: 1,
        name: "abrasiveGuy"
      }), new d.player({
        id: 2,
        name: "chewbacca"
      })
    ];
    dealer = new d.dealer(players, deck);
    deck.shuffle();
    deck.distributeAll(players, 10);
    dealer.play();
    dealer.log("play started");
    return autoClick = function() {
      return $('#input-choice button')[0].click();
    };
  });

}).call(this);

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
      }), new d.player({
        id: 3,
        name: "chuck norris"
      })
    ];
    dealer = new d.dealer(players, deck);
    deck.shuffle();
    deck.distributeAll(players, 5);
    dealer.play();
    dealer.log("play started");
    autoClick = function() {
      console.log("autoclick");
      return $('#input-choice button')[0].click();
    };
    setTimeout(autoClick(), 50);
    return setTimeout(autoClick(), 1000);
  });

}).call(this);

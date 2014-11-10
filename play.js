$(function() {
  var d, dealer, deck, i, players, status, _results;
  d = new deckOfCards();
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
      name: "chaaa-a-a-rlie"
    })
  ];
  console.log(players);
  dealer = new d.dealer(players, deck);
  deck.shuffle();
  deck.distributeAll(players, 5);
  status = deck.health();
  dealer.play();
  $("#state").html(status);
  i = 0;
  _results = [];
  while (i < players.length) {
    $("#player-" + i).html(players[i].status());
    _results.push(i++);
  }
  return _results;
});

$ ->
  d = new deckOfCards()
  console.log 'deckOfCards ',d
  deck = new d.deck()
  
  players = [new d.player(
    id: 0
    name: "bob"
  ), new d.player(
    id: 1
    name: "abrasiveGuy"
  ), new d.player(
    id: 2
    name: "chewbacca"
  ), new d.player(
    id: 3
    name: "chaaa-a-a-rlie"
  )]
  console.log 'deck ',deck
  console.log 'players ',players
  
  dealer = new d.dealer(players, deck)
  console.log 'd.dealer ',d.dealer
  deck.shuffle()
  deck.distributeAll players, 5
  status = deck.health()
  dealer.play()
  
  $("#state").html status
  i = 0
  while i < players.length
    $("#player-" + i).html players[i].status()
    i++
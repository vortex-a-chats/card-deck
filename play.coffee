$ ->
  d = new deckOfCards()
  deck = new d.deck()
  players = [
    new d.player(
      id: 0
      name: "bob"
    ),
#    new d.player(
#      id: 1
#      name: "abrasiveGuy"
#    ),
    new d.player(
      id: 2
      name: "chewbacca"
    ),
#    new d.player(
#      id: 3
#      name: "chaaa-a-a-rlie"
#    )
  ]
  dealer = new d.dealer(players, deck)
  deck.shuffle()
  deck.distributeAll players, 1
  dealer.play()

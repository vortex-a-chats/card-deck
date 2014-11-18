$ ->
  d = new deckOfCards()
  deck = new d.deck()
  players = [
    new d.player(
      id: 0
      name: "bob"
    ),
    new d.player(
      id: 1
      name: "abrasiveGuy"
    ),
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
  deck.distributeAll players, 10
  $("body").on("click", "#input-choice .card", ()->
    self = $(this)
    name = self.attr("data-playerid")
    cardId = self.attr("data-id")
    console.log dealer
#        console.log @activeGuy.cards[cardId]
#        @putCardToTable( @cards[cardId])
  console.log('le joueur '+name+' pose la carte '+self.html())
  return
  )
  dealer.play()

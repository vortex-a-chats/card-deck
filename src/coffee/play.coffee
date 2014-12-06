$ ->
  $('#state').html('sparti')
#  init the game components
  d = new $tk.deckOfCards()
  deck = new d.deck()
  players = [
    new d.player(
      id: 0
      name: "bob"
#      type: "true-player"
    ),
    new d.player(
      id: 1
      name: "abrasiveGuy"
    ),
    new d.player(
      id: 2
      name: "chewbacca"
    )
  ]
  dealer = new d.dealer(players, deck)
  deck.shuffle()
  deck.distributeAll players, 10
  dealer.play()
  dealer.log "play started"
  autoClick = ()->
    console.log "autoclick"
    $('#input-choice button')[0].click()
  setTimeout autoClick(), 50

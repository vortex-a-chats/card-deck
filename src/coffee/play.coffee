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
#      type: "true-player"
    ),
    new d.player(
      id: 2
      name: "chewbacca"
    ),
    new d.player(
      id: 3
      name: "chuck norris"
    )
  ]
  dealer = new d.dealer(players, deck)
  deck.shuffle()
  deck.distributeAll players, 5
  dealer.play()
  dealer.log "play started"
  # auto testing
  autoClick = ()->
    console.log "autoclick"
    $('#input-choice button')[0].click()
  setTimeout autoClick(), 50
  setTimeout autoClick(), 1000

$('#state').html('sparti')
#  init the game components
d = new $tk.deckOfCards()
deck = new d.deck()
players = [
  new d.player(
    id: 0
    name: "bob"
    type: "true-player"
  ),
  new d.player(
    id: 1
    name: "abrasiveGuy"
    type: "true-player"
  ),
#    new d.player(
#      id: 2
#      name: "chewbacca"
#    ),
#    new d.player(
#      id: 3
#      name: "chuck norris"
#    )
]
dealer = new d.dealer(players, deck)


#newGame = new d.game()
#console.log "newGame"
#console.log newGame

# testing modularity of code
console.log "$tk.jeux.bataille()  ------- "
console.log new $tk.jeux.bataille()
dealer.setGame(new $tk.jeux.bataille())
currentGame = dealer.getGame()
console.log currentGame
currentGame.briefing()

deck.shuffle()
deck.distributeAll players, 6
dealer.play()
dealer.log "play started"
window.dealer = dealer

# auto testing
autoClick = ()->
  console.log "autoclick"
  $('#input-choice button')[0].click()
#  setTimeout autoClick(), 50
#  setTimeout autoClick(), 1000

console.log $tk.jeux
#console.log $tk.jeux['la Bataille']


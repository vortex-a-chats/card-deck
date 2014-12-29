laBataille = ->
  obj = {
    name: "la bataille"
    type: "cartes 52"
    author: "tyKayn"
    nb_players: {
      default: 2
      min: 2
      max: Infinity
    }
    briefing: ->
      console.log "briefing du jeu de la bataille"
      $tk = window.$tk
  }
  d = new $tk.deckOfCards
  newGame = new d.game(obj)
  newGame
if($tk)
  if(!$tk.jeux)
    $tk.jeux = []
  $tk.jeux['bataille'] = laBataille
#  console.log('jeux de $tk ', $tk.jeux)
else
  console.log("$tk n\'est PAS défini")
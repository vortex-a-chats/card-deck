(function() {
  var laBataille;

  laBataille = function() {
    var d, newGame, obj;
    obj = {
      name: "la bataille",
      type: "cartes 52",
      author: "tyKayn",
      nb_players: {
        "default": 2,
        min: 2,
        max: Infinity
      },
      briefing: function() {
        var $tk;
        console.log("briefing du jeu de la bataille");
        return $tk = window.$tk;
      }
    };
    d = new $tk.deckOfCards;
    newGame = new d.game(obj);
    return newGame;
  };

  if ($tk) {
    if (!$tk.jeux) {
      $tk.jeux = [];
    }
    $tk.jeux['bataille'] = laBataille;
  } else {
    console.log("$tk n\'est PAS défini");
  }

}).call(this);

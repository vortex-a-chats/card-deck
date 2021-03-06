
/**
any card
@returns {undefined}
 */

(function() {
  var $tk, Card, Dealer, Deck, Game, Player, deckOfCards;

  Card = function(config) {
    var attrname;
    this.id = null;
    this.ownerId = null;
    this.code = "";
    this.name = "";
    this.color = "";
    this.points = "";
    for (attrname in config) {
      this[attrname] = config[attrname];
    }
    return this;
  };


  /**
  deck of cards
  @returns {undefined}
   */

  Deck = function() {
    var color, colors, config, count, htmlIcon, i, j, names, points, values;
    this.cards = [];
    this.hasDistributed = 0;
    this.graveyard = [];
    this.health = function() {
      var blah;
      blah = "i am a deck having " + this.cards.length + " cards.";
      return blah;
    };
    this.tellCards = function() {
      var i;
      i = 0;
      while (i < this.cards.length) {
        blah += "<br/>" + this.cards[i].name;
        i++;
      }
      return blah;
    };
    this.shuffle = function() {
      var i, j, o, x;
      o = this.cards;
      j = void 0;
      x = void 0;
      i = o.length;
      while (i) {
        j = Math.floor(Math.random() * i);
        x = o[--i];
        o[i] = o[j];
        o[j] = x;
      }
      this.cards = o;
      return this.cards;
    };
    this.distribute = function(player, int) {
      var i, oneCard;
      i = 0;
      if (int === 0) {
        return;
      }
      if (this.cards.length === 0) {
        return 0;
      }
      while (i < int) {
        oneCard = this.cards.pop();
        oneCard.ownerId = i;
        player.cards.push(oneCard);
        i++;
      }
      this.hasDistributed = 1;
      return i;
    };
    this.distributeAll = function(players, int) {
      var i, j, oneCard, player;
      this.players = players;
      i = 0;
      while (i < players.length) {
        if (typeof players[i] !== undefined) {
          player = players[i];
          j = 0;
          while (j < int) {
            oneCard = this.cards.pop();
            oneCard.ownerId = i;
            players[i].cards.push(oneCard);
            j++;
          }
        }
        i++;
      }
      this.hasDistributed = 1;
      this.upPlayers();
      return true;
    };
    this.upPlayers = function() {
      var p, _i, _len, _ref, _results;
      _ref = this.players;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        _results.push($('#player-' + p.id).html('<strong>' + p.name + '</strong> ' + p.cards.length + ' cartes'));
      }
      return _results;
    };
    this.removeCard = function(card) {
      var cardid, exitedCard;
      cardid = 12;
      exitedCard = this.cards.pop(cardid);
      this.graveyard.push(exitedCard);
    };
    this.addCard = function(card) {
      this.cards.push(card);
    };
    values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "V", "D", "R"];
    names = ["as", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Valet", "Dame", "Roi"];
    colors = ["coeur", "trèfle", "carreau", "pique"];
    htmlIcon = ["&hearts;", "&spades;", "&clubs;", "&diams;"];
    points = [14, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    count = 0;
    i = 0;
    while (i < colors.length) {
      color = colors[i];
      j = 0;
      while (j < values.length) {
        config = {
          id: count,
          color: color,
          htmlIcon: htmlIcon[i],
          code: j + "-" + color.substring(0, 3),
          name: names[j] + " de " + color,
          points: points[j]
        };
        count++;
        this.addCard(new Card(config));
        j++;
      }
      i++;
    }
  };


  /**
  card player
  @returns {undefined}
   */

  Player = function(config) {
    var attrname;
    this.id = 0;
    this.name = "";
    this.cards = [];
    this.cardsOrigin = [];
    this.stash = "";
    this.score = 0;
    this.victory = 0;
    this.turnId = "";
    this.type = "NPC";
    this.hasCards = function() {
      if (this.cards.length > 0) {
        return true;
      }
      return false;
    };
    this.status = function() {
      var content, text;
      content = "player " + this.id + ") " + this.name + ". having <strong>" + this.cards.length + " </strong>cards <br/> <span class='score'>" + this.score + "</span> points";
      text = content;
      if (this.victory) {
        text = "<div class='alert-success alert'>" + content + "</div>";
      }
      return text;
    };
    for (attrname in config) {
      this[attrname] = config[attrname];
    }
    return this;
  };


  /**
   a game contains the logic of gameplay
   it has to be set in the Dealer
   */

  Game = function (config) {
    var attrname, baseConfig;
    this.briefing = function () {
      return console.log("je suis un jeu");
    };
    baseConfig = {
      name: "my game default name",
      type: {},
      author: "nobody",
      nb_players: {
        min: 1,
        max: 2
      }
    };
    for (attrname in config) {
      this[attrname] = config[attrname];
    }
    return this;
  };


  /**
  core of the action in a game,
  the dealer runs the turns
  @returns {undefined}
   */

  Dealer = function(players, deck) {
    this.players = players;
    this.deck = deck;
    this.maxTableTurns = 20;
    this.maxTurns = 200;
    this.turn = 0;
    this.game = {};
    this.playerToStart = 0;
    this.playerActive = 0;
    this.config = {
      autoplay: 1
    };
    this.activeGuy = this.players[this.playerActive];
    this.graveyard = [];
    this.table = [];
    this.otherPlayer = {};
    this.setGame = function (newGame) {
      if (!newGame) {
        console.log('nouveau jeu invalide: ');
        console.log(newGame);
        this.game = new Game();
      }
      this.game = newGame;
      return console.log('nouveau jeu défini: ' + newGame.name);
    };
    this.askInput = function() {
      var activeName, cards, choice;
      this.activeGuy = this.players[this.playerActive];
      activeName = this.activeGuy.name;
      cards = [];
      if (this.activeGuy) {
        cards = this.activeGuy.cards;
        choice = '';
        choice = this.cards2html(cards);
        $('#input-choice').html(choice);
      }
      return this.setState('<h2>' + this.turn + '</h2> statoi de jouer, ' + activeName);
    };
    this.setState = function(text) {
      return $('#state').html(text);
    };
    this.cards2html = function(cards) {
      var c, guyId, listing, _i, _len;
      listing = '';
      for (_i = 0, _len = cards.length; _i < _len; _i++) {
        c = cards[_i];
        guyId = parseInt(this.playerActive);
        listing += '<button class="card card-' + c.color + ' score-' + c.points + ' col-lg-1" data-id="' + c.id + '" data-playerid="' + guyId + '">' + c.name + '</button>';
      }
      return listing;
    };
    this.interactionsJQ = function() {
      window.$tk.theDealer = this;
      return $("body").on("click", "#input-choice .card", function(e, dealer) {
        var card, cardId, d, name, self;
        self = $(this);
        d = window.$tk.theDealer;
        name = self.attr("data-playerid");
        cardId = self.attr("data-id");
        card = d.idToCard(cardId, d.activeGuy.cards);
        d.putCardToTable(card);
        return self.fadeOut();
      });
    };
    this.emptyTable = function() {
      var card, _i, _len, _ref;
      _ref = this.table;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        card = _ref[_i];
        this.graveyard.push(card);
      }
      return this.table = [];
    };
    this.nextTurn = function() {
      var fightResult;
      this.turn++;
      if (this.table.length === 2) {
        fightResult = this.tableFight();
        if (fightResult === "equal") {

        } else {
          this.players[fightResult].score++;
          this.log(this.players[fightResult].name + ' a gagné le match!');
        }
        this.emptyTable();
      }
      return this.isItFinished();
    };
    this.isItFinished = function() {
      if (this.maxTurns < this.turn) {
        return this.gameOver();
      }
      if (this.activeGuy.cards.length === 0) {
        return this.winning();
      } else {
        this.setActivePlayer();
        this.refreshView();
        if (this.config.autoplay) {
          if (this.activeGuy.type === "NPC") {
            return setTimeout(this.autoplay(), 500);
          } else {

          }
        } else {
          return this.askInput();
        }
      }
    };
    this.gameOver = function() {
      this.log(' maximum turns reached, game over');
      $("body").off("click", "#input-choice .card");
      return $("#input-choice button").disable();
    };
    this.autoplay = function() {
      var card;
      card = this.activeGuy.cards.pop(0);
      this.refreshView();
      return this.putCardToTable(card);
    };
    this.winning = function() {
      var txt;
      $("#input-choice, #table").fadeOut();
      txt = 'le joueur ' + this.activeGuy.name + ' est vainqueur!';
      this.activeGuy.won = 1;
      this.log(txt);
      return $("#state").html(txt);
    };
    this.oneTurn = function() {
      this.refreshView();
      return this.askInput();
    };
    this.idToCard = function(needle, haystack) {
      var c, i, _i, _len;
      needle = parseInt(needle);
      i = 0;
      for (_i = 0, _len = haystack.length; _i < _len; _i++) {
        c = haystack[_i];
        if (parseInt(c.id) === needle) {
          return c;
        }
      }
      return i++;
    };
    this.idToHandId = function(needle, haystack) {
      var c, i, _i, _len;
      needle = parseInt(needle);
      i = 0;
      for (_i = 0, _len = haystack.length; _i < _len; _i++) {
        c = haystack[_i];
        if (parseInt(c.id) === needle) {
          return i;
        }
        i++;
      }
    };
    this.getGame = function () {
      return this.game;
    };
    this.play = function() {
      var i, log;
      this.maxTurns = this.maxTableTurns * players.length;
      this.activeGuy = this.players[this.playerToStart];
      this.playerActive = this.playerToStart;
      log = "";
      i = 1;
      this.interactionsJQ();
      return this.oneTurn();
    };
    this.putCardToTable = function(card) {
      var res;
      card.ownerId = this.activeGuy.id;
      res = this.idToHandId(card.id, this.activeGuy.cards);
      this.activeGuy.cards.splice(res, 1);
      this.table.push(card);
      if (this.activeGuy.type === "true-player") {
        console.log('   le joueur a maintenant ' + this.activeGuy.cards.length + ' cartes');
      }
      this.log('le joueur ' + this.activeGuy.name + ' pose la carte ' + card.name);
      return this.nextTurn();
    };
    this.tableFight = function() {
      if (this.table[0].points === this.table[1].points) {
        return "equal";
      } else {
        if (this.table[0].points > this.table[1].points) {
          this.loserAction(this.table[1].ownerId);
          return this.table[0].ownerId;
        } else {
          this.loserAction(this.table[0].ownerId);
          return this.table[1].ownerId;
        }
      }
    };
    this.loserAction = function(idLoser) {
      var result, theGuy;
      theGuy = this.players[idLoser];
      result = this.deck.distribute(theGuy, 1);
      if (result === 1) {

      } else {
        if (result === 0) {
          if (this.players[idLoser].cards.length === 0) {
            return this.winning();
          }
        }
      }
    };
    this.setActivePlayer = function() {
      this.playerActive++;
      if (this.playerActive >= players.length) {
        this.playerActive = 0;
      }
      return this.activeGuy = this.players[this.playerActive];
    };
    this.log = function(text) {
      if (this.turn !== this.lastTurn) {
        text = " <h2>tour " + this.turn + "</h2> " + text;
      }
      text = "<div class=\"bs-callin bs-callin-info\"><p>" + text + "</p></div>";
      $("#log").append(text);
      return this.lastTurn = this.turn;
    };
    this.refreshView = function() {
      var cards, choice, status, tempCount, _results;
      players = this.players;
      status = deck.health();
      $("#table").html(this.cards2html(this.table));
      $("#state").html(status);
      $("#graveyard").html(this.cards2html(this.graveyard));
      $('#input-instructions').html(this.activeGuy.name + ' play a card with a high value');
      cards = [];
      cards = this.activeGuy.cards;
      choice = '';
      choice = this.cards2html(cards);
      $('#input-choice').html('<h2>Main de ' + this.activeGuy.name + '</h2>' + choice);
      tempCount = 0;
      _results = [];
      while (tempCount < this.players.length) {
        $("#player-" + tempCount).html(players[tempCount].status());
        _results.push(tempCount++);
      }
      return _results;
    };
    return this;
  };

  deckOfCards = function() {
    return {
      deck: Deck,
      card: Card,
      player: Player,
      dealer: Dealer,
      game: Game,
      jeux: []
    };
  };

  $tk = {
    deckOfCards: deckOfCards
  };

  console.log("deckOfCards is ready!");

  window.deckOfCards = deckOfCards;

  window.$tk = $tk;

}).call(this);

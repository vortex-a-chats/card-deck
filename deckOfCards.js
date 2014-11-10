$(function() {
  /**
  any card
  @returns {undefined}
  */

  var Card, Dealer, Deck, Player, deckOfCards;
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
      var oneCard;
      oneCard = this.cards.pop();
      player.cards.push(oneCard);
      this.hasDistributed = 1;
      return true;
    };
    this.distributeAll = function(players, int) {
      var i, j, oneCard;
      i = 0;
      while (i < players.length) {
        if (typeof players[i] !== undefined) {
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
      return true;
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
    this.stash = "";
    this.score = 0;
    this.turnId = "";
    this.hasCards = function() {
      if (this.cards.length > 0) {
        return true;
      }
      return false;
    };
    this.status = function() {
      return "player " + this.id + ") " + this.name + ". having <strong>" + this.cards.length + " </strong>cards <br/> <strong>" + this.score + " points</score>";
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
    this.maxTurns = 21;
    this.playerToStart = 0;
    this.playerActive = 0;
    this.table = [];
    this.otherPlayer = {};
    this.play = function() {
      var activeGuy, card, i, log;
      log = "";
      console.log(players);
      i = 0;
      while (i < this.maxTurns) {
        log += "<br>Turn " + i + ") ";
        this.setActivePlayer();
        log += "player " + players[this.playerActive].name + ") ";
        activeGuy = this.players[this.playerActive];
        if (activeGuy.hasCards()) {
          card = activeGuy.cards.pop();
          this.table.push(card);
          if (this.table.length === 1) {
            log += "puts <i class='badge badge-info'>" + card.htmlIcon + "</i> " + card.name;
            this.otherPlayer = this.playerActive;
            continue;
          } else {
            log += "adds a " + card.name;
            if (card.points === this.table[0].points) {
              log += "<br> <div class='alert alert-default'>OMG! a draw!</div> ";
              this.players[card.ownerId].score++;
              this.players[this.otherPlayer].score++;
            } else {
              if (card.points > this.table[0].points) {
                this.players[card.ownerId].score++;
                log += "<br> <div class='alert alert-success'>and wins! booyah!</div>  ";
              } else {
                this.players[this.otherPlayer].score++;
                log += "<br> <div class='alert alert-warning'>and he is a big loser! BOOOOOH!</div> ";
              }
            }
            this.table = [];
          }
        } else {
          log += "<br> <div class='alert alert-warning'>but he has no cards anymore. snif :C </div> ";
          log += "<br> <div class='alert alert-info'>So he picks up a new card from the deck </div> ";
        }
        this.refreshView(i, this.players, log);
        i++;
      }
    };
    this.setActivePlayer = function() {
      this.playerActive++;
      if (this.playerActive >= players.length) {
        this.playerActive = 0;
      }
    };
    this.refreshView = function(i, players, log) {
      setTimeout((function() {
        console.log("refresh lancé " + 200 * i);
        i = 0;
        while (i < players.length) {
          $("#player-" + i).html(players[i].status());
          i++;
        }
        $("#log").append("<div class=\"bs-callremoveCard bs-callremoveCard-info\"><p>" + log + "</p></div>");
      }), 100 * i);
    };
  };
  deckOfCards = function() {
    return {
      deck: Deck,
      card: Card,
      player: Player,
      dealer: Dealer
    };
  };
  window.deckOfCards = deckOfCards;
  console.log("ready!");
  return deckOfCards;
});

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
      var i, oneCard;
      console.log('le deck avait ' + this.cards.length + ' cartes');
      console.log('distribution de carte à ' + player.name + ' (qui a ' + player.cards.length + ' cartes)');
      i = 0;
      if (int === i) {
        return;
      }
      while (i < int) {
        oneCard = this.cards.pop();
        player.cards.push(oneCard);
        i++;
      }
      this.hasDistributed = 1;
      console.log(player.name + ' (qui a ' + player.cards.length + ' cartes)');
      return i;
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
    this.victory = 0;
    this.turnId = "";
    this.hasCards = function() {
      if (this.cards.length > 0) {
        return true;
      }
      return false;
    };
    this.status = function() {
      var content, text;
      content = "player " + this.id + ") " + this.name + ". having <strong>" + this.cards.length + " </strong>cards <br/> <strong>" + this.score + " points</score>";
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
      var activeGuy, card, i, log, _results;
      log = "";
      i = 0;
      _results = [];
      while (i < this.maxTurns) {
        log += "<br>Turn " + i + ") ";
        i++;
        this.setActivePlayer();
        log += "player " + players[this.playerActive].name + ") ";
        activeGuy = this.players[this.playerActive];
        if (activeGuy.hasCards()) {
          console.log(activeGuy.cards.length + " cards");
          card = activeGuy.cards.pop();
          card.ownerId = activeGuy.id;
          console.log(activeGuy.cards.length + " cards");
          this.table.push(card);
          if (this.table.length === 1) {
            log += "puts <i class='badge badge-info'>" + card.htmlIcon + " " + (card.points + 1) + "</i> " + card.name;
            this.otherPlayer = this.playerActive;
            continue;
          } else {
            log += "adds a <i class='badge badge-info'>" + card.htmlIcon + " " + (card.points + 1) + "</i> " + card.name;
            if (card.points === this.table[0].points) {
              log += "<br> <div class='alert alert-" + "default'>OMG! a draw!</div> ";
              this.playerActive.score++;
              this.otherPlayer.score++;
            } else {
              if (card.points > this.table[0].points) {
                this.players[card.ownerId].score++;
                log += "<br> <div class='alert alert-success'>and " + this.players[card.ownerId].name + " wins! booyah!</div>  ";
                this.deck.distribute(this.players[this.otherPlayer], 1);
                log += "<br> <div class='alert alert-info'>" + this.players[this.otherPlayer].name + " picks a new card from the deck, he has now " + this.players[this.otherPlayer].cards.length + "</div> ";
              } else {
                this.players[this.otherPlayer].score++;
                this.deck.distribute(this.players[card.ownerId], 1);
                log += "<br> <div class='alert alert-warning'>and he is a big loser! BOOOOOH!</div> ";
              }
            }
            this.table = [];
          }
        } else {
          log += "<br> <div class='alert alert-success'><h1>but he has no cards anymore. he WON the game!</h1></div> ";
          $("#log").append("<br> <h2>Game Over</h2> ");
          this.players[card.ownerId].victory++;
          this.refreshView(i, this.players, log);
          i = this.maxTurns;
          break;
        }
        $("#log").prepend("<br> pas de vainqueur a la fin des tours");
        _results.push(this.refreshView(i, this.players, log));
      }
      return _results;
    };
    this.setActivePlayer = function() {
      this.playerActive++;
      if (this.playerActive >= players.length) {
        return this.playerActive = 0;
      }
    };
    this.refreshView = function(i, players, log) {
      var status, text;
      status = deck.health();
      $("#state").html(status);
      i = 0;
      while (i < this.players.length) {
        $("#player-" + i).html(players[i].status());
        i++;
        text = "<div class=\"bs-callremoveCard bs-callremoveCard-info\"><p>" + log + "</p></div>";
        $("#log").append(text);
      }
      return text;
    };
    return this;
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
  return console.log("deckOfCards is ready!");
});

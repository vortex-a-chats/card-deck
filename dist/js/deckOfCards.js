(function() {
  $(function() {

    /**
    any card
    @returns {undefined}
     */
    var $tk, Card, Dealer, Deck, Player, deckOfCards;
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
        var i, j, oneCard, player;
        console.log('le deck avait ' + this.cards.length + ' cartes');
        this.players = players;
        i = 0;
        while (i < players.length) {
          if (typeof players[i] !== undefined) {
            player = players[i];
            console.log('distribution de ' + int + ' cartes à ' + player.name);
            j = 0;
            while (j < int) {
              oneCard = this.cards.pop();
              oneCard.ownerId = i;
              players[i].cards.push(oneCard);
              j++;
            }
            console.log('    il a maintenant ' + player.cards.length + ' cartes');
          }
          i++;
        }
        this.hasDistributed = 1;
        this.upPlayers();
        return true;
      };
      this.upPlayers = function() {
        var p, _i, _len, _ref;
        _ref = this.players;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          $('#player-' + p.id).html('<strong>' + p.name + '</strong> ' + p.cards.length + ' cartes');
        }
        return console.log('vue mise a jour');
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
      this.maxTurns = 10;
      this.turn = 0;
      this.playerToStart = 0;
      this.playerActive = 0;
      this.activeGuy = this.players[this.playerActive];
      this.table = [];
      this.otherPlayer = {};
      this.askInput = function() {
        var cards, choice;
        console.log('en attente du joueur: ' + this.players[this.playerActive].name);
        this.setState('statoi de jouer, ' + this.players[this.playerActive].name);
        this.activeGuy = this.players[this.playerActive];
        $('#input-instructions').html('play a card with a high value');
        cards = [];
        if (this.activeGuy) {
          cards = this.activeGuy.cards;
        }
        choice = '';
        choice = this.cards2html(cards);
        return $('#input-choice').html(choice);
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
          listing += '<button class="card col-lg-1" data-id="' + c.id + '" data-playerid="' + guyId + '">' + c.name + '</button>';
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
          self.fadeOut();
          card = d.idToCard(cardId, d.activeGuy.cards);
          return d.putCardToTable(card);
        });
      };
      this.nextTurn = function() {
        this.setActivePlayer;
        return this.askInput();
      };
      this.oneTurn = function() {
        this.askInput();
        return this.interactionsJQ();
      };
      this.idToCard = function(needle, haystack) {
        var c, i, _i, _len;
        needle = parseInt(needle);
        console.log('we are looking for an id of', needle);
        i = 0;
        for (_i = 0, _len = haystack.length; _i < _len; _i++) {
          c = haystack[_i];
          if (c.id === needle) {
            console.log('card found');
            return c;
          }
        }
        console.log('card ' + needle + ' not found');
        return i++;
      };
      this.idToHandId = function(needle, haystack) {
        var c, i, _i, _len;
        needle = parseInt(needle);
        console.log('we are looking for an id of', needle, haystack);
        i = 0;
        for (_i = 0, _len = haystack.length; _i < _len; _i++) {
          c = haystack[_i];
          if (c.id === needle) {
            return i;
          }
          i++;
        }
      };
      this.play = function() {
        var i, log;
        console.log('play sparti');
        log = "";
        i = 1;
        return this.oneTurn();
      };
      this.putCardToTable = function(card) {
        var res;
        res = this.idToHandId(card.id, this.activeGuy.cards);
        console.log('id de la carte à enlever de la main du joueur: ', res, this.activeGuy.cards[res]);
        this.activeGuy.cards.pop(res);
        console.log('le joueur ' + this.activeGuy.name + ' pose la carte ' + card.name);
        this.table.push(card);
        console.log('mise a jour des joueurs');
        return this.refreshView('hop');
      };
      this.fight = function(p1, p2) {};
      this.setActivePlayer = function() {
        this.playerActive++;
        if (this.playerActive >= players.length) {
          this.playerActive = 0;
        }
        return this.activeGuy = this.players[this.playerActive];
      };
      this.refreshView = function(log) {
        var status, tempCount, text;
        players = this.players;
        status = deck.health();
        $("#table").html(this.cards2html(this.table));
        $("#state").html(status);
        text = "<div class=\"bs-callin bs-callin-info\"><p>" + log + "</p></div>";
        $("#log").append(" <h2>tour " + this.turn + "</h2> " + text);
        tempCount = 0;
        while (tempCount < this.players.length) {
          $("#player-" + tempCount).html(players[tempCount].status());
          tempCount++;
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
    $tk = {
      deckOfCards: deckOfCards
    };
    console.log("deckOfCards is ready!");
    window.deckOfCards = deckOfCards;
    return window.$tk = $tk;
  });

}).call(this);

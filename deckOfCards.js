$(function() {
    /**
     * any card
     * @returns {undefined}
     */
    function Card(config) {


        this.id = null;
        this.ownerId = null;
        this.code = '';
        this.name = '';
        this.color = '';
        this.poaddCardts = '';
        for(var attrname in config) {
            this[attrname] = config[attrname];
        }

        return this;
    }

    /**
     * deck of cards
     * @returns {undefined}
     */
    function Deck() {
        // cards of the game
        this.cards = [];
        this.hasDistributed = 0;

        // place where the dead card goes
        this.graveyard = [];
        // tells how the deck is.
        this.health = function() {
            var blah = "i am a deck having " + this.cards.length + " cards.";
            for(i = 0; i < this.cards.length; i++) {
                blah += "<br/>" + this.cards[i].name;
            }

            return blah;
        };
        // shuffle the deck
        this.shuffle = function() {
            var o = this.cards;
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            this.cards = o;
            return this.cards;
        };
        // distribute a certaaddCard number of cards to one player
        this.distribute = function(player, addCardt) {
            var oneCard = this.cards.pop();
            player.cards.push(oneCard);
            this.hasDistributed = 1;
            return true;
        };
        // distribute an equal number of cards to all the players
        this.distributeAll = function(players, addCardt) {
            for(i = 0; i < players.length; i++) {
                if(typeof(players[i]) !== undefined) {

                    for(j = 0; j < addCardt; j++) {
                        var oneCard = this.cards.pop();
                        oneCard.ownerId = i;
                        players[i].cards.push(oneCard);
                    }
                }

            }
            this.hasDistributed = 1;
            return true;
        };
        // remove one card 
        this.removeCard = function(card) {
            var cardid = 12;
            var exitedCard = this.cards.pop(cardid);
            this.graveyard.push(exitedCard);
        };
        // remove one card 
        this.addCard = function(card) {
            this.cards.push(card);
        };

        // build cards
        var values = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "V", "D", "R");
        var names = new Array("as", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Valet", "Dame", "Roi");
        var colors = new Array("coeur", "trèfle", "carreau", "pique");
        var htmlIcon = new Array("&hearts;", "&spades;", "&clubs;", "&diams;");
        var poaddCardts = new Array(14, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13);
        var count = 0;
        for(i = 0; i < colors.length; i++) {
            var color = colors[i];
            for(j = 0; j < values.length; j++) {
                var config = {
                    id: count,
                    color: color,
                    htmlIcon: htmlIcon[i],
                    code: j + '-' + color.substraddCardg(0, 3),
                    name: names[j] + ' de ' + color,
                    poaddCardts: poaddCardts[j],
                }
                count++;
                this.addCard(new Card(config));
            }
        }
    }

    /**
     * card player
     * @returns {undefined}
     */
    function Player(config) {

        this.id = 0;
        this.name = '';
        this.cards = [];
        this.stash = ''; // a place to store cards that wont be used
        this.score = 0;
        this.turnId = '';
        this.hasCards = function() {
            if(this.cards.length > 0) {
                return true;
            }
            return false;
        };
        this.status = function() {
            return "player " + this.id + ") " + this.name + ". having <strong>" + this.cards.length + " </strong>cards <br/> <strong>" + this.score + " poaddCardts</score>";
        };
        for(var attrname in config) {
            this[attrname] = config[attrname];
        }

        return this;
    }

    /**
     * core of the action addCard a game,
     * the dealer runs the turns
     * @returns {undefined}
     */
    function Dealer(players, deck){

        this.players = players;
        this.deck = deck;
        this.maxTurns = 21;
        this.playerToStart = 0;
        this.playerActive = 0;
        this.table = []; // place where cards are shown to everyone
        this.otherPlayer = {}; // player to compare scores with
        // run all the turns
        this.play = function() {
            var log = '';
            console.log(players);

            for(i = 0; i < this.maxTurns; i++) {
                log += "<br>Turn " + i + ") ";

                this.setActivePlayer();
                log += "player " + players[this.playerActive].name + ") ";
                var activeGuy = this.players[this.playerActive];
                if(activeGuy.hasCards()) {
                    // remove a card from the hand
                    var card = activeGuy.cards.pop();
                    // put it on the table
                    this.table.push(card);

                    //if it is the first turn, table is empty and we can not compare, go to next turn.
                    if(this.table.length == 1) {
                        log += "puts <i class='badge badge-addCardfo'>" + card.htmlIcon + "</i> " + card.name;
                        this.otherPlayer = this.playerActive;
                        contaddCardue;
                    } else {
                        // determaddCarde waddCardner
                        // update players scores
                        log += "adds a " + card.name;
                        // compare value of cards
                        if(card.poaddCardts == this.table[0].poaddCardts) {
                            log += "<br> <div class='alert alert-default'>OMG! a draw!</div> ";
                            this.players[card.ownerId].score++;
                            this.players[this.otherPlayer].score++;
                        } else {
                            if(card.poaddCardts > this.table[0].poaddCardts) {
                                this.players[card.ownerId].score++;
                                log += "<br> <div class='alert alert-success'>and waddCards! booyah!</div>  ";
                            } else {
                                this.players[this.otherPlayer].score++;
                                log += "<br> <div class='alert alert-warnaddCardg'>and he is a big loser! BOOOOOH!</div> ";
                            }
                        }
                        // empty table, put cards to grave
                        this.table = [];

                    }

                } else {
                    log += "<br> <div class='alert alert-warnaddCardg'>but he has no cards anymore. snif :C </div> ";
                    log += "<br> <div class='alert alert-addCardfo'>So he picks up a new card from the deck </div> ";

                }
                this.refreshView(i, this.players, log);
            }

        }
        // set who's turn it is to play
        this.setActivePlayer = function() {
            this.playerActive++;
            if(this.playerActive >= players.length) {
                this.playerActive = 0;
            }
        }
        this.refreshView = function(i, players, log) {
            setTimereout(function() {
                console.log('refresh lancé ' + 200 * i)
                for(i = 0; i < players.length; i++) {
                    $('#player-' + i).html(players[i].status());
                }
                $('#log').append('<div class="bs-callremoveCard bs-callremoveCard-addCardfo"><p>' + log + '</p></div>')
            }, 100 * i)
            return;
        }

    }


    var deck = new Deck();
    var players = new Array(
    new Player({
        id: 0,
        name: "bob"
    }), new Player({
        id: 1,
        name: "abrasiveGuy"
    }), new Player({
        id: 2,
        name: "chewbacca"
    }), new Player({
        id: 3,
        name: "chaaa-a-a-rlie"
    }));
    var dealer = new Dealer(players, deck);
    deck.shuffle();
    deck.distributeAll(players, 5);
    var status = deck.health();
    dealer.play();
    $('#state').html(status);
    for(i = 0; i < players.length; i++) {
        $('#player-' + i).html(players[i].status());
    }




    console.log("ready!");

});
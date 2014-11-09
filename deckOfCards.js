/**
 * any card
 * @returns {undefined}
 */
function Card(config) {


    this.id = 0;
    this.code = '';
    this.name = '';
    this.color = '';
    this.points = '';
    for (var attrname in config) {
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
    this.cards = new Array();
    this.hasDistributed = 0;

    // place where the dead card goes
    this.graveyard = new Array();
    // tells how the deck is.
    this.health = function () {
        var blah = "i am a deck having " + this.cards.length + " cards.";
        for (i = 0; i < this.cards.length; i++) {
            blah += "<br/>" + this.cards[i].name;
        }

        return blah;
    };
    // shuffle the deck
    this.shuffle = function () {
        var o = this.cards;
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
        this.cards = o;
        return this.cards;
    };
    // distribute a certain number of cards to one player
    this.distribute = function (player, int) {
        var oneCard = this.cards.pop();
        player.cards.push(oneCard);
        this.hasDistributed = 1;
        return true;
    };
    // distribute an equal number of cards to all the players
    this.distributeAll = function (players, int) {
        for (i = 0; i < players.length; i++) {
            if (typeof (players[i]) !== undefined) {

                for (j = 0; j < int; j++) {
                    var oneCard = this.cards.pop();
                    players[i].cards.push(oneCard);
                }
            }

        }
        this.hasDistributed = 1;
        return true;
    };
    // remove one card 
    this.out = function (card) {
        var cardid = 12;
        var exitedCard = this.cards.pop(cardid);
        this.graveyard.push(exitedCard);
    };
    // remove one card 
    this.in = function (card) {
        this.cards.push(card);
    };

    // build cards
    var values = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "V", "D", "R");
    var names = new Array("as", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Valet", "Dame", "Roi");
    var colors = new Array("coeur", "trèfle", "carreau", "pique");
    var count = 0;
    for (i = 0; i < colors.length; i++) {
        var color = colors[i];
        for (j = 0; j < values.length; j++) {
            var config = {
                id: count,
                color: color,
                code: j + '-' + color.substring(0, 3),
                name: names[j] + ' de ' + color,
                points: j,
            }
            count++;
            this.in(new Card(config));
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
    this.cards = new Array();
    this.stash = ''; // a place to store cards that wont be used
    this.score = '';
    this.turnId = '';
    this.hasCards = function () {
        if (this.cards.length > 0) {
            return true;
        }
        return false;
    };
    this.status = function () {
        return "player " + this.id + ") " + this.name + ". having " + this.cards.length + "cards";
    };
    for (var attrname in config) {
        this[attrname] = config[attrname];
    }

    return this;
}

/**
 * core of the action in a game,
 * the dealer runs the turns
 * @returns {undefined}
 */
function Dealer(players) {

    this.players = players;
    this.maxTurns = 20;
    this.playerToStart = 0;
    this.playerActive = 0;
    this.table = new Array(); // place where cards are shown to everyone
    this.otherPlayer = {}; // player to compare scores with
    // run all the turns
    this.play = function () {
        var log = '';
        console.log(players);

        for (i = 0; i < this.maxTurns; i++) {
            log += "<br>Turn " + i + ") ";

            this.setActivePlayer();
            log += "player " + players[this.playerActive].name + ") ";
            var activeGuy = this.players[this.playerActive];
            if (activeGuy.hasCards()) {
                // remove a card from the hand
                var card = activeGuy.cards.pop();
                // put it on the table
                this.table.push(card);

                //if it is the first turn, table is empty and we can not compare, go to next turn.
//                console.log(this.table.length);
                if (this.table.length == 1) {
                    log += "puts " + card.name;
                    this.otherPlayer = this.playerActive.id;
                    continue;
                }
                else {
                    // determine winner
                    // update players scores
                    log += "compares " + card.name;
                    // compare value of cards
                    if (card.points == this.table[0].points) {
                        log += "<br> <div class='alert alert-default'>OMG! a draw!</div> ";
                        console.log(this.playerActive.id);
//                        this.players[this.playerActive.id].points++;
//                        this.players[this.otherPlayer].points++;
                    }
                    else {
                        if(card.points > this.table[0].points){
                            log += "<br> <div class='alert alert-success'>and wins! booyah!</div>  ";
                        }
                        else{
                            log += "<br> <div class='alert alert-warning'>and he is a big loser! BOOOOOH!</div> ";
                        }
                    }
                    // empty table, put cards to grave
                    this.table = new Array();
                }

            }
        }
        $('#log').append('<div class="bs-callout bs-callout-info"><p>' + log + '</p></div>')
    }
    // set who's turn it is to play
    this.setActivePlayer = function () {
        this.playerActive++;
        if (this.playerActive >= players.length) {
            this.playerActive = 0;
        }
    }

}
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
    this.score = '';
    this.turnId = '';
    this.status = function () {
        return "player " + this.id + ") " + this.name + ". having " + this.cards.length + "cards";
    };
    for (var attrname in config) {
        this[attrname] = config[attrname];
    }

    return this;
}


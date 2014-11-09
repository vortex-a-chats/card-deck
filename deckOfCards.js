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





    // place where the dead card goes
    this.graveyard = new Array();
    // tells how the deck is.
    this.health = function () {
        var blah = "i am a deck having " + this.cards.length + " cards.";
        blah += "<br/>";
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

    };
    // distribute an equal number of cards to all the players
    this.distributeAll = function (players, int) {

    };
    // remove one card 
    this.out = function (card) {

    };
    // remove one card 
    this.in = function (card) {
        this.cards.push(card);
    };

    // build cards
    var values = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Valet", "Dame", "Roi");
    var colors = new Array("coeur", "trèfle", "carreau", "pique");
    var count = 0;
    for (i = 0; i < colors.length; i++) {
        var color = colors[i];
        for (j = 0; j < values.length; j++) {
            var config = {
                id: count,
                color: color,
                code: j + '-' + color.substring(0, 3),
                name: j + ' de ' + color,
                points: j,
            }
            count++;
//            this.cards.push(new Card(config))
            this.in(new Card(config));
        }
    }
}

/**
 * card player
 * @returns {undefined}
 */
function Player() {

}




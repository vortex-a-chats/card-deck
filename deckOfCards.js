/**
 * deck of cards
 * @returns {undefined}
 */
function Deck(){
    // cards of the game
    this.cards = new Array();
    // place where the dead card goes
    this.graveyard = new Array();
    // tells how the deck is.
    this.health = function(){
        return "i am a deck having " + this.cards.length + " cards."
    };
    // shuffle the deck
    this.shuffle = function(){
        
    };
    // distribute a certain number of cards to one player
    this.distribute = function(player, int){
        
    };
    // distribute an equal number of cards to all the players
    this.distributeAll = function(players, int){
        
    };
    // remove one card 
    this.out = function(cardId){
        
    };
    // remove one card 
    this.in = function(cardId){
        
    };
    
}

/**
 * card player
 * @returns {undefined}
 */
function Player(){
    
}

/**
 * any card
 * @returns {undefined}
 */
function Card(){
    
}
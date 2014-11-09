
$(function () {
    var deck = new Deck();
    
    var players = new Array(
            new Player({id: 0, name:"bob"}),
            new Player({id: 1, name:"abrasiveGuy"}),
            new Player({id: 2, name:"chewbacca"}),
            new Player({id: 3, name:"chaaa-a-a-rlie"})
            );
    deck.shuffle();
    deck.distributeAll(players , 5);
    var status = deck.health();
    $('#state').html(status);
    for (i = 0; i <= players.length; i++) {
        $('#player-' + i).html( players[i].status() );
    }
    console.log("ready!");
});
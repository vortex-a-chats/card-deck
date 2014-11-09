
$(function () {
    var deck = new Deck();
    var status = deck.health();
    $('#state').html(status);
    console.log("ready!");
});
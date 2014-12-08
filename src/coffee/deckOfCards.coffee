# jQuery wrapping tadah
###*
any card
@returns {undefined}
###
Card = (config) ->
  @id = null
  @ownerId = null
  @code = ""
  @name = ""
  @color = ""
  @points = ""
  for attrname of config
    this[attrname] = config[attrname]
  this

###*
deck of cards
@returns {undefined}
###
Deck = ->

  # cards of the game
  @cards = []
  @hasDistributed = 0

  # place where the dead card goes
  @graveyard = []

  # tells how the deck is.
  @health = ->
    blah = "i am a deck having " + @cards.length + " cards."
    blah

  @tellCards = ->
    i = 0
    while i < @cards.length
      blah += "<br/>" + @cards[i].name
      i++
    blah


  # shuffle the deck
  @shuffle = ->
    o = @cards
    j = undefined
    x = undefined
    i = o.length

    while i
      j = Math.floor(Math.random() * i)
      x = o[--i]
      o[i] = o[j]
      o[j] = x
    @cards = o
    @cards


  # distribute a certain number of cards to one player
  @distribute = (player, int) ->
#      # console.log 'le deck avait '+@cards.length+' cartes'
#      # console.log 'distribution de carte à '+player.name+' (qui a '+player.cards.length+' cartes)'
    i = 0
    if int is 0
      return
    if @cards.length is 0
      return 0
    while i < int
      oneCard = @cards.pop()
      oneCard.ownerId = i
      player.cards.push oneCard
      i++
    @hasDistributed = 1
    # console.log  player.name+' a maintenant '+player.cards.length+' cartes)'
    i # return the number of cards distributed

  # distribute an equal number of cards to all the players
  @distributeAll = (players, int) ->
    # console.log 'le deck avait '+@cards.length+' cartes'
    @players = players
    i = 0
    while i < players.length
      if typeof (players[i]) isnt `undefined`
        player = players[i]
        # console.log 'distribution de '+int+' cartes à '+player.name
        j = 0
        while j < int
          oneCard = @cards.pop()
          oneCard.ownerId = i
          players[i].cards.push oneCard
          j++
      # console.log '    il a maintenant '+player.cards.length+' cartes'
      i++
    @hasDistributed = 1
    @upPlayers()
    true
  #show players in the view
  @upPlayers = ()->
    for p in @players
      $('#player-'+p.id).html('<strong>'+p.name+'</strong> '+p.cards.length+' cartes')
  # console.log('vue mise a jour')
  # remove one card 
  @removeCard = (card) ->
    cardid = 12
    exitedCard = @cards.pop(cardid)
    @graveyard.push exitedCard
    return

  # remove one card 
  @addCard = (card) ->
    @cards.push card
    return


  # build cards
  values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "V", "D", "R"]
  names = ["as", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Valet", "Dame", "Roi"]
  colors = ["coeur", "trèfle", "carreau", "pique"]
  htmlIcon = ["&hearts;", "&spades;", "&clubs;", "&diams;"]
  points = [14, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  count = 0
  i = 0
  while i < colors.length
    color = colors[i]
    j = 0
    while j < values.length
      config =
        id: count
        color: color
        htmlIcon: htmlIcon[i]
        code: j + "-" + color.substring(0, 3)
        name: names[j] + " de " + color
        points: points[j]

      count++
      @addCard new Card(config)
      j++
    i++
  return

###*
card player
@returns {undefined}
###
Player = (config) ->
  @id = 0
  @name = ""
  @cards = []
  @cardsOrigin = []
  @stash = "" # a place to store cards that wont be used
  @score = 0
  @victory = 0
  @turnId = ""
  @type = "NPC" # Non playing character or true player
  @hasCards = ->
    return true  if @cards.length > 0
    false

  @status = ->
    content = "player " + @id + ") " + @name + ". having <strong>" + @cards.length + " </strong>cards <br/> <span class='score'>" + @score + "</span> points"
    text = content
    if @victory
      text = "<div class='alert-success alert'>"+content+"</div>"
    text

  for attrname of config
    this[attrname] = config[attrname]
  this

###*
core of the action in a game,
the dealer runs the turns
@returns {undefined}
###
Dealer = (players, deck) ->
  @players = players
  @deck = deck
  @maxTableTurns = 20
  @maxTurns = 200
  @turn = 0
  @playerToStart = 0
  @playerActive = 0
  @config = 
    autoplay : 1
  @activeGuy = @players[@playerActive]
  @graveyard = [] # place where cards go when out of the game. RIP.
  @table = [] # place where cards are shown to everyone
  @otherPlayer = {} # player to compare scores with
  # ask active player to do something
  @askInput = ->
    # console.log "-----demande d'input"
    @activeGuy = @players[@playerActive];
    activeName = @activeGuy.name

    #      $('#input-instructions').html( activeName+' play a card with a high value')
    #      list the cards of the player.
    cards = []
    if @activeGuy
      cards = @activeGuy.cards
      choice = ''
      choice = @cards2html(cards)
      $('#input-choice').html(choice)
    # console.log('en attente du joueur: '+activeName)
    @setState('<h2>'+@turn+'</h2> statoi de jouer, '+activeName)

  #set a text in the state of the game
  @setState = (text)->
    $('#state').html(text)

  #render html view of a set of cards
  @cards2html = (cards)->
    listing = ''
    for c in cards  
      guyId = parseInt(@playerActive)
      listing += '<button class="card card-'+c.color+' score-'+c.points+' col-lg-1" data-id="'+c.id+'" data-playerid="'+guyId+'">'+c.name+'</button>'
    listing

  @interactionsJQ = ->
    window.$tk.theDealer = @
    $("body").on("click", "#input-choice .card", (e, dealer)->
      # "this" becomes the clicked button
      self = $(@)
      d= window.$tk.theDealer
      name = self.attr("data-playerid")
      cardId = self.attr("data-id")

      card = d.idToCard( cardId , d.activeGuy.cards )
      # console.log "carte a poser: ", card
#        if card != undefined
      d.putCardToTable(card)
      self.fadeOut()
    ) 

  # put all cards of the table in the graveyard
  @emptyTable = ->
    for card in @table
      @graveyard.push card
    @table = []
  #      # console.log('table is now empty')

  @nextTurn = ->
    @turn++
    # take a fight of the cards only when there are 2 cards on the table
    if @table.length == 2
      # console.log('début de l\'affrontement sur table!')
      fightResult = @tableFight()
      if fightResult == "equal"
        # console.log('égalité!')
      else
        @players[fightResult].score++;

        # console.log(@players[fightResult].name+' a gagné le match!')
        @log(@players[fightResult].name+' a gagné le match!')
      @emptyTable()

    @isItFinished()


  # check if the game is over
  # has current player won and has no cards left in his hands ?
  @isItFinished = ->
    # # console.log "checking if the game is over, turn: "+@turn+" / "+@maxTurns
    if @maxTurns < @turn
      return @gameOver()
    if @activeGuy.cards.length == 0
      return @winning()
    # continue game
    else
      @setActivePlayer()
      @refreshView()
      if @config.autoplay
        if @activeGuy.type == "NPC"
          ## console.log " NPC spotted "+@activeGuy.name
          return setTimeout( @autoplay() , 500)
        else
          ## console.log " TRUE PLAYER spotted "+@activeGuy.name
      else
        return @askInput()

  #end of the game
  @gameOver = ->
    @log(' maximum turns reached, game over')
    $("body").off("click", "#input-choice .card")
    $("#input-choice button").disable()
  # makes a non playing character play automatically
  @autoplay = ->
    # console.log(' AUTOPLAY '+@activeGuy.name+':')
    # a way to choose a card in the hand
    card = @activeGuy.cards.pop(0);
    @refreshView()
    @putCardToTable(card)


  @winning = ->
    $("#input-choice, #table").fadeOut()
    txt = 'le joueur '+@activeGuy.name+' est vainqueur!'
    @activeGuy.won = 1
    # console.log(txt)
    @log(txt)
    $("#state").html txt

  @oneTurn = ->
    @refreshView()
    @askInput()


  # check for cards of a player,
  # remove the one we are looking for and return it
  # needle is the id of the card
  # haystack is the card array
  @idToCard = (needle, haystack)->
    needle = parseInt(needle)
    # console.log('we are looking for an id of', needle)
    i = 0
    for c in haystack
#        # console.log('card tested', c.id , needle , c.name)
      if ( parseInt(c.id) == needle)
        # console.log('card found')
        return c
    # console.log('card '+needle+' NOT found')
    i++

  @idToHandId = (needle, haystack)->
    needle = parseInt(needle)
    #      # console.log('we are looking for an id of', needle, haystack)
    i = 0
    for c in haystack
      if ( parseInt(c.id) == needle)
        return i
      i++

  # run all the turns
  @play = ->
    @maxTurns = (@maxTableTurns * players.length)
    @activeGuy = @players[@playerToStart]
    @playerActive = @playerToStart
    # console.log 'play sparti'
    log = ""
    i = 1
    @interactionsJQ()
    @oneTurn()
  # put a card in the table array
  # and return 
  @putCardToTable = (card)->
    card.ownerId = @activeGuy.id
    # remove the card from active player's hand
    res = @idToHandId(card.id, @activeGuy.cards)
    @activeGuy.cards.splice(res,1)
    @table.push card
    # only if it is a true player
    if @activeGuy.type == "true-player"
#        # console.log('   le joueur a '+@activeGuy.cards.length+' cartes')
#        # console.log('   carte et main du joueur: ', card.id, @activeGuy.cards)
#        # console.log('   id de la carte à enlever de la main du joueur: ', res, @activeGuy.cards[res])
#        # console.log('   le joueur '+@activeGuy.name+' pose la carte '+card.name)
#        @refreshView()
#        # console.log('   res '+res)
#        # console.log('   carte: ', card)
      console.log('   le joueur a maintenant ' + @activeGuy.cards.length + ' cartes')
    @log('le joueur '+@activeGuy.name+' pose la carte '+card.name)
    # !!!!!!!!!
#      choice = @cards2html(@activeGuy.cards)
#      $('#input-choice').html('<h2>Main de '+@activeGuy.name+'</h2>'+choice)
    @nextTurn()

  # fight between two players
  # returns the winner id or the string "equal"
  @tableFight = ()->
    # comparaison
    # case of equal strength
    if( @table[0].points ==  @table[1].points )
      return "equal"
    else
      if( @table[0].points >  @table[1].points )
#          # console.log "perdant : "+@table[1].ownerId
        @loserAction(@table[1].ownerId)
        return @table[0].ownerId 

      else
#          # console.log "perdant : "+@table[0].ownerId
        @loserAction(@table[0].ownerId)
        return @table[1].ownerId 

  # triggered after a table fight
  @loserAction = (idLoser)->
    # make the loser player pick a card from the deck
    theGuy = @players[idLoser]
    result = @deck.distribute( theGuy ,1)
    if result == 1
      # console.log("le joueur "+@players[idLoser].name+" pioche une carte")
    else
      if result == 0
        # console.log("le joueur "+@players[idLoser].name+" n'a PAS pu pioche une carte")
        if @players[idLoser].cards.length == 0
          @winning()

  # set who's turn it is to play
  @setActivePlayer = ->
    @playerActive++
    @playerActive = 0  if @playerActive >= players.length
    @activeGuy = @players[@playerActive]
  ## console.log "le joueur actif est maintenant "+@activeGuy.name

  @log = (text) ->
    if @turn != @lastTurn
      text = " <h2>tour "+@turn+"</h2> "+text
    text = "<div class=\"bs-callin bs-callin-info\"><p>" + text + "</p></div>"
    $("#log").append text
    @lastTurn = @turn

  @refreshView = () ->
    players = @players
    status = deck.health()
    $("#table").html @cards2html(@table)
    $("#state").html status
    $("#graveyard").html @cards2html(@graveyard)
    $('#input-instructions').html( @activeGuy.name+' play a card with a high value')
    #      list the cards of the player.
    cards = []
#      if @activeGuy
    cards = @activeGuy.cards
    choice = ''
    choice = @cards2html(cards)
    $('#input-choice').html('<h2>Main de '+@activeGuy.name+'</h2>'+choice)
    tempCount = 0
    while tempCount < @players.length
      $("#player-" + tempCount).html players[tempCount].status()
      tempCount++

  this

deckOfCards = ->
  deck : Deck
  card : Card
  player : Player
  dealer : Dealer
$tk = {deckOfCards : deckOfCards}

obj = ->
  a : "essai de a"

# console.log "deckOfCards is ready!"
window.deckOfCards = deckOfCards
window.obj = obj
window.$tk = $tk

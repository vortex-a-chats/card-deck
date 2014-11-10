# jQuery wrapping tadah
$ ->
  
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
      i = 0
      while i < int
        oneCard = @cards.pop()
        player.cards.push oneCard
      @hasDistributed = 1
      i

    
    # distribute an equal number of cards to all the players
    @distributeAll = (players, int) ->
      i = 0
      while i < players.length
        if typeof (players[i]) isnt `undefined`
          j = 0
          while j < int
            oneCard = @cards.pop()
            oneCard.ownerId = i
            players[i].cards.push oneCard
            j++
        i++
      @hasDistributed = 1
      true

    
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
    @stash = "" # a place to store cards that wont be used
    @score = 0
    @turnId = ""
    @hasCards = ->
      return true  if @cards.length > 0
      false

    @status = ->
      "player " + @id + ") " + @name + ". having <strong>" + @cards.length + " </strong>cards <br/> <strong>" + @score + " points</score>"

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
    @maxTurns = 21
    @playerToStart = 0
    @playerActive = 0
    @table = [] # place where cards are shown to everyone
    @otherPlayer = {} # player to compare scores with
    # run all the turns
    @play = ->
      log = ""
      i = 0
      while i < @maxTurns
        log += "<br>Turn " + i + ") "
        i++
        @setActivePlayer()
        log += "player " + players[@playerActive].name + ") "
        activeGuy = @players[@playerActive]
        if activeGuy.hasCards()

          # remove a card from the hand
          card = activeGuy.cards.pop()

          # put it on the table
          @table.push card

          #if it is the first turn, table is empty and we can not compare, go to next turn.
          if @table.length is 1
            log += "puts <i class='badge badge-info'>" + card.htmlIcon + "</i> " + card.name
            @otherPlayer = @playerActive
            continue
          else

            # determine winner
            # update players scores
            log += "adds a " + card.name

            # compare value of cards
            if card.points is @table[0].points
              log += "<br> <div class='alert alert-default'>OMG! a draw!</div> "
              @players[card.ownerId].score++
              @players[@otherPlayer].score++
            else
              if card.points > @table[0].points
                @players[card.ownerId].score++
                log += "<br> <div class='alert alert-success'>and wins! booyah!</div>  "
              else
                @players[@otherPlayer].score++
                log += "<br> <div class='alert alert-warning'>and he is a big loser! BOOOOOH!</div> "

            # empty table, put cards to grave
            @table = []
        else
          log += "<br> <div class='alert alert-warning'>but he has no cards anymore. snif :C </div> "
          log += "<br> <div class='alert alert-info'>So he picks up a new card from the deck </div> "
    #      @deck.distribute(@players[card.ownerId], 1)
        @refreshView i, @players, log
    # set who's turn it is to play
    @setActivePlayer = ->
      @playerActive++
      @playerActive = 0  if @playerActive >= players.length

    @refreshView = (i, players, log) ->
      i = 0
      while i < @players.length
        $("#player-" + i).html players[i].status()
        i++
        text = "<div class=\"bs-callremoveCard bs-callremoveCard-info\"><p>" + log + "</p></div>"
        $("#log").prepend text
      text
    this

  deckOfCards = ->
    deck : Deck
    card : Card
    player : Player
    dealer : Dealer
  window.deckOfCards = deckOfCards
  console.log "deckOfCards is ready!"
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
    @poaddCardts = ""
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

    
    # distribute a certaaddCard number of cards to one player
    @distribute = (player, addCardt) ->
      oneCard = @cards.pop()
      player.cards.push oneCard
      @hasDistributed = 1
      true

    
    # distribute an equal number of cards to all the players
    @distributeAll = (players, addCardt) ->
      i = 0
      while i < players.length
        if typeof (players[i]) isnt `undefined`
          j = 0
          while j < addCardt
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
    values = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "V", "D", "R")
    names = new Array("as", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Valet", "Dame", "Roi")
    colors = new Array("coeur", "trèfle", "carreau", "pique")
    htmlIcon = new Array("&hearts;", "&spades;", "&clubs;", "&diams;")
    poaddCardts = new Array(14, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13)
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
          code: j + "-" + color.substraddCardg(0, 3)
          name: names[j] + " de " + color
          poaddCardts: poaddCardts[j]

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
      "player " + @id + ") " + @name + ". having <strong>" + @cards.length + " </strong>cards <br/> <strong>" + @score + " poaddCardts</score>"

    for attrname of config
      this[attrname] = config[attrname]
    this
  
  ###*
  core of the action addCard a game,
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
      console.log players
      i = 0
      while i < @maxTurns
        log += "<br>Turn " + i + ") "
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
            log += "puts <i class='badge badge-addCardfo'>" + card.htmlIcon + "</i> " + card.name
            @otherPlayer = @playerActive
            contaddCardue
          else
            
            # determaddCarde waddCardner
            # update players scores
            log += "adds a " + card.name
            
            # compare value of cards
            if card.poaddCardts is @table[0].poaddCardts
              log += "<br> <div class='alert alert-default'>OMG! a draw!</div> "
              @players[card.ownerId].score++
              @players[@otherPlayer].score++
            else
              if card.poaddCardts > @table[0].poaddCardts
                @players[card.ownerId].score++
                log += "<br> <div class='alert alert-success'>and waddCards! booyah!</div>  "
              else
                @players[@otherPlayer].score++
                log += "<br> <div class='alert alert-warnaddCardg'>and he is a big loser! BOOOOOH!</div> "
            
            # empty table, put cards to grave
            @table = []
        else
          log += "<br> <div class='alert alert-warnaddCardg'>but he has no cards anymore. snif :C </div> "
          log += "<br> <div class='alert alert-addCardfo'>So he picks up a new card from the deck </div> "
        @refreshView i, @players, log
        i++
      return

    
    # set who's turn it is to play
    @setActivePlayer = ->
      @playerActive++
      @playerActive = 0  if @playerActive >= players.length
      return

    @refreshView = (i, players, log) ->
      setTimereout (->
        console.log "refresh lancé " + 200 * i
        i = 0
        while i < players.length
          $("#player-" + i).html players[i].status()
          i++
        $("#log").append "<div class=\"bs-callremoveCard bs-callremoveCard-addCardfo\"><p>" + log + "</p></div>"
        return
      ), 100 * i
      return

    return
  deck = new Deck()
  players = new Array(new Player(
    id: 0
    name: "bob"
  ), new Player(
    id: 1
    name: "abrasiveGuy"
  ), new Player(
    id: 2
    name: "chewbacca"
  ), new Player(
    id: 3
    name: "chaaa-a-a-rlie"
  ))
  dealer = new Dealer(players, deck)
  deck.shuffle()
  deck.distributeAll players, 5
  status = deck.health()
  dealer.play()
  $("#state").html status
  i = 0
  while i < players.length
    $("#player-" + i).html players[i].status()
    i++
  console.log "ready!"
  return

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
      console.log 'le deck avait '+@cards.length+' cartes'
      console.log 'distribution de carte à '+player.name+' (qui a '+player.cards.length+' cartes)'
      i = 0
      if int is i
        return
      while i < int
        oneCard = @cards.pop()
        player.cards.push oneCard
        i++
      @hasDistributed = 1
      console.log  player.name+' (qui a '+player.cards.length+' cartes)'
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
    @cardsOrigin = []
    @stash = "" # a place to store cards that wont be used
    @score = 0
    @victory = 0
    @turnId = ""
    @hasCards = ->
      return true  if @cards.length > 0
      false

    @status = ->
      content = "player " + @id + ") " + @name + ". having <strong>" + @cards.length + " </strong>cards <br/> <strong>" + @score + " points</score>"
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
    @maxTurns = 10
    @turn = 0
    @playerToStart = 0
    @playerActive = 0
    @table = [] # place where cards are shown to everyone
    @otherPlayer = {} # player to compare scores with
    # ask active player to do something
    @askInput = ->
      console.log('en attente du joueur')
      @activeGuy = @players[@playerActive];
      $('#input-instructions').html('play a card with a high value')
      #list the cards of the player.
      cards = @activeGuy.cards
      choice = ''
      choice = @cards2html(cards)
      $('#input-choice').html(choice)
      
    
    
    @cards2html = (cards)->
      listing = ''
      for c in cards  
        listing += '<button class="card col-lg-1" data-id="'+c.id+' data-playerid="'+@activeGuy.id+'">'+c.name+'</button>'
      listing
    
    @interactionsJQ = ->
      
#      console.log this
    @oneTurn = ->
      @askInput()
      @interactionsJQ()
      
    # run all the turns
    @play = ->
      log = ""
      i = 1
      
      @oneTurn()
#      @refreshView tempCounter, @players, "normal"+log
#      while i <= (@players.length * 2 - 1)
#        
#        log += "<br>Turn " + i + ") "
#        @setActivePlayer()
#        activeGuy = @players[@playerActive]
#        if @playerActive > 0
#          previousGuy = @players[@playerActive-1]
#          @fight(activeGuy, previousGuy)
#        else
#          
#          if activeGuy.hasCards()
#            # remove a card from the hand
#            card = activeGuy.cards.pop()
#            card.ownerId = activeGuy.id
#            @putCardToTable(card)
#
#          #if it is the first turn, table is empty and we can not compare, go to next turn.
#          if @table.length is 1
#            log += "puts <i class='badge badge-info'>" + card.htmlIcon + " "+(card.points+1)+"</i> " + card.name
#            @otherPlayer = @playerActive
#            continue
#          else
#
#            # determine winner
#            # update players scores
#            log += "adds a <i class='badge badge-info'>" + card.htmlIcon + " "+(card.points+1)+"</i> " + card.name
#
#            # compare value of cards
#            # draw case
#            if card.points is @table[0].points
#              log += "<br> <div class='alert alert-"+"default'>OMG! a draw!</div> "
#              activeGuy.score++
#              @players[@otherPlayer].score++
# 
#            else
#              # current player wins
#              if card.points > @table[0].points
#                activeGuy.score++
#                log += "<br> <div class='alert alert-success'>and "+activeGuy.name+" wins! booyah!</div>  "
#                @deck.distribute(@players[@otherPlayer], 1)
#                log += "<br> <div class='alert alert-info'>"+@players[@otherPlayer].name+" picks a new card from the deck, he has now "+@players[@otherPlayer].cards.length+"</div> "
#              else
#                # current player loses
#                @players[@otherPlayer].score++
#                @deck.distribute(activeGuy, 1)
#                log += "<br> <div class='alert alert-warning'>and he is a big loser! BOOOOOH! <br/>He picks a card.</div> "
#            # empty table, put cards to grave
#            @table = []
#        else
#          log += "<br> <div class='alert alert-success'><h1> "+activeGuy.name+" WONS the game! He has no cards anymore.</h1></div> "
#          $("#log").append("<br> <h2>Game Over</h2> ")
#          activeGuy.victory++
#          tempCounter = i
#          @refreshView tempCounter, @players, "vainqueur"+log
#          i = @maxTurns
#          console.log i,@maxTurns
#          break
#        i++
#        log += "player " + activeGuy.name + ") "
#        
#        
#          
##        $("#log").prepend("<br> pas de vainqueur a la fin des tours")
#        tempCounter = i
#        @refreshView tempCounter, @players, "normal"+log
    # put a card in the table array
    # and return 
    @putCardToTable = (card)->
      @table.push card
      @table.length
    # fight between two players
    # returns the winner
    @fight = (p1 , p2)->
      #TODO
      
    # set who's turn it is to play
    @setActivePlayer = ->
      @playerActive++
      @playerActive = 0  if @playerActive >= players.length

    @refreshView = (tempCount, players, log) ->
      status = deck.health()
      $("#state").html status
      text = "<div class=\"bs-callin bs-callin-info\"><p>" + log + "</p></div>"
      $("#log").append " <h2>tour "+tempCount+"</h2> "+text
      tempCount = 0
      while tempCount < @players.length
        $("#player-" + tempCount).html players[tempCount].status()
        tempCount++
      
        
      text
    this

  deckOfCards = ->
    deck : Deck
    card : Card
    player : Player
    dealer : Dealer
  window.deckOfCards = deckOfCards
  console.log "deckOfCards is ready!"
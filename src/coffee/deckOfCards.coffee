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
      i # return the number of cards distributed
      
    
    # distribute an equal number of cards to all the players
    @distributeAll = (players, int) ->
      console.log 'le deck avait '+@cards.length+' cartes'
      @players = players
      i = 0
      while i < players.length
        if typeof (players[i]) isnt `undefined`
          player = players[i]
          console.log 'distribution de '+int+' cartes à '+player.name
          j = 0
          while j < int
            oneCard = @cards.pop()
            oneCard.ownerId = i
            players[i].cards.push oneCard
            j++
          console.log '    il a maintenant '+player.cards.length+' cartes'
        i++
      @hasDistributed = 1
      @upPlayers()
      true
    #show players in the view
    @upPlayers = ()->
      for p in @players
        $('#player-'+p.id).html('<strong>'+p.name+'</strong> '+p.cards.length+' cartes')
      console.log('vue mise a jour')
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
    @activeGuy = @players[@playerActive]
    @table = [] # place where cards are shown to everyone
    @otherPlayer = {} # player to compare scores with
    # ask active player to do something
    @askInput = ->
      console.log('en attente du joueur: '+@players[@playerActive].name)
      @setState('statoi de jouer, '+@players[@playerActive].name)
      @activeGuy = @players[@playerActive];
      $('#input-instructions').html('play a card with a high value')
      #      list the cards of the player.
      cards = []
      if @activeGuy
        cards = @activeGuy.cards
      choice = ''
      choice = @cards2html(cards)
      $('#input-choice').html(choice)
      
    @setState = (text)->
      $('#state').html(text)

    @cards2html = (cards)->
      listing = ''
      for c in cards  
        guyId = parseInt(@playerActive)
        listing += '<button class="card col-lg-1" data-id="'+c.id+'" data-playerid="'+guyId+'">'+c.name+'</button>'
      listing

    @interactionsJQ = ->
      window.$tk.theDealer = @
      $("body").on("click", "#input-choice .card", (e, dealer)->
        # "this" becomes the clicked button
        self = $(@)
        d= window.$tk.theDealer
        name = self.attr("data-playerid")
        cardId = self.attr("data-id")
        self.fadeOut()
        card = d.idToCard( cardId , d.activeGuy.cards )
        d.putCardToTable(card)
      )
      
    @nextTurn = ->
      @setActivePlayer()
      @askInput()
      
    @oneTurn = ->
      @askInput()
      @interactionsJQ()
      
    # check for cards of a player,
    # remove the one we are looking for and return it
    # needle is the id of the card
    # haystack is the card array
    @idToCard = (needle, haystack)->
      needle = parseInt(needle)
      console.log('we are looking for an id of', needle)
      i = 0
      for c in haystack
        #        console.log('card tested', c.id)
        if (c.id == needle)
          console.log('card found')
          return c
      console.log('card '+needle+' not found')
      i++
      
    @idToHandId = (needle, haystack)->
      needle = parseInt(needle)
      console.log('we are looking for an id of', needle, haystack)
      i = 0
      for c in haystack
        if (c.id == needle)
          return i
        i++
        
    # run all the turns
    @play = ->
      console.log 'play sparti'
      log = ""
      i = 1
      @oneTurn()
    # put a card in the table array
    # and return 
    @putCardToTable = (card)->
      # remove the card from active player's hand
      res = @idToHandId(card.id, @activeGuy.cards)
      console.log('id de la carte à enlever de la main du joueur: ', res, @activeGuy.cards[res])
      @activeGuy.cards.pop res
      console.log('le joueur '+@activeGuy.name+' pose la carte '+card.name)
      @table.push card
      console.log('mise a jour des joueurs')
      @refreshView('hop')
      @nextTurn()
      
    # fight between two players
    # returns the winner
    @fight = (p1 , p2)->
      #TODO

    # set who's turn it is to play
    @setActivePlayer = ->
      @playerActive++
      @playerActive = 0  if @playerActive >= players.length
      @activeGuy = @players[@playerActive]

    @refreshView = (log) ->
      players = @players
      status = deck.health()
      
      $("#table").html @cards2html(@table)
      $("#state").html status
      text = "<div class=\"bs-callin bs-callin-info\"><p>" + log + "</p></div>"
      $("#log").append " <h2>tour "+@turn+"</h2> "+text
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
  $tk = {deckOfCards : deckOfCards}
  
  console.log "deckOfCards is ready!"
  window.deckOfCards = deckOfCards
  window.$tk = $tk

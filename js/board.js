
var board = $('#board');
var boardRows = 10;
var boardColumns = 10;
var numOfBombs = 15;
var numOfNonBombs = (boardRows * boardColumns) - numOfBombs
var tilesLeftCounter // used by makeBoard() & clearZeroTiles()

function randomTileAxisNum(){
  // * has to adapt to different board sizes
  var num = Math.floor( (Math.random() * 10 ) )
  return num
}//randomNum()

function makeTileIdStr(row, col){ // max board size 100x
  function makeAxisStr(num){

    if(num < 10){
      return ( '0' + num )
    }else{
      return ( '' + num )
    }
  } // makeAxisStr(num)
  return makeAxisStr(row) + makeAxisStr(col)
} // makeTileIdStr(row, col)

function traverseTiles(tileIdStr, directionStr){
  // define path directions
  var shift = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
    // not tested ..
    ul: [-1, -1],
    ur: [-1, 1],
    dl: [1, -1],
    dr: [1, 1]
  }

  // start at titleIdStr

  var targetRowNum = parseInt(tileIdStr.slice(0, 2))

  var targetColNum = parseInt(tileIdStr.slice(2))

  //shift tile focus

  targetRowNum += shift[directionStr][0]

  targetColNum += shift[directionStr][1]


  return makeTileIdStr(targetRowNum, targetColNum)
} // traverseTile(tileIdStr, directionStr)

function isBomb(tileDOM){
  if( tileDOM.html() == -1 ){
    return true
  } else {
    return false
  }
}

function clearZeroTiles(zeroTileIdStr){

  $('#' + zeroTileIdStr).removeClass('tile-hidden')
  $('#' + zeroTileIdStr).addClass('tile-0')
  --tilesLeftCounter
  $('#tilesLeftCounter').text(tilesLeftCounter)

}

var stopwatchSeconds = 0;
var stopwatch;

function timer(string){
  switch(string){
    case 'start':
      stopwatch = setInterval(function(){ tick() }, 1000);
      break;
    case 'stop':
      clearInterval(stopwatch);
      break;
    case 'reset':
      stopwatchSeconds = 0;
      $('#current-timer').html(stopwatchSeconds)
      break;
  } // switch
} // timer(string)

function tick(){
  ++stopwatchSeconds
  function formatNum(num){
    if(num < 10){
      return ( '0' + num )
    }else{
      return ( '' + num )
    }
  }
    var minutes = formatNum( Math.floor(stopwatchSeconds / 60) )
    // console.log(minutes)
    var seconds = formatNum( stopwatchSeconds % 60 )
    // console.log(seconds)
    $('#current-timer').html(minutes + ':' + seconds)
  }

function setRecord(num){
  console.log('setRecord(num)')
}

function makeBoard(){
  $('<div>', {class: 'timer', id: 'current-timer', text: '00:00'}).appendTo('#board')
  $('<div>', {id: 'bomb-toggle',
    html: '<span id="tilesLeftCounter">' + numOfNonBombs + '</span> / <span id="flagsLeftCounter">' + numOfBombs + '</span>'
  }).appendTo('#board')
  $('<div>', {class: 'timer', id: 'record-time', text: '00:00'}).appendTo('#board')
  $('<button>', {id: 'reset-btn', text: 'New Game'}).appendTo('#board')
  $('<button>', {id: 'toggle-flag-btn', text: 'toggle flag'}).appendTo('#board')

  //resetBoard()
  $('#reset-btn').click(function(){
    $('#board').empty()
    makeBoard()
  })

  tilesLeftCounter = numOfNonBombs;
  var flagsLeftCounter = numOfBombs;
  var flagToggle = false
  $('#toggle-flag-btn').click(function(){
    // change click behavior if toggle-flag-btn has been clicked
    flagToggle == true ? flagToggle = false : flagToggle = true
    if( $(this).hasClass( 'flagged' ) ){
      $('#toggle-flag-btn').removeClass('flagged')
    } else {
      $('#toggle-flag-btn').addClass('flagged')
    }
  }) // click( #toggle-flag-btn )

  for(var row = 0; row < boardRows; row++){ // ROW
    $('<div>', { id: ('row' + row), class: 'row' }).appendTo('#board');
    for(var col = 0; col < boardColumns; col++){ // COLUMN
      var $divTile = $('<div>', { class: 'tile tile-hidden', id: makeTileIdStr(row, col), text: 0 } );
  /// FOR EVERY TILE ON THE BOARD...
        $divTile.click(function(){
          /// is flag-toggle active?
          if(flagToggle){
            if( $(this).hasClass('flagged') ){
              $(this).removeClass('flagged')
              flagsLeftCounter++

            } else {
              $(this).addClass('flagged')
              flagsLeftCounter--
            }

            $('#flagsLeftCounter').html(flagsLeftCounter)

            ///
          } else if( !$(this).hasClass('flagged') ){
            // is bomb
            if( $(this).html() == '-1' ){
              $(this).addClass('tile-bomb')
              $(this).removeClass('tile-hidden')
              timer('stop')
              alert( 'tile ' + $(this).attr('id') + ' is a bomb, you lose')

            } else if($(this).hasClass('clicked') ){
              alert('This tile has already been selected, select another.')

            } else if( $(this).html() == '0' ){
              clearZeroTiles( $(this).attr('id') )

            } else { // is num between 1 & 8
              $(this).addClass('clicked')
              $(this).removeClass('tile-hidden')
              $(this).addClass('tile-' + parseInt($(this).html()) )
              --tilesLeftCounter
              $('#tilesLeftCounter').text(tilesLeftCounter)

              if(tilesLeftCounter < 1){
                alert('you won! yay!!')
                timer('stop')
              }
            } // else // is num between 1 & 8
          } else {// if( !flagToggle ).. the tile IS flagged
            alert('this tile is protected, toggle the flag selector and select this tile to disable protection')
          }
        }) // $divTile.click
        $divTile.appendTo('#row' + row);
    } // forEach( column )
  } // forEach( row )

  /// MAKE ARRAY OF UNIQUE BOMB IDs
  var newBombId = makeTileIdStr( randomTileAxisNum(), randomTileAxisNum() );
  var arrayOfBombs = [newBombId]
  while(arrayOfBombs.length < numOfBombs){
    newBombId = makeTileIdStr( randomTileAxisNum(), randomTileAxisNum() );
    // console.log('newBombId: ' + newBombId)
    if( !arrayOfBombs.includes(newBombId) ){
      arrayOfBombs.push(newBombId)
      // console.log('pushed ' + newBombId)
    }
  } // while(arrayOfBombs.length < numOfBombs)

  /// MAKE BOMBS
  for(var b = 0; b < arrayOfBombs.length; b++){
    makeIntoBomb(arrayOfBombs[b])
  }
  tilesToClear = numOfNonBombs

  timer('start')

} makeBoard()

function makeIntoBomb(tileIdStr){
  /// function concerns self with ONE bomb && recognizes & ignores adjacent bombs
  //make tile at index tileIdStr into bomb
  $('#' + tileIdStr).html('-1')
  // define path to check tiles around bomb
  var path = ['up', 'ur', 'right', 'dr', 'down', 'dl', 'left', 'ul']
  // start of path = @bomb
  var $targetTile = $('#' + tileIdStr)
  for(var d = 0; d < path.length; d++){ // 'd' for direction
    targetTileIdStr = traverseTiles(tileIdStr, path[d])
    $targetTile = $('#' + targetTileIdStr)
    if( !isBomb($targetTile) ){
      $targetTile.html(parseInt($targetTile.html()) + 1)
    }
  } // for( pathThroughTargets )
} // MAKE INTO BOMB ()

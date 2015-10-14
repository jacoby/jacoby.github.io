// ---------------------------------------------------------
//
// ---------------------------------------------------------
function draw() {
    var canvas  = document.getElementById("canvas");
    var ctx     = canvas.getContext("2d");
    var aFret   = new Array ;
    var aString = new Array ;
    ctx.clearRect( 0 , 0 , 900 , 120 ) ;
    var root ;
    var tab = '\t' ;
    var nl  = '\n' ;
    var sp  = ' ' ;
    
    var show  = document.getElementById('show') ;
    var sdiv  = document.getElementById("scalediv");
    var idiv  = document.getElementById("intdiv");
    var cdiv  = document.getElementById("chorddiv");
    
    sdiv.style.display = 'none' ;
    idiv.style.display = 'none' ;
    cdiv.style.display = 'none' ;
    if ( show.value == 'scale' )    sdiv.style.display = 'block' ;
    if ( show.value == 'interval' ) idiv.style.display = 'block' ; 
    if ( show.value == 'chord' )    cdiv.style.display = 'block' ;
    
    console.log( show.value )
    console.log( "interval  " +   intdiv.style.display )
    console.log( "chord     " + chorddiv.style.display )
    console.log( "scale     " + scalediv.style.display )
    console.log( "" )

    draw_neck( ctx , aFret , aString ) ;
    info() ;
    draw_dots( ctx , aFret , aString ) ;
    }
// ---------------------------------------------------------




// ---------------------------------------------------------
//
// ---------------------------------------------------------
function myColors ( ) {
    var fillStyles = [] ;
    fillStyles.push("rgb(250,250,000)") ; // 1
    fillStyles.push("rgb(250,200,000)") ; // 2
    fillStyles.push("rgb(250,150,000)") ; // 3
    fillStyles.push("rgb(250,100,000)") ; // 4
    fillStyles.push("rgb(250,000,000)") ; // 5
    fillStyles.push("rgb(200,025,075)") ; // 6
    fillStyles.push("rgb(175,050,125)") ; // 7
    fillStyles.push("rgb(150,050,200)") ; // 8
    fillStyles.push("rgb(100,050,200)") ; // 9
    fillStyles.push("rgb(050,150,200)") ; // 10
    fillStyles.push("rgb(000,250,175)") ; // 11
    fillStyles.push("rgb(100,250,100)") ; // 12
    fillStyles.push("rgb(100,020,250)") ; // 13
    return fillStyles ;
    }
// ---------------------------------------------------------




// ---------------------------------------------------------
//
// ---------------------------------------------------------
function draw_dots ( ctx , aFret , aString ) {
  ctx.strokeStyle = "rgba(255,000,000,0.9)";
  ctx.fillStyle   = "rgba(255,100,100,0.6)";
  var scratch = '' ;
  var key         = document.getElementById('key') ;
  var chord       = document.getElementById('chord') ;
  var scale       = document.getElementById('scale') ;
  var tuning      = document.getElementById('tuning') ;
  var show        = document.getElementById('show') ;
  var note        = document.getElementById('notes') ;

  var skip_1      = document.getElementById('skip_1') ;
  var skip_2      = document.getElementById('skip_2') ;
  var skip_3      = document.getElementById('skip_3') ;
  var skip_4      = document.getElementById('skip_4') ;
  var skip_5      = document.getElementById('skip_5') ;
  var skip_6      = document.getElementById('skip_6') ;
  var interval    = [] ;
 
  var i00 = document.getElementById('interval_0' ) ;
  var i01 = document.getElementById('interval_1' ) ;
  var i02 = document.getElementById('interval_2' ) ;
  var i03 = document.getElementById('interval_3' ) ;
  var i04 = document.getElementById('interval_4' ) ; 
  var i05 = document.getElementById('interval_5' ) ; 
  var i06 = document.getElementById('interval_6' ) ; 
  var i07 = document.getElementById('interval_7' ) ; 
  var i08 = document.getElementById('interval_8' ) ; 
  var i09 = document.getElementById('interval_9' ) ; 
  var i10 = document.getElementById('interval_10') ;
  var i11 = document.getElementById('interval_11') ;

  if ( i00.checked == true ) { interval.push( parseInt(  0 ) ) ; }
  if ( i01.checked == true ) { interval.push( parseInt(  1 ) ) ; }
  if ( i02.checked == true ) { interval.push( parseInt(  2 ) ) ; }
  if ( i03.checked == true ) { interval.push( parseInt(  3 ) ) ; }
  if ( i04.checked == true ) { interval.push( parseInt(  4 ) ) ; }
  if ( i05.checked == true ) { interval.push( parseInt(  5 ) ) ; }
  if ( i06.checked == true ) { interval.push( parseInt(  6 ) ) ; }
  if ( i07.checked == true ) { interval.push( parseInt(  7 ) ) ; }
  if ( i08.checked == true ) { interval.push( parseInt(  8 ) ) ; }
  if ( i09.checked == true ) { interval.push( parseInt(  9 ) ) ; }
  if ( i10.checked == true ) { interval.push( parseInt( 10 ) ) ; }
  if ( i11.checked == true ) { interval.push( parseInt( 11 ) ) ; } 

  // FRET SKIPPING
  var high        = document.getElementById('high_limit') ;
  var low         = document.getElementById('low_limit') ;
  // FRET SKIPPING

  var stringSkip = [] ;
  stringSkip.push( skip_6.checked ) ;
  stringSkip.push( skip_5.checked ) ;
  stringSkip.push( skip_4.checked ) ;
  stringSkip.push( skip_3.checked ) ;
  stringSkip.push( skip_2.checked ) ;
  stringSkip.push( skip_1.checked ) ;

  var atuning     = tuning.value.split('') ;
  var aNeck       = new Array(6) ;
  aNeck[0]        = new Array(25) ;
  aNeck[1]        = new Array(25) ;
  aNeck[2]        = new Array(25) ;
  aNeck[3]        = new Array(25) ;
  aNeck[4]        = new Array(25) ;
  aNeck[5]        = new Array(25) ;

  var achord      = [] ;
  var dchord      = [] ;
  if      ( show.value == "chord"    ) {
    achord = chord.value.split(' ') ;
    }
  else if ( show.value == "scale"    ) {
    achord = scale.value.split(' ') ;
    }
  else if ( show.value == "interval" ) {
    achord = interval ;
    }
  var achord2     = new Array ;
  
  // s for "string"
  for ( var s = 0 ; s < 6 ; s++ ) {
    aNeck[s][0] = atuning[s] ;
    // f = fret 
    for ( f = 1 ; f <= 25 ; f++ ) {
      if ( aNeck[s][f-1] == '0' ) { aNeck[s][f] = '1' ; }
      else if ( aNeck[s][f-1] == '1' ) { aNeck[s][f] = '2' ; }
      else if ( aNeck[s][f-1] == '2' ) { aNeck[s][f] = '3' ; }
      else if ( aNeck[s][f-1] == '3' ) { aNeck[s][f] = '4' ; }
      else if ( aNeck[s][f-1] == '4' ) { aNeck[s][f] = '5' ; }
      else if ( aNeck[s][f-1] == '5' ) { aNeck[s][f] = '6' ; }
      else if ( aNeck[s][f-1] == '6' ) { aNeck[s][f] = '7' ; }
      else if ( aNeck[s][f-1] == '7' ) { aNeck[s][f] = '8' ; }
      else if ( aNeck[s][f-1] == '8' ) { aNeck[s][f] = '9' ; }
      else if ( aNeck[s][f-1] == '9' ) { aNeck[s][f] = 'a' ; }
      else if ( aNeck[s][f-1] == 'a' ) { aNeck[s][f] = 'b' ; }
      else if ( aNeck[s][f-1] == 'b' ) { aNeck[s][f] = '0' ; }
      }
    }
  // We show the neck kinda upside down
  aNeck.reverse() ;

  // mark the neck 
  var trans = new Array ;
  trans.push('0') ; trans.push('1') ; trans.push('2') ; trans.push('3') ;
  trans.push('4') ; trans.push('5') ; trans.push('6') ; trans.push('7') ;
  trans.push('8') ; trans.push('9') ; trans.push('a') ; trans.push('b') ;
  trans.push('0') ; trans.push('1') ; trans.push('2') ; trans.push('3') ;
  trans.push('4') ; trans.push('5') ; trans.push('6') ; trans.push('7') ;
  trans.push('8') ; trans.push('9') ; trans.push('a') ; trans.push('b') ;

  // find the root note
  for ( i = 0 ; i < 12; i++ ) {
    if ( trans[i] == key.value ) {
      root = i ;
      }
    }
  for ( i = 0 ; i < achord.length ; i++ ) {
    newpos = parseFloat(root) + parseFloat(achord[i]) ;
    newpos = newpos % 12 ;
    if ( newpos == 10 ) { newpos = 'a' } 
    if ( newpos == 11 ) { newpos = 'b' }
    achord2.push(newpos) ;
    }

  var fillStyles = [] ;
  fillStyles = myColors() ;

  ctx.strokeStyle = "rgb(000,000,000)";
  for ( s = 0 ; s < 6 ; s++ ) {
        scratch += '#\t'+ s + '\t' ;
        scratch += stringSkip[s] ;
        scratch += '\n' ;
      if ( stringSkip[s] == false ) {
        for ( f = 0 ; f <= 25 ; f++ ) {
          var flag = 0 ;
          if ( f <= low.value ) { flag++ }
          if ( f > high.value ) { flag++ }
          if ( !flag ) {
            for ( n = 0 ; n <= achord2.length ; n++ ) {
            var offset = -2 ;
            if ( f == 0 ) offset = 1 ;
            if ( aNeck[s][f] == achord2[n] ) {
              ctx.fillStyle = fillStyles[achord[n]%12] ;
              ctx.beginPath() ;
              ctx.arc( aFret[f] + offset , aString[s] , 5 , 0 , Math.PI*2 , true );
              ctx.fill() ;
              ctx.beginPath() ;
              ctx.arc( aFret[f] + offset , aString[s] , 5 , 0 , Math.PI*2 , true );
              ctx.stroke() ;
              }
            }
          }
        }
      }
    }
  }
// ---------------------------------------------------------




// ---------------------------------------------------------
//
// ---------------------------------------------------------
function info() {
  var key         = document.getElementById('key') ;
  var show        = document.getElementById('show') ;
  var chord       = document.getElementById('chord') ;
  var scale       = document.getElementById('scale') ;
  var interval    = [] ;
 
  var i00 = document.getElementById('interval_0' ) ;
  var i01 = document.getElementById('interval_1' ) ;
  var i02 = document.getElementById('interval_2' ) ;
  var i03 = document.getElementById('interval_3' ) ;
  var i04 = document.getElementById('interval_4' ) ; 
  var i05 = document.getElementById('interval_5' ) ; 
  var i06 = document.getElementById('interval_6' ) ; 
  var i07 = document.getElementById('interval_7' ) ; 
  var i08 = document.getElementById('interval_8' ) ; 
  var i09 = document.getElementById('interval_9' ) ; 
  var i10 = document.getElementById('interval_10') ;
  var i11 = document.getElementById('interval_11') ;

  if ( i00.checked == true ) { interval.push( parseInt(  0 ) ) ; }
  if ( i01.checked == true ) { interval.push( parseInt(  1 ) ) ; }
  if ( i02.checked == true ) { interval.push( parseInt(  2 ) ) ; }
  if ( i03.checked == true ) { interval.push( parseInt(  3 ) ) ; }
  if ( i04.checked == true ) { interval.push( parseInt(  4 ) ) ; }
  if ( i05.checked == true ) { interval.push( parseInt(  5 ) ) ; }
  if ( i06.checked == true ) { interval.push( parseInt(  6 ) ) ; }
  if ( i07.checked == true ) { interval.push( parseInt(  7 ) ) ; }
  if ( i08.checked == true ) { interval.push( parseInt(  8 ) ) ; }
  if ( i09.checked == true ) { interval.push( parseInt(  9 ) ) ; }
  if ( i10.checked == true ) { interval.push( parseInt( 10 ) ) ; }
  if ( i11.checked == true ) { interval.push( parseInt( 11 ) ) ; } 

  var noteTable   = document.getElementById('noteTable') ;
      noteTable.innerHTML = '' ;
      noteTable.appendChild(document.createElement('tbody'));  
      if (noteTable.tBodies[0].rows.length > 1 ) {
        noteTable.tBodies[0].deleteRow(1) ;
        }
      noteTable.tBodies[0].appendChild(document.createElement('tr'));  

  var achord      = [] ;
  var bchord      = [] ;
  var cchord      = [] ;
  var dchord      = [] ;
  var chromatic   = [] ;
  var flag        = '' ;

  chromatic.push('C')  ;  chromatic.push('C#') ;  chromatic.push('D')  ;
  chromatic.push('D#') ;  chromatic.push('E')  ;  chromatic.push('F')  ;
  chromatic.push('F#') ;  chromatic.push('G')  ;  chromatic.push('G#') ;
  chromatic.push('A')  ;  chromatic.push('A#') ;  chromatic.push('B')  ;
  chromatic.push('C')  ;  chromatic.push('C#') ;  chromatic.push('D')  ;
  chromatic.push('D#') ;  chromatic.push('E')  ;  chromatic.push('F')  ;
  chromatic.push('F#') ;  chromatic.push('G')  ;  chromatic.push('G#') ;
  chromatic.push('A')  ;  chromatic.push('A#') ;  chromatic.push('B')  ;

  chromatic.push('C')  ;  chromatic.push('C#') ;  chromatic.push('D')  ;
  chromatic.push('D#') ;  chromatic.push('E')  ;  chromatic.push('F')  ;
  chromatic.push('F#') ;  chromatic.push('G')  ;  chromatic.push('G#') ;
  chromatic.push('A')  ;  chromatic.push('A#') ;  chromatic.push('B')  ;
  chromatic.push('C')  ;  chromatic.push('C#') ;  chromatic.push('D')  ;
  chromatic.push('D#') ;  chromatic.push('E')  ;  chromatic.push('F')  ;
  chromatic.push('F#') ;  chromatic.push('G')  ;  chromatic.push('G#') ;
  chromatic.push('A')  ;  chromatic.push('A#') ;  chromatic.push('B')  ;

  if ( show.value      == "chord"    ) {
    flag = 'chord' ;
    achord = chord.value.split(' ') ;
    }
  else if ( show.value == "scale"    ) {
    flag = 'scale' ;
    achord = scale.value.split(' ') ;
    }
  else if ( show.value == "interval" ) {
    flag = 'interval' ;
    achord = interval ;
    }
  for ( var d = 0 ; d < achord.length ; d ++ ) {
    var trans_note    = key.value ;

    if ( trans_note == 'a' ) trans_note = 10 ; 
    if ( trans_note == 'b' ) trans_note = 11 ; 
    var adjusted_note = parseInt(achord[d]) + parseInt(trans_note) ;
    bchord.push( achord[d] ) ;
    cchord.push( chromatic[ adjusted_note ] ) ;
    dchord.push( achord[d] % 12 ) ;
    }
  achord   = bchord ;
  var num  = achord.length ;
  var canvas = document.getElementById('info');
  var ctx = canvas.getContext("2d");
  var aFret   = new Array ;
  var aString = new Array ;
  ctx.clearRect( 0 , 0 , 240 , 40 ) ;
  ctx.fillStyle = "rgb(240,240,100)";
  ctx.fillRect ( 0 , 0 , 240 , 40 ); 

  var fillStyles = [] ;
  fillStyles = myColors() ;
  
  for ( var i in achord ) {
    ctx.fillStyle = fillStyles[i] ;

    ctx.beginPath() ;
    ctx.arc( 20 + (20*i) , 20 , 5 , 0 , Math.PI*2 , true );
    ctx.fill() ;

    ctx.beginPath() ;
    ctx.arc( 20 + (20*i) , 20 , 5 , 0 , Math.PI*2 , true );
    ctx.stroke() ;

    var myTD = document.createElement('td') ;
        myTD.innerHTML = cchord[i] ;  
        myTD.style.backgroundColor = fillStyles[dchord[i]] ;  
        myTD.style.border          = '1px solid black' ;  
    noteTable.tBodies[0].rows[0].appendChild(myTD);  
    }
  }
// ---------------------------------------------------------













// ---------------------------------------------------------
//
// ---------------------------------------------------------

function draw_neck ( ctx , aFret , aString ) {
  // draw the neck. perhap make a choice
  // between gibson-style rosewood with big
  // markers and this fender style?

  ctx.fillStyle = "rgb(240,240,100)"; // Maple
  //ctx.fillStyle = "rgb(77,33,11)"; // Rosewood?
  //ctx.fillStyle = "rgb(000,000,000)"; // ebony?
  ctx.fillRect ( 10 , 10 , 880 , 100 ); 

  //frets 
  ctx.fillStyle = "rgb(150,150,150)";
  xoff = 10 ;
  yoff = 10 ;
  width = 77 ;
  total = 0 ;
  ctx.fillRect ( 10 , 10 , 5 , 100 ); 
  aFret.push( 10 ) ;
  for ( var f = 0 ; f <= 23 ; f++ ) {
    total += width ;
    pos = ( total ) + xoff ;
    aFret.push( pos ) ;
    ctx.fillRect ( pos , 10 , 2 , 100 ); 
    width = width * .925 ;
    }

  // dot markers 
  ctx.fillStyle = "rgb(040,040,040)"; // black clay
//  ctx.fillStyle = "rgb(220,200,200)"; // ivory
  var dots = [] ;
  dots.push(3)  ; dots.push(5)  ; dots.push(7)  ;
  dots.push(9)  ; dots.push(12) ; dots.push(15) ;
  dots.push(17) ; dots.push(19) ; dots.push(21) ;
  dots.push(24) ;
  
  for ( var d in dots ) {
    var dot = dots[d] ;
    xPos = ( aFret[dot] + aFret[dot-1] ) / 2 ;
    if ( dot % 12 != 0 ) {
      yPos = 60 ;
      ctx.beginPath() ;
      ctx.arc( xPos , yPos , 5 , 0 , Math.PI*2 , true ) ;
      ctx.fill() ;
      }
    else {
      yPos = 30 ;
      ctx.beginPath() ;
      ctx.arc( xPos , yPos , 5 , 0 , Math.PI*2 , true ) ;
      ctx.fill() ;
      yPos = 90 ;
      ctx.beginPath() ;
      ctx.arc( xPos , yPos , 5 , 0 , Math.PI*2 , true ) ;
      ctx.fill() ;
      }
    }

  // strings
  var strokes = new Array ;
  strokes.push("rgb(190,190,190)") ; 
  strokes.push("rgb(180,180,180)") ; 
  strokes.push("rgb(160,160,160)") ; 
  strokes.push("rgb(080,080,080)") ; 
  strokes.push("rgb(040,040,040)") ; 
  strokes.push("rgb(000,000,000)") ; 
  for ( s = 0 ; s < 6 ; s++ ) {
    ctx.strokeStyle = strokes[s] ;
    ctx.beginPath() ;
    yPos = ( s * 16 ) + 20 ;
    aString.push( yPos ) ;
    ctx.moveTo(10,yPos) ;
    ctx.lineTo(890,yPos) ;
    ctx.stroke() ;
    }
  }
// ---------------------------------------------------------




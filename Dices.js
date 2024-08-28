/*
@title: Medieval Dices
@author: Lenochodik
@tags: ['multiplayer']
@addedOn: 2024-00-00
*/

// Types
// -- Dices
const dice1 = "1"
const dice2 = "2"
const dice3 = "3"
const dice4 = "4"
const dice5 = "5"
const dice6 = "6"

// -- Cursors
const cursor = "c"

// Bitmaps
setLegend(
  // -- Dices
  // TODO: make these bitmap more nice
  [ dice1, bitmap`
LLLLLLLLLLLLLLLL
L..............L
L..............L
L..............L
L..............L
L..............L
L..............L
L......00......L
L......00......L
L..............L
L..............L
L..............L
L..............L
L..............L
L..............L
LLLLLLLLLLLLLLLL` ],
  [ dice2, bitmap`
LLLLLLLLLLLLLLLL
L..............L
L..............L
L..00..........L
L..00..........L
L..............L
L..............L
L..............L
L..............L
L..............L
L..............L
L..........00..L
L..........00..L
L..............L
L..............L
LLLLLLLLLLLLLLLL` ],
  [ dice3, bitmap`
LLLLLLLLLLLLLLLL
L..............L
L..............L
L..00..........L
L..00..........L
L..............L
L..............L
L......00......L
L......00......L
L..............L
L..............L
L..........00..L
L..........00..L
L..............L
L..............L
LLLLLLLLLLLLLLLL` ],
  [ dice4, bitmap`
LLLLLLLLLLLLLLLL
L..............L
L..............L
L..00......00..L
L..00......00..L
L..............L
L..............L
L..............L
L..............L
L..............L
L..............L
L..00......00..L
L..00......00..L
L..............L
L..............L
LLLLLLLLLLLLLLLL` ],
  [ dice5, bitmap`
LLLLLLLLLLLLLLLL
L..............L
L..............L
L..00......00..L
L..00......00..L
L..............L
L..............L
L......00......L
L......00......L
L..............L
L..............L
L..00......00..L
L..00......00..L
L..............L
L..............L
LLLLLLLLLLLLLLLL` ],
  [ dice6, bitmap`
LLLLLLLLLLLLLLLL
L..............L
L..............L
L..00......00..L
L..00......00..L
L..............L
L..............L
L..00......00..L
L..00......00..L
L..............L
L..............L
L..00......00..L
L..00......00..L
L..............L
L..............L
LLLLLLLLLLLLLLLL` ],
  // -- Cursor
  [ cursor, bitmap`
................
................
.......CC.......
......CCCC......
.....CCCCCC.....
....CC.CC.CC....
....C..CC..C....
.......CC.......
.......CC.......
.......CC.......
.......CC.......
.......CC.......
.......CC.......
.......CC.......
................
................` ]
)
setSolids([])
setPushables({})

// Levels
let level = 0
const levels = [
  map`
..........
..........
..123456..
..c.......
..........
..........
..........
..........`
]
setMap(levels[level])

// Tunes
const tuneCursorMove = tune`
500: C5^500,
15500`
const tuneCursorMoveForbidden = tune`
500: A4~500 + G4~500 + B4~500,
15500`

// Constants
const cursorBoundsX = {
  // both inclusive
  min: 2,
  max: 7,
}

// Objects
const cursorObject = getFirst(cursor)

// Inputs
onInput("a", () => {
  // Check bounds
  if(cursorObject.x <= cursorBoundsX.min) {
    playTune(tuneCursorMoveForbidden)
    return
  }
  
  cursorObject.x--
  playTune(tuneCursorMove)
})
onInput("d", () => {
  // Check bounds
  if(cursorObject.x >= cursorBoundsX.max) {
    playTune(tuneCursorMoveForbidden)
    return
  }

  cursorObject.x++
  playTune(tuneCursorMove)
})

afterInput(() => {
  
})

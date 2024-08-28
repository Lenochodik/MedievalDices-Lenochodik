/*
@title: Medieval Dices
@author: Lenochodik
@tags: ['multiplayer']
@addedOn: 2024-00-00
*/

// = Helper functions ==============================
// -- Random
// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
const minCeiled = Math.ceil(min)
const maxFloored = Math.floor(max)
return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}
  
function getRandomItem(arr) {
return arr[getRandomInt(0, arr.length)]
}

// -- Sprig
function addSpriteWithReturn(x, y, spriteType) {
    addSprite(x, y, spriteType)
    return getAll(spriteType).at(-1) // Little bit hacky, but should work
}

// -- Dices
function getDiceIndex(diceType) {
    const isDiceSelected = selectedDiceCategory.includes(diceType)
    const categoryToSearch = isDiceSelected ? selectedDiceCategory : diceCategory
    return categoryToSearch.indexOf(diceType)
}
// =================================================

// = Types =========================================
// -- Dices
const dice1 = "1"
const dice2 = "2"
const dice3 = "3"
const dice4 = "4"
const dice5 = "5"
const dice6 = "6"

const selectedDice1 = "!"
const selectedDice2 = "@"
const selectedDice3 = "#"
const selectedDice4 = "$"
const selectedDice5 = "%"
const selectedDice6 = "^"


// -- Cursors
const cursor = "c"
// =================================================

// = Type categories ===============================
const diceCategory = [dice1, dice2, dice3, dice4, dice5, dice6]
const selectedDiceCategory = [selectedDice1, selectedDice2, selectedDice3, selectedDice4, selectedDice5, selectedDice6]
// =================================================

// = Legends, solids, pushables ====================
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
  [ selectedDice1, bitmap`
6666666666666666
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6......00......6
6......00......6
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6666666666666666` ],
  [ selectedDice2, bitmap`
6666666666666666
6..............6
6..............6
6..00..........6
6..00..........6
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6..........00..6
6..........00..6
6..............6
6..............6
6666666666666666` ],
  [ selectedDice3, bitmap`
6666666666666666
6..............6
6..............6
6..00..........6
6..00..........6
6..............6
6..............6
6......00......6
6......00......6
6..............6
6..............6
6..........00..6
6..........00..6
6..............6
6..............6
6666666666666666` ],
  [ selectedDice4, bitmap`
6666666666666666
6..............6
6..............6
6..00......00..6
6..00......00..6
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6..00......00..6
6..00......00..6
6..............6
6..............6
6666666666666666` ],
  [ selectedDice5, bitmap`
6666666666666666
6..............6
6..............6
6..00......00..6
6..00......00..6
6..............6
6..............6
6......00......6
6......00......6
6..............6
6..............6
6..00......00..6
6..00......00..6
6..............6
6..............6
6666666666666666` ],
  [ selectedDice6, bitmap`
6666666666666666
6..............6
6..............6
6..00......00..6
6..00......00..6
6..............6
6..............6
6..00......00..6
6..00......00..6
6..............6
6..............6
6..00......00..6
6..00......00..6
6..............6
6..............6
6666666666666666` ],
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
// =================================================

// = Levels ========================================
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

const gameState = {
    currentPlayer: 0,
    players: [
        {
            name: "Player 1",
            score: 0,
        },
        {
            name: "Player 2",
            score: 0,
        }
    ],
    currentTurnScore: 0,
    winningScore: 4000,
}
// =================================================

// = Melodies, sounds ==============================
const tuneCursorMove = tune`
500: C5~500,
15500`
const tuneCursorMoveForbidden = tune`
500: A4~500 + G4~500 + B4~500,
15500`
// =================================================

// = Constants =====================================
const cursorBoundsX = {
  // both inclusive
  min: 2,
  max: 7,
}
// =================================================

// = Objects =======================================
const cursorObject = getFirst(cursor)
// =================================================

// = Inputs ========================================
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

// -- Select/deselect current dice
onInput("k", () => {
    // Get cursor position
    const cursorX = cursorObject.x
    const cursorY = cursorObject.y

    // Get current dice (above cursor)
    const diceObject = getTile(cursorX, cursorY - 1)[0]
    const isDiceSelected = selectedDiceCategory.includes(diceObject.type)
    const diceIndex = getDiceIndex(diceObject.type)

    // Select/deselect dice
    diceObject.type = isDiceSelected ? diceCategory[diceIndex] : selectedDiceCategory[diceIndex]
})
// =================================================

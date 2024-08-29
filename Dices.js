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
.00000000000000.
0011111111111100
0111111222222110
0111111111111210
0111111111111210
0111111111111210
0111111111111210
0L11111001111210
0L1111L001111110
0L1111LL11111110
0L11111111111110
0L11111111111110
0L11111111111110
0L11111111111110
00LLLLLLL1111100
.00000000000000.` ],
  [ dice2, bitmap`
.00000000000000.
0011111111111100
0111111222222110
0110011111111210
01L0011111111210
01LL111111111210
0111111111111210
0L11111111111210
0L11111111111210
0L11111111111110
0L11111111111110
0L11111111100110
0L11111111L00110
0L11111111LL1110
00LLLLLLL1111100
.00000000000000.` ],
  [ dice3, bitmap`
.00000000000000.
0011111111111100
0111111122222210
0110011111111210
01L0011111111210
01LL111111111210
0111111111111210
0L11111001111210
0L1111L001111110
0L1111LL11111110
0L11111111111110
0L11111111100110
0L11111111L00110
0L11111111LL1110
00LLLLLLL1111100
.00000000000000.` ],
  [ dice4, bitmap`
.00000000000000.
0011111111111100
0111111122222210
0110011111100210
01L0011111L00210
01LL111111LL1210
0111111111111210
0L11111111111210
0L11111111111110
0L11111111111110
0L11111111111110
0L10011111100110
0LL0011111L00110
0LLL111111LL1110
00LLLLLLL1111100
.00000000000000.` ],
  [ dice5, bitmap`
.00000000000000.
0011111111111100
0111111122222210
0110011111100210
01L0011111L00210
01LL111111LL1210
0111111111111210
0L11111001111210
0L1111L001111110
0L1111LL11111110
0L11111111111110
0L10011111100110
0LL0011111L00110
0LLL111111LL1110
00LLLLLLL1111100
.00000000000000.` ],
  [ dice6, bitmap`
.00000000000000.
0011111111111100
0111111122222210
0110011001100210
01L001L001L00210
01LL11LL11LL1210
0111111111111210
0L11111111111210
0L11111111111110
0L11111111111110
0L11111111111110
0L10011001100110
0LL001L001L00110
0LLL11LL11LL1110
00LLLLLLL1111100
.00000000000000.` ],
[ selectedDice1, bitmap`
.33333333333333.
3311111111111133
3111111222222113
3111111111111213
3111111111111213
3111111111111213
3111111111111213
3L11111001111213
3L1111L001111113
3L1111LL11111113
3L11111111111113
3L11111111111113
3L11111111111113
3L11111111111113
33LLLLLLL1111133
.33333333333333.` ],
[ selectedDice2, bitmap`
.33333333333333.
3311111111111133
3111111222222113
3110011111111213
31L0011111111213
31LL111111111213
3111111111111213
3L11111111111213
3L11111111111213
3L11111111111113
3L11111111111113
3L11111111100113
3L11111111L00113
3L11111111LL1113
33LLLLLLL1111133
.33333333333333.` ],
   [ selectedDice3, bitmap`
.33333333333333.
3311111111111133
3111111122222213
3110011111111213
31L0011111111213
31LL111111111213
3111111111111213
3L11111001111213
3L1111L001111113
3L1111LL11111113
3L11111111111113
3L11111111100113
3L11111111L00113
3L11111111LL1113
33LLLLLLL1111133
.33333333333333.` ],
   [ selectedDice4, bitmap`
.33333333333333.
3311111111111133
3111111122222213
3110011111100213
31L0011111L00213
31LL111111LL1213
3111111111111213
3L11111111111213
3L11111111111113
3L11111111111113
3L11111111111113
3L10011111100113
3LL0011111L00113
3LLL111111LL1113
33LLLLLLL1111133
.33333333333333.` ],
    [ selectedDice5, bitmap`
.33333333333333.
3311111111111133
3111111122222213
3110011111100213
31L0011111L00213
31LL111111LL1213
3111111111111213
3L11111001111213
3L1111L001111113
3L1111LL11111113
3L11111111111113
3L10011111100113
3LL0011111L00113
3LLL111111LL1113
33LLLLLLL1111133
.33333333333333.` ],
    [ selectedDice6, bitmap`
.33333333333333.
3311111111111133
3111111122222213
3110011001100213
31L001L001L00213
31LL11LL11LL1213
3111111111111213
3L11111111111213
3L11111111111113
3L11111111111113
3L11111111111113
3L10011001100113
3LL001L001L00113
3LLL11LL11LL1113
33LLLLLLL1111133
.33333333333333.` ],
  // -- Cursor
  [ cursor, bitmap`
................
.......LL.......
......L1LL......
.....L1L11L.....
....LLLLLLLL....
.......C9.......
.......9C.......
.......C9.......
.......9C.......
.......C9.......
.......9C.......
......1991......
.....1L9CL1.....
.....1L00L1.....
....1L0..0L1....
....1L0..0L1....` ]
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

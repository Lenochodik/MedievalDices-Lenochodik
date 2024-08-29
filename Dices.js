/*
@title: Medieval Dice
@author: Lenochodik
@tags: ['multiplayer']
@addedOn: 2024-00-00
*/

// = Constants =====================================
const CURSOR_BOUNDS_X = {
  // both inclusive
  min: 2,
  max: 7,
}

const PLAYER_1 = 0
const PLAYER_2 = 1

const DICES_Y = 3
// =================================================

// = Helper functions ==============================
// -- Delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

// -- Game UI
function drawAllText() {
  clearText()

  // HELP
  addText(" J - pass, L - roll", {
    x: 0,
    y: 15,
    color: color`1`
  })
  addText("Kept", {
    x: 0,
    y: 4,
    color: color`1`
  })
  addText("Roll", {
    x: 0,
    y: 7,
    color: color`1`
  })

  // Top player info
  addText(gameState.players[PLAYER_1].name, {
    x: 12,
    y: 1,
    color: color`3`
  })
  addText(`Total: ${gameState.players[PLAYER_1].score}/${gameState.winningScore}`, {
    x: 0,
    y: 0,
    color: color`0`
  })
  if (gameState.currentPlayer === PLAYER_1) {
    addText("UR turn", {
      x: 12,
      y: 2,
      color: color`3`
    })
    addText(`Turn:  ${gameState.currentTurnScore}`, {
      x: 0,
      y: 1,
      color: color`0`
    })
    addText(`Slctd: ${calcDiceScore(getAllSelectedDices()).score}`, {
      x: 0,
      y: 2,
      color: color`0`
    })
  }

  // Bottom player info
  addText(gameState.players[PLAYER_2].name, {
    x: 12,
    y: 13,
    color: color`5`
  })
  addText(`Total: ${gameState.players[PLAYER_2].score}/${gameState.winningScore}`, {
    x: 0,
    y: 12,
    color: color`0`
  })
  if (gameState.currentPlayer === PLAYER_2) {
    addText("UR turn", {
      x: 12,
      y: 14,
      color: color`5`
    })
    addText(`Turn:  ${gameState.currentTurnScore}`, {
      x: 0,
      y: 13,
      color: color`0`
    })
    addText(`Slctd: ${calcDiceScore(getAllSelectedDices()).score}`, {
      x: 0,
      y: 14,
      color: color`0`
    })
  }

  // Winner!
  if (gameState.isGameOver)
    addText(`   ${gameState.players[gameState.currentPlayer].name} won!\n Press i to start`, {
      x: 1,
      y: 9,
      color: color`D`
    })
}

// -- Players
function swapPlayer() {
  gameState.currentPlayer = gameState.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1
}

// -- Dices
async function randomRoll() {
  let dicesToRoll = getAllDicesToRoll()

  if (!dicesToRoll.length)
    moveAllKeptDicesBack()

  dicesToRoll = getAllDicesToRoll()

  for (const diceObject of dicesToRoll) {
    // TODO: animate roll
    const newDiceType = getRandomItem(diceCategory)
    diceObject.type = newDiceType
  }

  await checkForSomeScore()
}

async function checkForSomeScore() {
  // Check if there is any score at all
  const { score: scoreForCheck } = calcDiceScore(getAllDicesToRoll())

  // If there is no score, switch to next player without adding score to current player
  if (scoreForCheck === 0) {
    gameState.currentTurnScore = 0

    playTune(tuneTooBadNoScore)

    await delay(2500)

    swapPlayer()
    moveAllKeptDicesBack()
    drawAllText()
    await randomRoll()
  }
}

async function keepSelectedDices() {
  const selectedDices = getAllSelectedDices()
  const { unusedDices } = calcDiceScore(selectedDices)

  for (const diceObject of selectedDices) {
    const diceIndex = getDiceIndex(diceObject.type)
    const diceNumber = diceIndex + 1

    // If dice is not used, leave it
    if (unusedDices[diceNumber] >= 1) {
      unusedDices[diceNumber]--
      diceObject.type = diceCategory[diceIndex]
    }
    // Move dice up as player keeps it
    else {
      diceObject.y--
      diceObject.type = diceCategory[diceIndex]
    }

    await delay(250)
  }
}

function moveAllKeptDicesBack() {
  const keptDices = getAllKeptDices()

  for (const diceObject of keptDices)
    diceObject.y++
}

function getAllKeptDices() {
  let dices = []
  for (let x = CURSOR_BOUNDS_X.min; x <= CURSOR_BOUNDS_X.max; x++) {
    const tileSprites = getTile(x, DICES_Y - 1)
    if (!tileSprites.length)
      continue
    dices.push(tileSprites[0])
  }
  return dices
}

function getAllDicesToRoll() {
  let dices = []
  for (let x = CURSOR_BOUNDS_X.min; x <= CURSOR_BOUNDS_X.max; x++) {
    const tileSprites = getTile(x, DICES_Y)
    if (!tileSprites.length)
      continue
    dices.push(tileSprites[0])
  }
  return dices
}

function getAllSelectedDices() {
  let selected = []

  for (const diceType of selectedDiceCategory)
    selected = [...selected, ...getAll(diceType)]

  selected.sort((a, b) => a.x - b.x) // Sort by x position (for animations)

  return selected
}

function getDiceIndex(diceType) {
  const isDiceSelected = selectedDiceCategory.includes(diceType)
  const categoryToSearch = isDiceSelected ? selectedDiceCategory : diceCategory
  return categoryToSearch.indexOf(diceType)
}

function calcDiceScore(dices) {
  const selectedNumbers = dices.map(dice => getDiceIndex(dice.type) + 1)
  selectedNumbers.sort()

  // Count occurences of each number
  const occurences = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  }
  selectedNumbers.forEach(number => occurences[number]++)

  // Calculate score
  let score = 0

  // Check for special cases 1-2-3-4-5-6
  if (occurences[1] >= 1 && occurences[2] >= 1 && occurences[3] >= 1 && occurences[4] >= 1 && occurences[5] >= 1 && occurences[6] >= 1) {
    score = 1500

    occurences[1]--
    occurences[2]--
    occurences[3]--
    occurences[4]--
    occurences[5]--
    occurences[6]--
  }

  // 1-2-3-4-5
  if (occurences[1] >= 1 && occurences[2] >= 1 && occurences[3] >= 1 && occurences[4] >= 1 && occurences[5] >= 1) {
    score = 500

    occurences[1]--
    occurences[2]--
    occurences[3]--
    occurences[4]--
    occurences[5]--
  }

  // 2-3-4-5-6
  if (occurences[2] >= 1 && occurences[3] >= 1 && occurences[4] >= 1 && occurences[5] >= 1 && occurences[6] >= 1) {
    score = 750

    occurences[2]--
    occurences[3]--
    occurences[4]--
    occurences[5]--
    occurences[6]--
  }

  // Go by numbers
  for (let number = 1; number <= 6; number++) {
    const occurence = occurences[number]

    // Prepare base for 3,4,5,6-of-a-kind
    const base = (number === 1 ? 10 : number) * 100

    // 6-of-a-kind
    if (occurence === 6) {
      score += base * 8
      occurences[number] = 0
    }
    // 5-of-a-kind
    else if (occurence === 5) {
      score += base * 4
      occurences[number] = 0
    }
    // 4-of-a-kind
    else if (occurence === 4) {
      score += base * 2
      occurences[number] = 0
    }
    // 3-of-a-kind
    else if (occurence === 3) {
      score += base
      occurences[number] = 0
    }
    // 2-of-a-kind only for 1 and 5 (so we don't need to repeat 1-of-a-kind twice)
    else if (occurence === 2) {
      if (number === 1) {
        score += 2 * 100
        occurences[number] = 0
      } else if (number === 5) {
        score += 2 * 50
        occurences[number] = 0
      }
    }
    // 1-of-a-kind only for 1 and 5
    else if (occurence === 1) {
      if (number === 1) {
        score += 100
        occurences[number] = 0
      } else if (number === 5) {
        score += 50
        occurences[number] = 0
      }
    }
  }


  return {
    score: score,
    unusedDices: occurences
  }
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
  [dice1, bitmap`
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
.00000000000000.`],
  [dice2, bitmap`
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
.00000000000000.`],
  [dice3, bitmap`
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
.00000000000000.`],
  [dice4, bitmap`
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
.00000000000000.`],
  [dice5, bitmap`
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
.00000000000000.`],
  [dice6, bitmap`
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
.00000000000000.`],
  [selectedDice1, bitmap`
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
.33333333333333.`],
  [selectedDice2, bitmap`
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
.33333333333333.`],
  [selectedDice3, bitmap`
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
.33333333333333.`],
  [selectedDice4, bitmap`
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
.33333333333333.`],
  [selectedDice5, bitmap`
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
.33333333333333.`],
  [selectedDice6, bitmap`
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
.33333333333333.`],
  // -- Cursor
  [cursor, bitmap`
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
....1L0..0L1....`]
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
..........
..123456..
..c.......
..........
..........
..........`
]

const initialGameState = {
  isGameOver: false,
  currentPlayer: PLAYER_1,
  players: [{
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

let gameState = JSON.parse(JSON.stringify(initialGameState))

let cursorObject = getFirst(cursor)

async function newGame() {
  setMap(levels[level])
  gameState = JSON.parse(JSON.stringify(initialGameState))
  cursorObject = getFirst(cursor)

  drawAllText()

  await randomRoll()
}
newGame()
// =================================================

// = Melodies, sounds ==============================
const tuneCursorMove = tune`
500: C5~500,
15500`
const tuneCursorMoveForbidden = tune`
500: A4~500 + G4~500 + B4~500,
15500`

const tuneCursorSelect = tune`
375: C5/375,
11625`
const tuneCursorDeselect = tune`
375: A4/375,
11625`

const tuneTooBadNoScore = tune`
187.5: C5^187.5 + E5~187.5,
187.5: B4^187.5 + D5~187.5,
187.5: A4^187.5 + C5~187.5,
187.5: G4^187.5 + B4~187.5,
187.5: F4^187.5 + A4~187.5,
187.5: E4^187.5 + G4~187.5,
187.5: D4^187.5 + F4~187.5,
187.5: C4^187.5 + E4~187.5,
4500`

const tuneYouWin = tune`
187.5: E5/187.5 + C4~187.5,
187.5: E5/187.5 + E4^187.5 + C4-187.5,
187.5: E5/187.5 + C4~187.5,
187.5: E4^187.5 + C4-187.5,
187.5: C4~187.5,
187.5: G5/187.5 + E4^187.5 + C4-187.5,
187.5: E5/187.5 + C4~187.5,
187.5: G5/187.5 + E4^187.5 + C4-187.5,
187.5: E5/187.5 + C4~187.5,
187.5: E4^187.5 + C4-187.5,
187.5: C4~187.5,
187.5: B5/187.5 + E4^187.5 + C4-187.5,
187.5: B5/187.5 + C4~187.5,
187.5: B5/187.5 + E4^187.5 + C4-187.5,
187.5: B5/187.5 + C4~187.5,
187.5: A5/187.5 + E4^187.5 + C4-187.5,
187.5: A5/187.5 + C4~187.5,
187.5: G5/187.5 + E4^187.5 + C4-187.5,
187.5: G5/187.5 + C4~187.5,
187.5: E4^187.5 + C4-187.5,
187.5: B5/187.5 + C4~187.5,
187.5: E4^187.5 + C4-187.5 + B5/187.5,
1875`
// =================================================

// = Inputs ========================================
onInput("a", () => {
  if (gameState.isGameOver) return

  // Check bounds
  if (cursorObject.x <= CURSOR_BOUNDS_X.min) {
    playTune(tuneCursorMoveForbidden)
    return
  }

  cursorObject.x--
  playTune(tuneCursorMove)
})

onInput("d", () => {
  if (gameState.isGameOver) return

  // Check bounds
  if (cursorObject.x >= CURSOR_BOUNDS_X.max) {
    playTune(tuneCursorMoveForbidden)
    return
  }

  cursorObject.x++
  playTune(tuneCursorMove)
})

// -- Select/deselect current dice
onInput("k", () => {
  if (gameState.isGameOver) return

  // Get cursor position
  const cursorX = cursorObject.x
  const cursorY = cursorObject.y

  // Get current dice (above cursor)
  const diceTile = getTile(cursorX, cursorY - 1)

  if (diceTile.length === 0) {
    playTune(tuneCursorMoveForbidden)
    return
  }

  const diceObject = diceTile[0]
  const isDiceSelected = selectedDiceCategory.includes(diceObject.type)
  const diceIndex = getDiceIndex(diceObject.type)

  // Select/deselect dice
  diceObject.type = isDiceSelected ? diceCategory[diceIndex] : selectedDiceCategory[diceIndex]

  playTune(isDiceSelected ? tuneCursorDeselect : tuneCursorSelect)

  drawAllText()
})

// -- Keep selected dices
onInput("j", async () => {
  if (gameState.isGameOver) return

  const selectedDices = getAllSelectedDices()
  const { score } = calcDiceScore(selectedDices)

  // Player must keep some score
  if (score === 0)
    return

  await keepSelectedDices()

  // Add score to current player and switch to next player (if is not winning)
  gameState.players[gameState.currentPlayer].score += gameState.currentTurnScore + score
  gameState.currentTurnScore = 0

  if (gameState.players[gameState.currentPlayer].score >= gameState.winningScore) {
    playTune(tuneYouWin)
    gameState.isGameOver = true
    cursorObject.remove()
    drawAllText()
    return
  }

  // Random roll for next player
  swapPlayer()
  moveAllKeptDicesBack()
  await randomRoll()

  drawAllText()
})

// -- Roll dices
onInput("l", async () => {
  if (gameState.isGameOver) return

  const selectedDices = getAllSelectedDices()
  const { score } = calcDiceScore(selectedDices)

  // Player must keep some score
  if (score === 0)
    return

  await keepSelectedDices()

  // Add score to current turn score
  gameState.currentTurnScore += score

  await randomRoll()

  drawAllText()
})

// -- Restart game
onInput("i", () => {
  if (!gameState.isGameOver) return

  newGame()
})
// =================================================

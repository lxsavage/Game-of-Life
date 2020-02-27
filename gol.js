/**
 * John H. Conway's Game of Life: Logic functions
 * Created by Logan Savage
 *
 * Requires prior inclusion of `gol_rle.js`, `gol_io.js`
 *
 * Licensed under the CC-BY-SA license
 * =================================================================================
 * Rules for Life:
 * 1) A cell dies if alive and has less than 2 neighbors, as through underpopulation
 * 2) A cell lives on if there is 2 or 3 neighbors
 * 3) A cell dies if alive and has more than 3 neighbors, as through overpopulation
 * 4) A cell comes to life if there are exactly 3 neighbors, as through reproduction
 */
'use strict';

//=================================================================================
// View Constants

// In frames per second
const FRAMERATE = 15;

// In px
const WIDTH = innerWidth,
      HEIGHT = innerHeight;

const CELL_ROW_COUNT = Math.floor(HEIGHT / 3),
      CELL_COLUMN_COUNT = Math.floor(WIDTH / 3);

//=================================================================================
// Color Constants

const DEAD_COLOR = '#323232',
      LIVE_COLOR = '#fff',
      TEXT_COLOR = '#000',
      UI_COLOR = 'rgba(255, 255, 255, .5)';

//=================================================================================
// UI Constants

const CONTROLS_TEXT = 'Controls:\n' +
  'p/[SPACE] Pause\n' +
  'R Reset\n' +
  'A Reset (randomize board)\n' +
  'g Toggle gridlines\n' +
  's Toggle generation UI\n' +
  'C Toggle Controls UI';

//=================================================================================
// States

let s_showGenerations = false,
    s_gridLines = false,
    s_paused = false,
    s_showControls = false,
    s_mouseDown = false,
    s_write = false;

// Calculated constants
let CELL_HEIGHT,
    CELL_WIDTH;

// Simulation variables
let cells,
    nextCells,
    generation;

//=================================================================================
// Initialization

/* Initialize the matrix of cells to random Boolean values */
function generateGrid(willRandomize) {
  let generatedGrid = new Array(CELL_ROW_COUNT);
  for (let r = 0; r < generatedGrid.length; r++) {
    generatedGrid[r] = new Array(CELL_COLUMN_COUNT);
    for (let c = 0; c < generatedGrid[r].length; c++) {
      if (willRandomize) {
        generatedGrid[r][c] = Math.round(Math.random()) == 1;
      }
      else {
        generatedGrid[r][c] = false;
      }
    }
  }

  return generatedGrid;
}

function initBoardSize() {
  CELL_WIDTH = Math.round(WIDTH / CELL_COLUMN_COUNT);
  CELL_HEIGHT = Math.round(HEIGHT / CELL_ROW_COUNT);
}

function resetBoard(willRand) {
  cells = generateGrid(willRand);
  generation = 1;
}

//=================================================================================
// Logic

// Returns [row, column]
function getClickedTile(mX, mY) {
  return [
    Math.floor(mY / CELL_HEIGHT),
    Math.floor(mX / CELL_WIDTH)
  ];
};

// Creates the next board, then swaps it with the current
function checkCells() {
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[0].length; c++) {
      let liveNeighborCount = calculateLiveNeighbors(r, c);
      nextCells[r][c] = cells[r][c]
        ? !(liveNeighborCount < 2 || liveNeighborCount > 3)
        : liveNeighborCount === 3;
    }
  }

  // Swap the next board with the current board, increment the generation
  let temp = cells;
  cells = nextCells;
  nextCells = temp;
  generation++;
}

function calculateLiveNeighbors(r, c) {
  let liveNeighbors = 0;

  for (let row = r - 1; row <= r + 1; row++) {
    for (let column = c - 1; column <= c + 1; column++) {
      let rp = row;
      let cp = column;

      // Map as torotoidal matrix
      if (row >= cells.length) {
        rp = row % cells.length;
      }
      else if (row < 0) {
        rp = cells.length + row;
      }

      if (column >= cells[0].length) {
        cp = column % cells[0].length;
      }
      else if (column < 0) {
        cp = cells[0].length + column;
      }

      if (cells[rp] === undefined) {
        console.log(rp);
      }
      // Test cell value
      if ((rp !== r || cp !== c) && cells[rp][cp]) {
        liveNeighbors++;
      }
    }
  }

  return liveNeighbors;
}

//=================================================================================
// I/O

function placementAction(mX, mY) {
  if (s_mouseDown) {
    let pos = getClickedTile(mX, mY);
    if (pos[0] >= 0 && pos[0] < cells.length && pos[1] >= 0 && pos[1] < cells[0].length) {
      cells[pos[0]][pos[1]] = s_write;
    }
  }
}
function mouseAction(mouseDown, mX, mY) {
  if (mouseDown) {
    s_mouseDown = true;
    // Set the writing state
    let pos = getClickedTile(mX, mY);
    s_write = !cells[pos[0]][pos[1]];
  }
  else {
    s_mouseDown = false;
  }
}

function keyboardAction(keyCode, eventKey) {
  if (keyCode === 32 || eventKey === 'p') {
    s_paused = !s_paused
  }
  switch (eventKey) {
    case 'g':
      s_gridLines = !s_gridLines;
      break;
    case 's':
      s_showGenerations = !s_showGenerations;
      break;
    case 'C':
      s_showControls = !s_showControls;
      break;
    case 'R':
      resetBoard();
      break;
    case 'A':
      resetBoard(true);
      break;
    case 'S':
      saveStringAsFile(RLE.encode(cells), 'rle');
      break;
  }
}

function loadBoard(rle) {
  let newBoard = RLE.decode(rle);
  let minR = cells.length < newBoard.length
    ? cells.length
    : newBoard.length;
  let minC = cells[0].length < newBoard[0].length
    ? cells[0].length
    : newBoard[0].length;

  for (let r = 0; r < minR; r++) {
    for (let c = 0; c < minC; c++) {
      cells[r][c] = newBoard[r][c];
    }
  }
  generation = 1;
}

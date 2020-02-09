/**
 * John H. Conway's Game of Life
 * Created by Logan Savage
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
const WIDTH = 1200,
      HEIGHT = 800;

const CELL_ROW_COUNT = Math.round(HEIGHT / 2),
      CELL_COLUMN_COUNT = Math.round(WIDTH / 2);

//=================================================================================
// Color Constants

const DEAD_SHADE = 50,
      LIVE_SHADE = 255;

//=================================================================================
// UI Constants

const CONTROLS_TEXT = 'Controls:\n' +
  'P Pause\n' +
  'R Reset\n' +
  'G Toggle gridlines\n' +
  'S Toggle generation UI\n' +
  'C Toggle Controls UI';

//=================================================================================
// States

let s_showGenerations = true,
    s_gridLines = false,
    s_paused = false,
    s_showControls = true;

// Calculated constants
let CELL_HEIGHT,
    CELL_WIDTH;

// Simulation variables
let cells,
    nextCells,
    generation;

//=================================================================================
// Main functions

function setup() {
  nextCells = generateGrid();
  resetBoard();
  createCanvas(WIDTH, HEIGHT);
  frameRate(FRAMERATE);
  initBoardSize();
}

function draw() {
  background(DEAD_SHADE);
  drawCells();

  if (!s_paused) checkCells();
  else {
    background(255, 255, 255, 100);
    fill(0);
    textAlign(CENTER, TOP);
    text('P A U S E D', width / 2, height / 2);
    textAlign(LEFT, BASELINE);
  }

  if (s_showGenerations) {
    fill(255, 255, 255, 100);
    rect(0, 0, width, 40)
    fill(0, 0, 0);
    noStroke();
    textSize(30);
    text(`Generation: ${generation}`, 10, 30);
  }

  if (s_showControls) {
    fill(255, 255, 255, 100);
    rect(0, 40, width / 3.5, height - 40);
    fill(0);
    text(CONTROLS_TEXT, 10, 65);
  }
}

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
        generatedGrid[r][c] = true;
      }
    }
  }

  return generatedGrid;
}

function initBoardSize() {
  CELL_WIDTH = width / CELL_COLUMN_COUNT;
  CELL_HEIGHT = height / CELL_ROW_COUNT;
}

function resetBoard() {
  cells = generateGrid(true);
  generation = 1;
}

//=================================================================================
// Logic

// Returns [row, column]
const GET_CLICKED_TILE = (mouse) => [
  Math.floor(mouse[1] / CELL_HEIGHT),
  Math.floor(mouse[0] / CELL_WIDTH)
];

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
      if (row >= CELL_ROW_COUNT) {
        rp = row % CELL_ROW_COUNT;
      }
      else if (row < 0) {
        rp = CELL_ROW_COUNT + row;
      }

      if (column >= CELL_COLUMN_COUNT) {
        cp = column % CELL_COLUMN_COUNT;
      }
      else if (column < 0) {
        cp = CELL_COLUMN_COUNT + column;
      }

      if (
        (rp !== r || cp !== c) && // Not the center (the tile being tested)
        cells[rp][cp]             // The tile's value (increment if true)
      ) {
        liveNeighbors++;
      }
    }
  }

  return liveNeighbors;
}

//=================================================================================
// I/O

function keyPressed() {
  switch (key) {
    case 'p':
      s_paused = !s_paused;
      break;
    case 'g':
      s_gridLines = !s_gridLines;
      break;
    case 's':
      s_showGenerations = !s_showGenerations;
      break;
    case 'c':
      s_showControls = !s_showControls;
      break;
    case 'r':
      resetBoard();
      break;
  }
}

//=================================================================================
// Drawing

function drawCells() {
  noStroke();
  fill(LIVE_SHADE);
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[0].length; c++) {
      if (cells[r][c]) {
        rect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
  if (s_gridLines) {
    stroke(0);
    for (let r = 0; r < cells.length; r++) {
      line(0, r * CELL_HEIGHT, width, r * CELL_HEIGHT);
    }
    for (let c = 0; c < cells[0].length; c++) {
      line(c * CELL_WIDTH, 0, c * CELL_WIDTH, height);
    }
  }
}

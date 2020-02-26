/**
 * John H. Conway's Game of Life: Renderer/IO Controller (p5.js)
 * Created by Logan Savage
 *
 * Requires prior inclusion of `gol_rle.js`, `gol.js`, `gol_io.js`, `p5.min.js`
 *
 * Licensed under the CC-BY-SA license
 * =================================================================================
 * To reimplement this in a different drawing library (or none), reimplement all the
 * functions shown here.
 */
'use strict';

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
  placementAction(mouseX, mouseY);
  background(DEAD_SHADE);
  drawCells();

  if (!s_paused) checkCells();
  else background(255, 255, 255, 100);

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
    rect(0, 40, 400, height - 40);
    fill(0);
    textSize(30);
    text(CONTROLS_TEXT, 10, 65);
  }
}

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

//=================================================================================
// I/O

function keyPressed() {
  keyboardAction(keyCode, key);
}

function mousePressed() {
  mouseAction(true, mouseX, mouseY);
}

function mouseReleased() {
  mouseAction(false);
}

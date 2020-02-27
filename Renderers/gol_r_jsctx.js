/**
 * John H. Conway's Game of Life: Renderer/IO Controller (No library, HTML5 Canvas API)
 * Created by Logan Savage
 *
 * Requires prior inclusion of `gol_rle.js`, `gol.js`, `gol_io.js`
 *
 * Licensed under the CC-BY-SA license
 * =================================================================================
 * To reimplement this in a different drawing library (or none), reimplement all the
 * functions shown here.
 */
'use strict';

let mousePos = { x: 0, y: 0 };

const TXT_FNT = '30px sans-serif';

// Initialize board
nextCells = generateGrid();
resetBoard();
initBoardSize();

// Create canvas
let canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.id = 'gol_cnv';
document.body.appendChild(canvas);

// Fix blurring
const cnv = document.getElementById('gol_cnv');
cnv.width = cnv.offsetWidth;
cnv.height = cnv.offsetHeight;

// Get a 2d context of the canvas
const ctx = cnv.getContext('2d');
ctx.font = TXT_FNT;

// Start the game loop
let sk_int = setInterval(draw, 1000 / FRAMERATE);

// For stopping the game loop
const sk_stop = () => clearInterval(sk_int);

//=================================================================================
// Main functions

function draw() {
  placementAction(mousePos.x, mousePos.y);
  bg(DEAD_COLOR);

  drawCells();

  if (!s_paused) checkCells();
  else bg(UI_COLOR);

  if (s_showGenerations) {
    ctx.fillStyle = UI_COLOR;
    ctx.fillRect(0, 0, WIDTH, 40)
    ctx.fillStyle = TEXT_COLOR;
    ctx.fillText(`Generation: ${generation}`, 10, 30);
  }

  if (s_showControls) {
    ctx.fillStyle = UI_COLOR;
    ctx.fillRect(0, 40, 400, HEIGHT - 40);
    ctx.fillStyle = TEXT_COLOR;
    fillFancyText(CONTROLS_TEXT, 10, 65);
  }
}

function drawCells() {
  ctx.fillStyle = LIVE_COLOR;
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[0].length; c++) {
      if (cells[r][c]) {
        ctx.fillRect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
  if (s_gridLines) {
    ctx.strokeStyle = TEXT_COLOR;
    for (let r = 0; r < cells.length; r++) {
      line(0, r * CELL_HEIGHT, WIDTH, r * CELL_HEIGHT);
    }
    for (let c = 0; c < cells[0].length; c++) {
      line(c * CELL_WIDTH, 0, c * CELL_WIDTH, HEIGHT);
    }
  }
}

//=================================================================================
// Helper functions

function bg(color) {
  let temp = ctx.fillStyle;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = temp;
}

function getMousePos(e) {
  let rect = cnv.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function fillFancyText(str, x, y) {
  let lineheight = 35;
  let lines = str.split('\n');

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + (i * lineheight));
  }
}

function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

//=================================================================================
// I/O

window.addEventListener('keydown', (e) => keyboardAction(e.keyCode, e.key));
window.addEventListener('mousedown', () => mouseAction(true, mousePos.x, mousePos.y));
window.addEventListener('mouseup', () => mouseAction(false));
window.addEventListener('mousemove', (e) => {
  mousePos = getMousePos(e);
});

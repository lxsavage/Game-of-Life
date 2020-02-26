/**
 * John H. Conway's Game of Life: Renderer/IO Controller (No library, HTML5 Canvas API)
 * Created by Logan Savage
 *
 * Requires prior inclusion of `gol_rle.js`, `gol.js`, `gol_io.js`,
 *
 * Licensed under the CC-BY-SA license
 * =================================================================================
 * To reimplement this in a different drawing library (or none), reimplement all the
 * functions shown here.
 */
'use strict';

let mousePos = { x: 0, y: 0 };

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

// Get a 2d context of the canvas
const cnv = document.getElementById('gol_cnv');
const ctx = cnv.getContext('2d');

// Start the game loop
let sk_int = setInterval(draw, 1000 / FRAMERATE);

// For stopping the game loop
const sk_stop = () => clearInterval(sk_int);

//=================================================================================
// Main functions

function draw() {
  placementAction(mousePos.x, mousePos.y);
  bg(`rgb(${DEAD_SHADE},${DEAD_SHADE},${DEAD_SHADE})`);

  drawCells();

  if (!s_paused) checkCells();
  else bg('rgba(255, 255, 255, .5)');

  if (s_showGenerations) {
    ctx.fillStyle = 'rgba(255, 255, 255, .5)';
    ctx.fillRect(0, 0, WIDTH, 40)
    ctx.fillStyle = 'black';
    ctx.font = '30px sans-serif';
    ctx.fillText(`Generation: ${generation}`, 10, 30);
  }

  if (s_showControls) {
    ctx.fillStyle = 'rgba(255, 255, 255, .5)';
    ctx.fillRect(0, 40, 400, HEIGHT - 40);
    ctx.fillStyle = 'black';
    fillFancyText(CONTROLS_TEXT, 10, 65);
  }
}

function drawCells() {
  ctx.fillStyle = `rgb(${LIVE_SHADE},${LIVE_SHADE},${LIVE_SHADE})`;
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[0].length; c++) {
      if (cells[r][c]) {
        ctx.fillRect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
  if (s_gridLines) {
    ctx.strokeStyle = 'black';
    for (let r = 0; r < cells.length; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL_HEIGHT);
      ctx.lineTo(WIDTH, r * CELL_HEIGHT);
      ctx.stroke();
    }
    for (let c = 0; c < cells[0].length; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL_WIDTH, 0);
      ctx.lineTo(c * CELL_WIDTH, HEIGHT);
      ctx.stroke();
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
  ctx.font = '30px sans-serif';
  let lineheight = 35;
  let lines = str.split('\n');

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + (i * lineheight));
  }
}

//=================================================================================
// I/O

window.addEventListener('keydown', (e) => keyboardAction(e.keyCode, e.key));
window.addEventListener('mousedown', () => mouseAction(true, mousePos.x, mousePos.y));
window.addEventListener('mouseup', () => mouseAction(false));
window.addEventListener('mousemove', (e) => {
  mousePos = getMousePos(e);
});

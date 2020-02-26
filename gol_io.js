/**
 * John H. Conway's Game of Life: Output/Event Handlers
 * Created by Logan Savage
 *
 * Requires prior inclusion of `gol_rle.js`, `gol.js`, `gol_io.js`, `p5.min.js`
 *
 * Licensed under the CC-BY-SA license
 */
'use strict';

//=================================================================================
// Export

function saveStringAsFile(str, format) {
  let el = document.createElement('a');
  el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
  el.setAttribute('download', `board.${format}`);

  el.style.display = 'none';
  document.body.appendChild(el);

  el.click();

  document.body.removeChild(el);
}

//=================================================================================
// Event Listeners

window.addEventListener("paste", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  let data = await e.clipboardData.getData('text/plain');
  loadBoard(data);
});

window.addEventListener("copy", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.clipboardData.setData('text/plain', RLE.encode(cells));
});

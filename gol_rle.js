/**
 * John H. Conway's Game of Life, RLE encoder
 * Created by Logan Savage
 *
 * Licensed under the CC-BY-SA license
 * =================================================================================
 * RLE format:
 *
 * ! = EOF
 * $ = EOL
 * o = alive cell
 * b = dead cell
 *
 * - There is a 70 character-per-line limit
 * - Repeated states are condensed (e.g. ooooobbbobb -> 5o3bo2b)
 * - All trailing dead cells are removed from the data (remove trailing b's before a $)
 */
function rle_encode(board) {
  let header = `x = ${board[0].length}, y = ${board.length}`;
  let output = '';

  // Calculate out the rows, into lines with content
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      output += (board[r][c]) ? 'o' : 'b';
    }
    output += `$`
  }

  output = output
    .match(/(.)\1*/g)
      .map(val => val.length > 1 ? `${val.length}${val[0]}` : val)
      .join('')
    .replace(/(\d+b+|b+)\$/g, '$')
    .replace(/(.{70})/g,"$1\n")
    .replace(/\$$/, '!');

  return `${header}\n${output}`;
}

/** Non-functional */
function rle_decode(rleBoard) {
  rleBoard
    .replace('\n', '')
    .split('$');
}

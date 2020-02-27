/**
 * John H. Conway's Game of Life: 'Run Length Encoding' Encoder/Decoder
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
'use strict';

const RLE = {
  // `private` scope
  _: {
    decompressLine: (rleLine) => {
      if (rleLine.length === 0) return '';
      let items = rleLine.match(/\d*./g);
      let output = '';

      for (let item of items) {
        // Check if the letter has a number before it
        if (/^\d+.*/.test(item[0])) {
          // Find the number and character, and add that character `num` times
          // to the output
          let num = item.match(/^\d+/),
              chr = item.match(/[^\d]+$/);

          for (let i = 0; i < num; i++) {
            output += chr;
          }
        }
        else {
          output += item[0];
        }
      }

      return output;
    },
    validate: (rle) => {
      // Validate header
      if (!/x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)(,\s*\w+\s*=\s*[^\s]+)*/.test(rle)) return false;
      let dimensions = [
        parseInt(rle.match(/x\s*=\s*(\d+)/)[1]),
        parseInt(rle.match(/y\s*=\s*(\d+)/)[1])
      ];
      let rows = rle
        .replace(/^[^\n]+\n/, '')
        .replace(/\n/g, '')
        .replace(/!/, '')
        .split('$');
      if (rows.length < dimensions[1]) return false;
      for (let row of rows) {
        if (row.length > dimensions[0]) return false;
      }

      return true;
    }
  },
  encode: (board) => {
    let rows = 0,
        cols = 0;
    let header = `x = ${board[0].length}, y = ${board.length}`;
    let output = '';

    // Calculate out the rows, into lines with content
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        output += (board[r][c]) ? 'o' : 'b';
      }
      output += `$`;
    }

    output = output
      // Compress with RLE
      .match(/(.)\1*/g)
        .map(val => val.length > 1 ? `${val.length}${val[0]}` : val)
        .join('')
      // Add line separators
      .replace(/(\d+b+|b+)\$/g, '$')
      // Enforce 70 character-per-line limit
      .replace(/(.{70})/g,"$1\n")
      // Replace the ending $ with a !
      .replace(/\$$/, '!');

    return `${header}\n${output}`;
  },
  decode: (rleBoard) => {
    if (!RLE._.validate(rleBoard)) throw 'Invalid board';
    let dimensions = [
      parseInt(rleBoard.match(/x\s*=\s*(\d+)/)[1]),
      parseInt(rleBoard.match(/y\s*=\s*(\d+)/)[1])
    ];

    let rows = rleBoard
      .replace(/#[^\n]*\n/g, '')
      .replace(/^[^\n]+\n/, '')
      .replace(/\n/g, '')
      .replace(/!/, '')
      .split('$');

    let output = [];

    // Fill in the output
    for (let r = 0; r < rows.length; r++) {
      output[r] = [];
      let rs = RLE._.decompressLine(rows[r]);
      for (let chr of rs) {
        output[r].push(chr === 'o');
      }
    }

    // Pad the right side of each row with falses until the length reaches dimensions[0]
    for (let r = 0; r < dimensions[1]; r++) {
      while (output[r].length < dimensions[0]) {
        output[r].push(false);
      }
    }

    return output;
  }
};

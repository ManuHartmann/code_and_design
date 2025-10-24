// --- Config ---
const CELL = 100;
const COLS = 6;
const ROWS = 6;

// --- State ---
let board = []; // board[r][c] = null or { color:p5.Color }

function setup() {
  createCanvas(COLS * CELL, ROWS * CELL);
  noStroke();
  buildBoard();
  shuffleBoard();
}

function draw() {
  background(10);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = board[r][c];
      if (t) {
        fill(t.color);
        rect(c * CELL, r * CELL, CELL, CELL, 12);
      }
    }
  }
}

function mousePressed() {
  const c = floor(mouseX / CELL);
  const r = floor(mouseY / CELL);
  if (!inBounds(r, c) || !board[r][c]) return;

  const neighbors = [
    { r, c: c + 1 },
    { r, c: c - 1 },
    { r: r + 1, c },
    { r: r - 1, c }
  ];

  for (const n of neighbors) {
    if (inBounds(n.r, n.c) && board[n.r][n.c] === null) {
      board[n.r][n.c] = board[r][c]; // slide into empty
      board[r][c] = null;
      break;
    }
  }
}

// ---- Helpers ----
function buildBoard() {
  board = new Array(ROWS);
  // Vibrant, all-different colors across the hue circle
  colorMode(HSB, 360, 100, 100);
  const totalTiles = COLS * ROWS - 1; // one empty
  const colors = [];
  for (let i = 0; i < totalTiles; i++) {
    const hue = (i * (360 / totalTiles)) % 360;
    colors.push(color(hue, 90, 95));
  }
  colorMode(RGB, 255);

  let k = 0;
  for (let r = 0; r < ROWS; r++) {
    board[r] = new Array(COLS);
    for (let c = 0; c < COLS; c++) {
      if (r === ROWS - 1 && c === COLS - 1) {
        board[r][c] = null; // empty bottom-right
      } else {
        board[r][c] = { color: colors[k++] };
      }
    }
  }
}

function shuffleBoard() {
  const total = COLS * ROWS;
  for (let i = 0; i < total * 60; i++) doRandomMove(); // shuffle by valid slides
}

function doRandomMove() {
  // find empty
  let er = 0, ec = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === null) { er = r; ec = c; }
    }
  }
  // choose a random neighbor tile to slide into empty
  const candidates = [
    { r: er, c: ec + 1 },
    { r: er, c: ec - 1 },
    { r: er + 1, c: ec },
    { r: er - 1, c: ec }
  ].filter(p => inBounds(p.r, p.c) && board[p.r][p.c]);

  if (candidates.length) {
    const pick = random(candidates);
    board[er][ec] = board[pick.r][pick.c];
    board[pick.r][pick.c] = null;
  }
}

function inBounds(r, c) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

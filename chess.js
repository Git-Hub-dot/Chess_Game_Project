
const boardElement = document.getElementById('chessBoard');
let selectedSquare = null;
let boardState = [];
let currentPlayer = 'white';

const pieceUnicode = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const initialLayout = [
  'r','n','b','q','k','b','n','r',
  'p','p','p','p','p','p','p','p',
  '','','','','','','','',
  '','','','','','','','',
  '','','','','','','','',
  '','','','','','','','',
  'P','P','P','P','P','P','P','P',
  'R','N','B','Q','K','B','N','R'
];

function isWhite(piece) {
  return /[A-Z]/.test(piece);
}

function isBlack(piece) {
  return /[a-z]/.test(piece);
}

function createBoard() {
  boardElement.innerHTML = '';
  for (let i = 0; i < 64; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add((Math.floor(i / 8) + i) % 2 === 0 ? 'white' : 'black');
    const piece = boardState[i];
    square.dataset.index = i;
    square.innerHTML = pieceUnicode[piece] || '';
    if (isWhite(piece)) square.classList.add('white-piece');
    if (isBlack(piece)) square.classList.add('black-piece');
    square.addEventListener('click', () => handleSquareClick(i));
    boardElement.appendChild(square);
  }
}

function handleSquareClick(index) {
  const piece = boardState[index];
  if (selectedSquare === null) {
    if ((currentPlayer === 'white' && isWhite(piece)) || (currentPlayer === 'black' && isBlack(piece))) {
      selectedSquare = index;
      highlightSquare(index);
    }
  } else {
    const from = selectedSquare;
    const to = index;
    const movingPiece = boardState[from];
    if (isLegalMove(movingPiece, from, to)) {
      movePiece(from, to);
      selectedSquare = null;
      refreshBoard();
    } else {
      alert('Illegal move!');
      selectedSquare = null;
      refreshBoard();
    }
  }
}

function movePiece(from, to) {
  boardState[to] = boardState[from];
  boardState[from] = '';
  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
  checkGameEnd();
}

function highlightSquare(index) {
  document.querySelectorAll('.square').forEach(sq => sq.classList.remove('selected'));
  document.querySelector(`.square[data-index='${index}']`).classList.add('selected');
}

function refreshBoard() {
  createBoard();
}

function isLegalMove(piece, from, to) {
  const rowFrom = Math.floor(from / 8);
  const colFrom = from % 8;
  const rowTo = Math.floor(to / 8);
  const colTo = to % 8;
  const target = boardState[to];
  const direction = currentPlayer === 'white' ? -1 : 1;

  switch (piece.toLowerCase()) {
    case 'p':
      if (colFrom === colTo && target === '') {
        if ((rowFrom + direction === rowTo) ||
            ((rowFrom === 6 && direction === -1 || rowFrom === 1 && direction === 1) && rowFrom + 2 * direction === rowTo && boardState[from + direction * 8] === '')) {
          return true;
        }
      } else if (Math.abs(colFrom - colTo) === 1 && rowFrom + direction === rowTo && target !== '') {
        return true;
      }
      return false;
    case 'r':
      if (rowFrom === rowTo || colFrom === colTo) {
        return pathClear(from, to);
      }
      return false;
    case 'n':
      const dx = Math.abs(colFrom - colTo);
      const dy = Math.abs(rowFrom - rowTo);
      return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    case 'b':
      if (Math.abs(rowFrom - rowTo) === Math.abs(colFrom - colTo)) {
        return pathClear(from, to);
      }
      return false;
    case 'q':
      if (rowFrom === rowTo || colFrom === colTo || Math.abs(rowFrom - rowTo) === Math.abs(colFrom - colTo)) {
        return pathClear(from, to);
      }
      return false;
    case 'k':
      return Math.abs(rowFrom - rowTo) <= 1 && Math.abs(colFrom - colTo) <= 1;
    default:
      return false;
  }
}

function pathClear(from, to) {
  const rowFrom = Math.floor(from / 8);
  const colFrom = from % 8;
  const rowTo = Math.floor(to / 8);
  const colTo = to % 8;
  const dRow = Math.sign(rowTo - rowFrom);
  const dCol = Math.sign(colTo - colFrom);

  let i = rowFrom + dRow;
  let j = colFrom + dCol;
  while (i !== rowTo || j !== colTo) {
    if (boardState[i * 8 + j] !== '') return false;
    i += dRow;
    j += dCol;
  }
  return true;
}

function checkGameEnd() {
  if (!boardState.includes('k')) {
    alert('White wins!');
    resetGame();
  }
  if (!boardState.includes('K')) {
    alert('Black wins!');
    resetGame();
  }
}

function resetGame() {
  boardState = [...initialLayout];
  currentPlayer = 'white';
  refreshBoard();
}

boardState = [...initialLayout];
createBoard();




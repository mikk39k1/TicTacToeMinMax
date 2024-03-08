// Constants
const PLAYER = 'O';
const COMPUTER = 'X';
let searchDepth = 0; // Adjust this based on desired difficulty
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = PLAYER;

function isWin(board, player) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return board[index] === player;
    });
  });
}

function isDraw(board) {
  return board.every(cell => {
    return cell === PLAYER || cell === COMPUTER;
  });
}

function evaluateBoard(board) {
  let score = 0;
  WINNING_COMBINATIONS.forEach(combination => {
    const [a, b, c] = combination;
    if (board[a] === board[b] && board[a] === COMPUTER && board[c] === '') score++;
    if (board[a] === board[c] && board[a] === COMPUTER && board[b] === '') score++;
    if (board[b] === board[c] && board[b] === COMPUTER && board[a] === '') score++;
    if (board[a] === board[b] && board[a] === PLAYER && board[c] === '') score--;
    if (board[a] === board[c] && board[a] === PLAYER && board[b] === '') score--;
    if (board[b] === board[c] && board[b] === PLAYER && board[a] === '') score--;
  });
  return score;
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = COMPUTER;
      let score = minimax(board, searchDepth, false, -Infinity, +Infinity);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  makeMove(move, COMPUTER);
  return move;
}

function minimax(board, searchDepth, isMaximizing, alpha, beta) {
  if (isWin(board, COMPUTER)) return 10;
  if (isWin(board, PLAYER)) return -10;
  if (isDraw(board)) return 0;
  if (searchDepth === 0) return evaluateBoard(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = COMPUTER;
        let score = minimax(board, searchDepth - 1, false, alpha, beta);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = PLAYER;
        let score = minimax(board, searchDepth - 1, true, alpha, beta);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  }
}


function makeMove(position, player) {
    if (position >= 0 && position < board.length && board[position] === '') {
      board[position] = player;
  
      const cellElement = document.querySelector(`[data-cell-index="${position}"]`);
      if (cellElement) {
        cellElement.textContent = player;
        cellElement.classList.add(`player-${player}`);
      }
  
      return true;
    }
    return false;
  }
  
  function cellClickHandler(index) {
    if (board[index] !== '' || isGameOver) {
      return; // Cell is already taken, or the game is over.
    }
  
    const moveMade = makeMove(index, currentPlayer);
    if (moveMade) {
      const gameWon = isWin(board, currentPlayer);
      const gameDraw = isDraw(board);
  
      if (gameWon) {
        alert(`${currentPlayer} wins!`);
        isGameOver = true;
        return;
      } else if (gameDraw) {
        alert('Draw!');
        isGameOver = true;
        return;
      }
  
      // Switch turns
      currentPlayer = (currentPlayer === PLAYER) ? COMPUTER : PLAYER;
  
      // If computer's turn, make a move.
      if (currentPlayer === COMPUTER && !isGameOver) {
        setTimeout(() => { // Added delay for better UX
          const computerMove = bestMove();
          const computerWon = isWin(board, COMPUTER);
          const computerDraw = isDraw(board);
  
          if (computerWon) {
            alert(`${COMPUTER} wins!`);
            isGameOver = true;
          } else if (computerDraw) {
            alert('Draw!');
            isGameOver = true;
          }
  
          // Switch back to player
          currentPlayer = PLAYER;
        }, 500); // Delay the computer move for 500ms for visibility
      }
    }
  }
  

  function initGame() {
    // Reset the board and game state
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = COMPUTER; // Set the computer to start
    isGameOver = false;
  
    // Attach event listeners to each cell
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      cell.textContent = ''; // Clear any existing text
      cell.className = 'cell'; // Reset any added classes
      cell.removeEventListener('click', () => cellClickHandler(index)); // Remove old listeners if any
      cell.addEventListener('click', () => cellClickHandler(index), false);
    });
  
    // Make the computer's first move if it's the COMPUTER's turn
    if (currentPlayer === COMPUTER && !isGameOver) {
      setTimeout(() => { // Use setTimeout to simulate thinking delay and improve UX
        bestMove();
        currentPlayer = PLAYER; // Switch turn to PLAYER after COMPUTER makes its move
      }, 100); // Delay can be adjusted for UX
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    initGame();
  });
  
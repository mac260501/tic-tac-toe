// ------------------ gameBoard module ------------------
const gameBoard = (() => {
  // ---------------- Player Object Factory -------------
  const Player = (name, shape, turn) => {
    return { name, shape, turn };
  };

  const player1 = Player("Player 1", "X", true);
  const player2 = Player("Player 2", "O", false);

  let board = [];

  const createBoard = () => {
    // create new array
    board = new Array(3);
    for (let i = 0; i < 3; i++) {
      board[i] = new Array(3);
    }

    // re-initialize player turns
    player1.turn = true;
    player2.turn = false;
  };

  // function to check the board for a winner
  // Fun fact: I got the code for the following function from ChatGPT!
  const checkWinner = () => {
    // check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== undefined &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return { shape: board[i][0], row: i };
      }
    }

    // check columns
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] !== undefined &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      ) {
        return { shape: board[0][i], col: i };
      }
    }

    // check diagonals
    if (
      board[0][0] !== undefined &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return { shape: board[0][0], diag: 0 };
    }

    if (
      board[2][0] !== undefined &&
      board[2][0] === board[1][1] &&
      board[1][1] === board[0][2]
    ) {
      return { shape: board[2][0], diag: 1 };
    }

    // If no winner is found, return null
    return null;
  };

  const updateBoard = (shape, row, col) => {
    board[row][col] = shape;
    return checkWinner();
  };

  return { player1, player2, createBoard, updateBoard };
})();

// --------------- displayController Module ----------------
const displayController = (() => {
  // DOM Elements
  const gridContainer = document.querySelector(".grid-container");
  const gridArray = Array.from(gridContainer.children);
  const playButton = document.querySelector(".play-btn");
  const winnerHeader = document.querySelector(".winner");

  // Number of moves that have been played
  let count = 0;

  const setupBoard = () => {
    // reset counter
    count = 0;

    // Reset grid cells
    gridArray.forEach((cell) => {
      cell.textContent = "";
    });
    gridContainer.style.display = "grid";

    gameBoard.createBoard();

    playButton.textContent = "Play again";
    playButton.style.padding = "10px 30px";

    // Add eventListeners for the grid cells
    gridArray.forEach((cell) => {
      cell.addEventListener("click", updateCell);
      // resetting the color after a win
      cell.style.color = "inherit";
    });

    // resets text after a game
    winnerHeader.textContent = "";
  };

  const updateCell = (event) => {
    // make sure cell is empty first
    if (!event.target.textContent) {
      if (gameBoard.player1.turn) {
        event.target.textContent = "X";
      } else {
        event.target.textContent = "O";
      }

      count++;
      let shape = event.target.textContent;
      let row = Number(event.target.id.split("")[0]);
      let col = Number(event.target.id.split("")[1]);

      let checkWin = gameBoard.updateBoard(shape, row, col);

      if (checkWin !== null) {
        endGame(checkWin);
        return;
      }

      // if no winner is found, and 9 moves have already been made,
      // then its a tie
      if (count === 9) {
        tieGame();
      }

      // update turns and table here
      gameBoard.player1.turn = !gameBoard.player1.turn;
      gameBoard.player2.turn = !gameBoard.player2.turn;
    }
  };

  const endGame = (winner) => {
    // check which player won
    if (winner.shape === "X") {
      winnerHeader.textContent = "Player 1 has won!";
    } else if (winner.shape === "O") {
      winnerHeader.textContent = "Player 2 has won!";
    }

    // highlight the winning row/col/diagonal
    if (winner.row !== undefined) {
      gridArray.forEach((cell) => {
        if (
          cell.id === `${winner.row}0` ||
          cell.id === `${winner.row}1` ||
          cell.id === `${winner.row}2`
        ) {
          cell.style.color = "red";
        }
      });
    } else if (winner.col !== undefined) {
      gridArray.forEach((cell) => {
        if (
          cell.id === `0${winner.col}` ||
          cell.id === `1${winner.col}` ||
          cell.id === `2${winner.col}`
        ) {
          cell.style.color = "red";
        }
      });
    } else if (winner.diag === 0) {
      gridArray.forEach((cell) => {
        if (cell.id === `00` || cell.id === `11` || cell.id === `22`) {
          cell.style.color = "red";
        }
      });
    } else {
      gridArray.forEach((cell) => {
        if (cell.id === `02` || cell.id === `11` || cell.id === `20`) {
          cell.style.color = "red";
        }
      });
    }

    // remove eventListener for the grid cells
    gridArray.forEach((cell) => {
      cell.removeEventListener("click", updateCell);
    });
  };

  const tieGame = () => {
    winnerHeader.textContent = "Its a tie!";

    // remove eventListener for the grid cells
    gridArray.forEach((cell) => {
      cell.removeEventListener("click", updateCell);
    });
  };

  // Adding Event Listener for Play button
  playButton.addEventListener("click", setupBoard);

  return {};
})();

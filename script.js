const welcomeContainer = document.getElementById('welcomeContainer');
const gameContainer = document.getElementById('gameContainer');
const board = document.getElementById('board');
const playerChoiceSelect = document.getElementById('playerChoice');
const difficultySelect = document.getElementById('difficultySelect');
const messageArea = document.getElementById('messageArea');
let currentPlayer;
let botPlayer;
let gameOver = false;
let playerScore = 0;
let botScore = 0;
let difficulty = 'easy';

function createBoard() {
    currentPlayer = playerChoiceSelect.value;
    botPlayer = currentPlayer === 'X' ? 'O' : 'X';

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (gameOver) return;

    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    if (!cell.textContent) {
        cell.textContent = currentPlayer;
        if (checkWinner(currentPlayer, row, col)) {
            updateScore(currentPlayer);
            displayMessage(`${currentPlayer} wins! Your score: ${playerScore}, Bot's score: ${botScore}`);
            markWinningCells(currentPlayer, row, col);
            gameOver = true;
        } else {
            switchPlayer();
            setTimeout(botMove, 500);
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner(player, row, col) {
    return (
        checkRow(player, row) ||
        checkCol(player, col) ||
        checkDiagonals(player)
    );
}

function checkRow(player, row) {
    const cells = Array.from(document.querySelectorAll(`.cell[data-row="${row}"]`));
    return cells.every(cell => cell.textContent === player);
}

function checkCol(player, col) {
    const cells = Array.from(document.querySelectorAll(`.cell[data-col="${col}"]`));
    return cells.every(cell => cell.textContent === player);
}

function checkDiagonals(player) {
    const cells1 = Array.from(document.querySelectorAll('.cell[data-row="0"][data-col="0"], .cell[data-row="1"][data-col="1"], .cell[data-row="2"][data-col="2"]'));
    const cells2 = Array.from(document.querySelectorAll('.cell[data-row="0"][data-col="2"], .cell[data-row="1"][data-col="1"], .cell[data-row="2"][data-col="0"]'));

    return (
        cells1.every(cell => cell.textContent === player) ||
        cells2.every(cell => cell.textContent === player)
    );
}

function markWinningCells(player, row, col) {
    const winningCells = getWinningCells(player, row, col);

    Array.from(document.querySelectorAll('.cell')).forEach(cell => {
        cell.classList.remove('winner');
    });

    winningCells.forEach(cell => cell.classList.add('winner'));
}

function botMove() {
    if (gameOver) return;

    const emptyCells = Array.from(document.querySelectorAll('.cell')).filter(
        (cell) => !cell.textContent
    );
    if (emptyCells.length > 0) {
        const randomCell = getBestMove(emptyCells);
        randomCell.textContent = botPlayer;
        if (checkWinner(botPlayer, randomCell.dataset.row, randomCell.dataset.col)) {
            updateScore(botPlayer);
            displayMessage(`${botPlayer} wins! Your score: ${playerScore}, Bot's score: ${botScore}`);
            markWinningCells(botPlayer, randomCell.dataset.row, randomCell.dataset.col);
            gameOver = true;
        } else if (emptyCells.length === 1) {
            displayMessage(`It's a tie! No winner. Your score: ${playerScore}, Bot's score: ${botScore}`);
            gameOver = true;
        } else {
            switchPlayer();
        }
    }
}

function getBestMove(emptyCells) {
    switch (difficulty) {
        case 'easy':
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        case 'medium':
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        case 'hard':
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        default:
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
}

function updateScore(winner) {
    if (winner === botPlayer) {
        botScore++;
    } else {
        playerScore++;
    }
}

function displayMessage(message) {
    messageArea.textContent = message;
}

function startGame() {
    welcomeContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    gameOver = false;
    messageArea.textContent = '';
    board.innerHTML = '';
    createBoard();
}

function resetGame() {
    welcomeContainer.style.display = 'block';
    gameContainer.style.display = 'none';
}

difficultySelect.addEventListener('change', function () {
    difficulty = this.value;
});

createBoard();

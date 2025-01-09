// Set up 3 by 3 gameboard array in gameboard object
function gameboard() {
    const rows = 3;
    const columns = 3;
    const gameboardDisplay = document.querySelector(".gameboard")

    const board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;
    
    // Allow player to select cell if it is empty
    const selectCell = (player, row, column) => {
        board[row][column].addSelection(player);
    }
    
    const getBoardValues = () => board.map((row) =>
        row.map((cell) => cell.getValue()))

    function displayCell (cellValue) {
        const cellDiv = document.createElement("div")
        cellDiv.setAttribute("class", "cell")
        cellDiv.textContent = `${cellValue}`
        gameboardDisplay.appendChild(cellDiv)
    }

    function displayBoard () {
        while (gameboardDisplay.firstChild) {
            gameboardDisplay.removeChild(gameboardDisplay.firstChild);
        }
        let boardValues = getBoardValues();
        boardValues.map((row) => 
        row.map((cell) => displayCell(cell)))
    }

    const printBoard = () => {
        console.log(getBoardValues())
    }

    return { getBoard, selectCell, printBoard, getBoardValues, displayCell, displayBoard, gameboardDisplay }

}

function Cell() {
    let value = ""

    const addSelection = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addSelection,
        getValue
    }
}

// Create game object to track the game, including player objects
function gameController() {

    const gameDiv = document.querySelector(".game");
    const gameStateDiv = document.querySelector(".game-state");
    const startGameDiv = document.querySelector(".start-game");
    const startBtn = document.querySelector("#start-btn");
    const resetBtn = document.querySelector("#reset-btn");
    const playerOneInput = document.querySelector("#player-one");
    const playerTwoInput = document.querySelector("#player-two");

    let board = gameboard();
    
    const players = [
        {
            name: "Player One",
            token: "X",
            roundWins: 0,
        },
        {
            name: "Player Two",
            token: "O",
            roundWins: 0,
        }
    ];

    const handleStartClick = () => {
        if (playerOneInput.value !== "" && playerTwoInput.value !== "") {
            players[0].name = playerOneInput.value;
            players[1].name = playerTwoInput.value;
            startGameDiv.classList.toggle("hidden");
            gameDiv.classList.toggle("hidden");
            printNewTurn();
        }
    }

    startBtn.addEventListener("click", handleStartClick);

    let activePlayer = players[0]
    let gameOver = false

    const switchPlayer = () =>
        activePlayer = activePlayer === players[0] ? players[1] : players[0]


    const getActivePlayer = () => activePlayer;

    function handleCellClick (cellDivs, cell) {
        if (gameOver) return;
        cell.textContent = `${getActivePlayer().token}`
        let cellRow = Math.floor(cellDivs.indexOf(cell) / 3);
        let cellCol = Math.floor(cellDivs.indexOf(cell) % 3);
        makeTurn(cellRow, cellCol)
    }

    const handleResetClick = () => {
        startGameDiv.classList.toggle("hidden");
        gameDiv.classList.toggle("hidden");
        board = gameboard();
        activePlayer = players[0];
        gameOver = false;
    }

    resetBtn.addEventListener("click", handleResetClick)

    const printNewTurn = () => {
        board.displayBoard();
        
        const cellDivs = Array.from(board.gameboardDisplay.children)
        cellDivs.forEach(cell => cell.addEventListener("click", () => {handleCellClick(cellDivs, cell);}))
        gameStateDiv.textContent = `${getActivePlayer().name}'s turn!`
    }

    const gameOverTest = () =>
        {if (gameOver) {
            return;
        }}

    const makeTurn = (row, column) => {

        if (board.getBoard()[row][column].getValue() !== "") {
            console.log("This square is taken! Please select a different square.");
            gameStateDiv.textContent = "This square is taken! Please select a different square.";
            printNewTurn();
            return;
        }
        
        board.selectCell(getActivePlayer().token, row, column)

        // Check if game has been won:
        const checkWinner = () => {
            boardValues = board.getBoardValues();
            
            if (boardValues.every(row => row.every(val => val !== ""))) {
                console.log(`Game Over! Game is tied!`)
                gameStateDiv.textContent = `Game Over! Game is tied!`
                gameOver = true;
                gameOverTest();
            }

            let transposedBoard = boardValues[0].map(
                (_, colIndex) => boardValues.map(row => row[colIndex]))

            
            let firstDiagonal = []
            let secondDiagonal = []
            for (let i = 0; i < boardValues.length; i++) {
                firstDiagonal.push(boardValues[i][i])
                secondDiagonal.push(boardValues[i][boardValues.length - 1 - i])
            }
            function checkWinnerDirection(arrValues) {
                for (const row of arrValues) {
                    if (row.every(val => val === row[0] && val !== "")){
                        console.log(`Game Over! ${getActivePlayer().name} wins!`)
                        gameStateDiv.textContent = `Game Over! ${getActivePlayer().name} wins!`
                        gameOver = true;
                        gameOverTest();
                        return;
                    }
                }
            }

            checkWinnerDirection(boardValues)
            checkWinnerDirection(transposedBoard)
            checkWinnerDirection([firstDiagonal, secondDiagonal])
        };

        
        checkWinner();
        if (!gameOver) {
            switchPlayer();
            printNewTurn();
        }
    }


    return { makeTurn, getActivePlayer, switchPlayer };
}


const game = gameController();
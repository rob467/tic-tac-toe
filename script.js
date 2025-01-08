// Set up 3 by 3 gameboard array in gameboard object
function Gameboard() {
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

    return { getBoard, selectCell, printBoard, getBoardValues, displayCell, displayBoard }

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

    const gameDetailsDiv = document.querySelector(".game-details")
    const playersTurnDiv = document.querySelector(".players-turn");
    const gameStateDiv = document.querySelector(".game-state");

    let playerOneName = "Player 1"
    let playerTwoName = "Player 2"

    const board = Gameboard();
    // board.displayBoard();
    
    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let activePlayer = players[0]
    let gameOver = false

    const switchPlayer = () =>
        activePlayer = activePlayer === players[0] ? players[1] : players[0]


    const getActivePlayer = () => activePlayer;

    const printNewTurn = () => {
        board.displayBoard();
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn!`)
        playersTurnDiv.textContent = `${getActivePlayer().name}'s turn!`
    }

    const gameOverTest = () =>
        {if (gameOver) {
            gameDetailsDiv.removeChild(playersTurnDiv)
            return;
        }}

    const makeTurn = (row, column) => {

        if (board.getBoard()[row][column].getValue() !== "") {
            console.log("This square is taken! Please select a different square.");
            gameStateDiv.textContent = "This square is taken! Please select a different square.";
            printNewTurn();
            return;
        }
        // console.log(`${getActivePlayer().name} goes in row ${row}, column ${column}`)
        // gameStateDiv.textContent = `${getActivePlayer().name} goes in row ${row}, column ${column}`
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

        
        checkWinner()
        switchPlayer();
        printNewTurn();
        // displaySelection();
    }

    printNewTurn();
    // Display gameboard in DOM
    function displaySelection () {
        // const cells = document.querySelectorAll(".cell")
        
        // let cellIds = Array.from(cells).map(cell => cell.getAttribute("id").split("-"))
        // console.log(cellIds)

        
        
        boardValues = board.getBoardValues();
        // boardValues.forEach(row => {
        //     cellIds.forEach(cell => console.log(cell[0]))})

        // boardValues.forEach(row => {
        //     row.forEach(
        //         cell => {
        //             if (cell === 0) {
        //                 gameboardDisplay.textContent = " "
        //                 console.log("empty cell")
        //             } else if (cell === 1) {
        //                 gameboardDisplay.textContent = "X"
        //                 console.log("X")
        //             } else {
        //                 gameboardDisplay.textContent = "O"
        //                 console.log("O")
        //             }
        //         }
        //     )
        // });

            // cells.forEach(
            //     cell => cell.addEventListener("click", 
            //         () => playerText(cell)
            //     ))
        
        function playerText (cell) {
            if (activePlayer.token === 1) {
                cell.textContent = "X"
            } else {
                cell.textContent = "O"
            }
        }


    }

    return { makeTurn, getActivePlayer, switchPlayer, displaySelection };
}


// Create functions to allow user to click square for Selection
// Allow users to input and display user names
// Add start/restart game buttons
// Display game result at end

const game = gameController();
// 1. Set up 3 by 3 gameboard array in gameboard object
function Gameboard() {
    const rows = 3;
    const columns = 3;
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

    const printBoard = () => {
        console.log(getBoardValues())
    }

    return { getBoard, selectCell, printBoard, getBoardValues }

}

function Cell() {
    let value = 0

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

    let playerOneName = "Player 1"
    let playerTwoName = "Player 2"

    const board = Gameboard();
    
    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0]

    const switchPlayer = () =>
        activePlayer = activePlayer === players[0] ? players[1] : players[0]


    const getActivePlayer = () => activePlayer;

    const printNewTurn = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn!`)
    }

    const makeTurn = (row, column) => {
        if (board.getBoard()[row][column].getValue() !== 0) {
            console.log("This square is taken! Please select a different square.");
            printNewTurn();
            return;
        }
        console.log(`${getActivePlayer().name} goes in row ${row}, column ${column}`)
        board.selectCell(getActivePlayer().token, row, column)

        // Check rows:
        const checkWinner = (board) => {
            for (const row of board) {
                if (row.every(val => val === row[0] && val !== 0)){
                    console.log(`Game Over! ${getActivePlayer().name} wins!`)
                    return;
                }
            }
        };

        // get transposed array to check columns
        const getTransposedBoard = () => {
            let colArray = board.getBoardValues()[0].map(
                (_, colIndex) => board.getBoardValues().map(row => row[colIndex]))
            return colArray;
        };

        // check diagonal
        const diagonalArrays = () => {
            let firstDiagonal = []
            let secondDiagonal = []
            for (let i = 0; i < board.getBoardValues().length; i++) {
                firstDiagonal.push(board.getBoardValues()[i][i])
                secondDiagonal.push(board.getBoardValues()[i][board.getBoardValues().length - 1 - i])
            }
            return [firstDiagonal, secondDiagonal];
            }
        
        console.log(diagonalArrays())
        checkWinner(board.getBoardValues())
        checkWinner(getTransposedBoard())
        checkWinner(diagonalArrays())
        switchPlayer();
        printNewTurn();
    }

    printNewTurn();

    return { makeTurn, getActivePlayer, switchPlayer };
}

const game = gameController();

// Declare winner (or tie) when game extends
// Display gameboard in DOM
// Create functions to allow user to click square for Selection
// Allow users to input and display user names
// Add start/restart game buttons
// Display game result at end
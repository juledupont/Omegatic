import React, { useEffect, useState } from 'react';
import { Grid, Header, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import SmallGrid from './SmallGrid';
import { useContext } from 'react';
import { PlayerContext } from './context/PlayerContext';

function SoloGameBoard() {
    const {myPlayer} = useContext(PlayerContext);
    const [playerHasPlayedOnce, setPlayerHasPlayedOnce] = useState(false);

    const [gameState, setGameState] = useState({
        lastCellPosition: null,
        grids: Array(9).fill().map(() => Array(3).fill().map(() => Array(3).fill(null))),
        smallGrids: Array(9).fill(null),
        winner: null,
        activeGrid: null,
        playerTurn: 'X' // Assume 'X' starts first
    });

    // Find best move for AI
    const findBestMove = (gameState) => {
        const activeGridCells = [];
        const { activeGrid } = gameState;
        if (activeGrid !== null) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    if (!gameState.grids[activeGrid][j][k]) {
                        activeGridCells.push({ bigIndex: activeGrid, row: j, col: k });
                    }
                }
            }
        } else {
            // If activeGrid is null, play in any empty cell except the grids that have already been won
            for (let i = 0; i < 9; i++) {
                if (!gameState.smallGrids[i]) {
                    for (let j = 0; j < 3; j++) {
                        for (let k = 0; k < 3; k++) {
                            if (!gameState.grids[i][j][k]) {
                                activeGridCells.push({ bigIndex: i, row: j, col: k });
                            }
                        }
                    }
                }
            }
        }

        // Check if AI can win in the next move
        for (const cell of activeGridCells) {
            const { bigIndex, row, col } = cell;
            const newGrids = gameState.grids.map(bigGrid => bigGrid.map(row => row.slice())); // Deep copy of grids
            newGrids[bigIndex][row][col] = gameState.playerTurn;
            const newSmallGrids = [...gameState.smallGrids]; // Shallow copy of smallGrids
            if (checkWinnerSmall(newGrids[bigIndex])) {
                newSmallGrids[bigIndex] = gameState.playerTurn;
            }
            if (checkWinnerBig(newSmallGrids) === gameState.playerTurn || checkWinnerSmall(newGrids[bigIndex]) === gameState.playerTurn) {
                return cell; // AI can win, return this move
            }
        }

        // Check if opponent can win in the next move and block it
        for (const cell of activeGridCells) {
            const { bigIndex, row, col } = cell;
            const newGrids = gameState.grids.map(bigGrid => bigGrid.map(row => row.slice())); // Deep copy of grids
            newGrids[bigIndex][row][col] = gameState.playerTurn === 'X' ? 'O' : 'X'; // Assume opponent's turn
            const newSmallGrids = [...gameState.smallGrids]; // Shallow copy of smallGrids
            if (checkWinnerSmall(newGrids[bigIndex])) {
                newSmallGrids[bigIndex] = gameState.playerTurn === 'X' ? 'O' : 'X'; // Assume opponent's turn
            }
            if (checkWinnerBig(newSmallGrids) === (gameState.playerTurn === 'X' ? 'O' : 'X') || checkWinnerSmall(newGrids[bigIndex]) === (gameState.playerTurn === 'X' ? 'O' : 'X')) {
                return cell; // Opponent can win, block this move
            }
        }

        return activeGridCells[Math.floor(Math.random() * activeGridCells.length)];
    };


    // Handle player's move
    const handlePlayerClick = (bigIndex, row, col) => {

        if (gameState.winner || gameState.grids[bigIndex][row][col] || (gameState.activeGrid !== null && gameState.activeGrid !== bigIndex) || myPlayer !== gameState.playerTurn) {
            return;
        }

        if (!playerHasPlayedOnce) {
            setPlayerHasPlayedOnce(true);
        }

        const newGrids = gameState.grids.map(bigGrid => bigGrid.map(row => row.slice())); // Deep copy of grids
        newGrids[bigIndex][row][col] = gameState.playerTurn;
        const lastCellPosition = { bigIndex, row, col, player: gameState.playerTurn };

        const newSmallGrids = [...gameState.smallGrids]; // Shallow copy of smallGrids
        if (checkWinnerSmall(newGrids[bigIndex])) {
            newSmallGrids[bigIndex] = gameState.playerTurn;
        }

        const newActiveGrid = newSmallGrids[row * 3 + col] ? null : row * 3 + col;

        const updatedGameState = {
            lastCellPosition: lastCellPosition,
            grids: newGrids,
            smallGrids: newSmallGrids,
            winner: checkWinnerBig(newSmallGrids),
            activeGrid: newActiveGrid,
            playerTurn: gameState.playerTurn === 'X' ? 'O' : 'X' // Switch player turn
        };

        setGameState(updatedGameState);

        // AI makes its move after a short delay
        setTimeout(() => {
            handleAIMove(updatedGameState);
        }, 500);
    };

    // Handle AI's move
    const handleAIMove = (gameState) => {
        if (!gameState.winner && gameState.playerTurn !== myPlayer) {
            const aiMove = findBestMove(gameState);
            if (aiMove) {
                const newGrids = gameState.grids.map(bigGrid => bigGrid.map(row => row.slice())); // Deep copy of grids
                newGrids[aiMove.bigIndex][aiMove.row][aiMove.col] = gameState.playerTurn;
                const lastCellPosition = { bigIndex: aiMove.bigIndex, row: aiMove.row, col: aiMove.col, player: gameState.playerTurn};

                const newSmallGrids = [...gameState.smallGrids]; // Shallow copy of smallGrids
                if (checkWinnerSmall(newGrids[aiMove.bigIndex])) {
                    newSmallGrids[aiMove.bigIndex] = gameState.playerTurn;
                }

                const newActiveGrid = newSmallGrids[aiMove.row * 3 + aiMove.col] ? null : aiMove.row * 3 + aiMove.col;

                const updatedGameState = {
                    lastCellPosition: lastCellPosition,
                    grids: newGrids,
                    smallGrids: newSmallGrids,
                    winner: checkWinnerBig(newSmallGrids),
                    activeGrid: newActiveGrid,
                    playerTurn: gameState.playerTurn === 'X' ? 'O' : 'X' // Switch player turn
                };

                setGameState(updatedGameState);
            }
        }
    };

    // Check for winner in big grid
    const checkWinnerBig = (smallGrids) => {
        // Convert smallGrids to 2D array for easier manipulation
        const bigGrids = [];
        for (let i = 0; i < 3; i++) {
            bigGrids.push(smallGrids.slice(i * 3, i * 3 + 3));
        }

        // Check for winner in big grid
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            const firstGrid = bigGrids[Math.floor(a / 3)][a % 3];
            if (firstGrid && firstGrid === bigGrids[Math.floor(b / 3)][b % 3] && firstGrid === bigGrids[Math.floor(c / 3)][c % 3]) {
                return firstGrid;
            }
        }

        return null;
    };

    // Check for winner in small grid
    const checkWinnerSmall = (grid) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            if (grid[a % 3][Math.floor(a / 3)] && grid[a % 3][Math.floor(a / 3)] === grid[b % 3][Math.floor(b / 3)] && grid[a % 3][Math.floor(a / 3)] === grid[c % 3][Math.floor(c / 3)]) {
                return grid[a % 3][Math.floor(a / 3)];
            }
        }

        return null;
    };

    useEffect(() => {
        if (myPlayer === 'O' && !playerHasPlayedOnce) {
            handleAIMove(gameState);
        }
    }, [myPlayer, playerHasPlayedOnce, gameState]);

    // Render the game grid
    const renderGrid = () => {
        const bigGrids = [];
        for (let i = 0; i < 3; i++) {
            const rowGrids = [];
            for (let j = 0; j < 3; j++) {
                const gridIndex = i * 3 + j;
                rowGrids.push(
                    <Grid.Column key={gridIndex}>
                        <SmallGrid
                             //if the same bigIndex as in the last cell position, pass the last cell position to the small grid
                            lastCellPosition={gameState.lastCellPosition && gameState.lastCellPosition.bigIndex === gridIndex ? gameState.lastCellPosition : null}
                            grid={gameState.grids[gridIndex]}
                            onClick={(row, col) => handlePlayerClick(gridIndex, row, col)}
                            disabled={gameState.winner || (gameState.activeGrid !== null && gameState.activeGrid !== gridIndex) || gameState.smallGrids[gridIndex]}
                            smallWin={gameState.smallGrids[gridIndex]}
                            bigWin={gameState.winner}
                        />
                    </Grid.Column>
                );
            }
            bigGrids.push(
                <Grid.Row key={i}>
                    {rowGrids}
                </Grid.Row>
            );
        }
        return (
            <div className="game-board">
                <Grid columns={3} centered>
                    {bigGrids}
                </Grid>
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <Header as="h2">
                        {gameState.winner ? `Player ${gameState.winner} wins!` : gameState.playerTurn === myPlayer ? `Your turn` : `AI's turn`}
                    </Header>
                    <Button onClick={() => {
                        setGameState({
                            lastCellPosition: null,
                            grids: Array(9).fill().map(() => Array(3).fill().map(() => Array(3).fill(null))),
                            smallGrids: Array(9).fill(null),
                            winner: null,
                            activeGrid: null,
                            playerTurn: 'X'
                        });
                    }}>Reset</Button>
                </div>
            </div>
        );
    };

    return (
        <div>
            {renderGrid()}
        </div>
    );
}

export default SoloGameBoard;

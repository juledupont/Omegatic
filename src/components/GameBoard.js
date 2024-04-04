import React, { useContext, useEffect, useState } from 'react';
import { Grid, Header, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import SmallGrid from './SmallGrid';
import { SocketContext } from "./context/SocketContext";
import { PlayerContext } from "./context/PlayerContext";

function GameBoard() {
    const socket = useContext(SocketContext);
    const {room, myPlayer} = useContext(PlayerContext);
    const [gameState, setGameState] = useState({
        room: room,
        lastCellPosition: null,
        grids: Array(9).fill().map(() => Array(3).fill().map(() => Array(3).fill(null))),
        smallGrids: Array(9).fill(null),
        winner: null,
        activeGrid: null,
        playerTurn: 'X' // Assume 'X' starts first
    });

    useEffect(() => {
        socket.on("game_state_update", (data) => {
            setGameState(data);
        });

        socket.on("game_reset", () => {
            setGameState({
                room: room,
                lastCellPosition: null,
                grids: Array(9).fill().map(() => Array(3).fill().map(() => Array(3).fill(null))),
                smallGrids: Array(9).fill(null),
                winner: null,
                activeGrid: null,
                playerTurn: 'X'
            });
        });

        return () => {
            socket.off("game_state_update");
            socket.off("game_reset");
        };
    }, [socket, gameState]);

    const handleClick = (bigIndex, row, col) => {
        if (myPlayer !== gameState.playerTurn) {
            return;
        }
        else{
            // Check if the selected grid has already been won
            if (gameState.smallGrids[bigIndex]) {
                return;
            }
        
            if (gameState.winner || gameState.grids[bigIndex][row][col] || (gameState.activeGrid !== null && gameState.activeGrid !== bigIndex)) {
                return;
            }
        
            const newGrids = gameState.grids.map(bigGrid => bigGrid.map(row => row.slice())); // Deep copy of grids
            newGrids[bigIndex][row][col] = gameState.playerTurn;
            const lastCellPosition = { bigIndex, row, col, player: gameState.playerTurn};
        
            const newSmallGrids = [...gameState.smallGrids]; // Shallow copy of smallGrids
            if (checkWinnerSmall(newGrids[bigIndex])) {
                newSmallGrids[bigIndex] = gameState.playerTurn;
            }
        
            const newActiveGrid = newSmallGrids[row * 3 + col] ? null : row * 3 + col;
        
            const updatedGameState = {
                room: gameState.room,
                lastCellPosition: lastCellPosition,
                grids: newGrids,
                smallGrids: newSmallGrids,
                winner: checkWinnerBig(newSmallGrids),
                activeGrid: newActiveGrid,
                playerTurn: gameState.playerTurn === 'X' ? 'O' : 'X' // Switch player turn
            };

            setGameState(updatedGameState);
            // Emit the updated game state to the server
            
            socket.emit("update_game_state", updatedGameState);

        }
        
    };
    

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

    const checkWinnerSmall = (grid) => {
        // Check for winner in small grid
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
                            onClick={(row, col) => handleClick(gridIndex, row, col)}
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
                <Grid columns={3} centered >
                    {bigGrids}
                </Grid>
                <div style={{marginTop: '30px', textAlign: 'center'}}>
                    <Header as="h2">
                        {gameState.winner ? `Player ${gameState.winner} wins!` : gameState.playerTurn === myPlayer ? "Your turn " : "Opponent's turn "}
                    </Header>
                    <Button onClick={() => {
                        socket.emit("reset_game", { room: gameState.room });
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

export default GameBoard;

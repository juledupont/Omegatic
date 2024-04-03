import React from 'react';
import { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import SmallGrid from './SmallGrid';

class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPlayer: 'X',
            grids: Array(9).fill().map(() => Array(3).fill().map(() => Array(3).fill(null))),
            smallGrids: Array(9).fill(null),
            winner: null,
            activeGrid: null
        };
    }

    handleClick(bigIndex, row, col) {
        const { currentPlayer, grids, smallGrids, winner, activeGrid } = this.state;
        const smallIndex = row * 3 + col;
    
        // Check if the selected grid has already been won
        if (smallGrids[bigIndex]) {
            return;
        }
    
        if (winner || grids[bigIndex][row][col] || (activeGrid !== null && activeGrid !== bigIndex)) {
            return;
        }
    
        const newGrids = grids.map(bigGrid => bigGrid.map(row => row.slice())); // Deep copy of grids
        newGrids[bigIndex][row][col] = currentPlayer;
    
        const newSmallGrids = [...smallGrids]; // Shallow copy of smallGrids
        if (this.checkWinnerSmall(newGrids[bigIndex])) {
            newSmallGrids[bigIndex] = currentPlayer;
            console.log(newSmallGrids);
        }
    
        const newActiveGrid = newSmallGrids[smallIndex] ? null : smallIndex;

        console.log("player " + currentPlayer + " clicked on grid " + bigIndex + " at position " + row + ", " + col);
    
        this.setState({
            currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
            grids: newGrids,
            smallGrids: newSmallGrids,
            winner: this.checkWinnerBig(newSmallGrids), // Check for winner in big grid
            activeGrid: newActiveGrid
        });
    }
    
    checkWinnerBig(smallGrids) {
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
    }

    checkWinnerSmall(grid) {
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
    }

    renderGrid() {
        const bigGrids = [];
        for (let i = 0; i < 3; i++) {
            const rowGrids = [];
            for (let j = 0; j < 3; j++) {
                const gridIndex = i * 3 + j;
                rowGrids.push(
                    <Grid.Column>
                        <SmallGrid
                            grid={this.state.grids[gridIndex]}
                            onClick={(row, col) => this.handleClick(gridIndex, row, col)}
                            disabled={this.state.winner || (this.state.activeGrid !== null && this.state.activeGrid !== gridIndex)}
                            smallWin={this.state.smallGrids[gridIndex]}
                            bigWin={this.state.winner}
                        />
                    </Grid.Column>
                );
            }
            bigGrids.push(<Grid.Row>{rowGrids}</Grid.Row>);
        }
        return (
            <div className="game-board">
                <Grid columns={3} centered >
                    {bigGrids}
                </Grid>
                <div style={{marginTop: '50px', textAlign: 'center'}}>
                    {this.state.winner ? `Player ${this.state.winner} wins!` : `Player ${this.state.currentPlayer}'s turn`}
                    <button onClick={() => this.setState({
                        currentPlayer: 'X',
                        grids: Array(9).fill().map(() => Array(3).fill().map(() => Array(3).fill(null))),
                        smallGrids: Array(9).fill(null),
                        winner: null,
                        activeGrid: null
                    })}>Reset</button>
                </div>
            </div>
        );
    }

    render() {
        return this.renderGrid();
    }
}

export default GameBoard;

import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Button, Segment, Icon } from 'semantic-ui-react';

class SmallGrid extends React.Component {
    renderIcon(cellValue) {
        if (cellValue === 'X') {
            return <Icon name="close"/>;
        } else if (cellValue === 'O') {
            return <Icon name="circle outline"/>;
        }
    }

    render() {
        const { grid, onClick, disabled } = this.props;
        const { lastCellPosition } = this.props; // Get last cell position from props

        return (
            <Segment style={{minWidth:"130px"}} color={this.props.bigWin === 'X' && this.props.smallWin==='X' ? 'green' : this.props.bigWin === 'O' && this.props.smallWin==='O' ? 'red' : null}>
                <Grid columns={3} textAlign="center">
                    {grid.map((row, i) => (
                        <Grid.Row key={i}>
                            {row.map((cell, j) => (
                                <Grid.Column key={j}>
                                    <Button icon onClick={() => onClick(i, j)} disabled={disabled} active color={
                                            (cell === 'X' && this.props.smallWin === 'X') ? 'green' :
                                            (cell === 'O' && this.props.smallWin === 'O') ? 'red' :
                                            (lastCellPosition && lastCellPosition.row === i && lastCellPosition.col === j && lastCellPosition.player==='O') ? 'yellow' : 
                                            (lastCellPosition && lastCellPosition.row === i && lastCellPosition.col === j && lastCellPosition.player==='X') ? 'blue': null // Apply yellow color to last cell played
                                        }>
                                        {this.renderIcon(cell)}
                                    </Button>
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                    ))}
                </Grid>
            </Segment>
        );
    }
}

export default SmallGrid;

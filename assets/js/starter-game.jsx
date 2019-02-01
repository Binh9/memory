import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}


class Starter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: this.assignTiles(),
            tilesLeft: 16,
            clickAllow: true,
            numClicks: 0,
            matching: false,
            openID: -1
        }
    }
    
    // Assigns the values to the tiles 
    // Return the array of tiles, where each tile has letter, visiability, and done
    assignTiles() {
        let values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        let randValues = this.shuffle(values);

        let outArr = [];
        for (var i = 0; i < 16; i++) {
            outArr.push({
                value: randValues[i],
                visible: false,
                done: false
            }); 
        }
        return outArr;

    } 

    // Shuffles the array
    shuffle(arr) {
        let i;
        let j;
        let temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
    
        }
        return arr;    
    }

    // Handle the clicks
    handleClick(i) {
        // Clicks is allowed and the chosed tile is not visible
        if (this.state.clickAllow && !this.state.tiles[i].visible && !this.state.tiles[i].done) {

            // This is the guessing process
            if (this.state.matching) {
                
                let copy = this.state.tiles.slice();
                copy[i].visible = true;

                // Render the second one
                this.setState({
                    tiles: copy,
                    clickAllow: false
                });
                                
                // Successful matching
                if (this.state.tiles[i].value === this.state.tiles[this.state.openID].value) {
                    
                    let cpp = this.state.tiles.slice();

                    cpp[i].done = true;
                    cpp[this.state.openID].done = true;

                    window.setTimeout(() => {
                        this.setState({
                            tiles: cpp,
                            tilesLeft: this.state.tilesLeft - 2,
                            clickAllow: true,
                            numClicks: this.state.numClicks + 1,
                            matching: false,
                            openID: -1
                        });
                    }, 1000);
                }
                // Failed matching
                else {
                    
                    let cc = this.state.tiles.slice();

                    cc[i].visible = false;
                    cc[this.state.openID].visible = false;
    
                    window.setTimeout(() => {
                        this.setState({
                            tiles: cc,
                            clickAllow: true,
                            numClicks: this.state.numClicks + 1,
                            matching: false,
                            openID: -1
                        });
                    }, 1000);
                }
            }
            else {
                let cp = this.state.tiles.slice();
                cp[i].visible = true;

                // Reveals the chosen tile
                this.setState({
                    tiles: cp,
                    numClicks: this.state.numClicks + 1,
                    matching: true,
                    openID: i
                });
            }    
        }
    }

    // Handles the reset
    reset() {
        this.setState({
            tiles: this.assignTiles(),
            tilesLeft: 16,
            clickAllow: true,
            numClicks: 0,
            matching: false,
            openID: -1
        });
    }

    // Renders a Tile
    renderTile(i) {
        return (
            <Tile
                value = {this.state.tiles[i].value}
                onClick = {this.handleClick.bind(this, i)}
                visible = {this.state.tiles[i].visible}
            />
        );
    }
    
    // Renders the web
    render() {

        let status;

        if (this.state.tilesLeft > 0) {
            status = this.state.numClicks;
        }
        else {
            status = "Good job!";
        }

        return (
            <div>
                <div className="status"> {status} </div>

                <button className="resetBtn" onClick={() => this.reset()}>Reset</button>
                <div className="row">
                    {this.renderTile(0)}
                    {this.renderTile(1)}
                    {this.renderTile(2)}
                    {this.renderTile(3)}
                </div>
                <div className="row">
                    {this.renderTile(4)}
                    {this.renderTile(5)}
                    {this.renderTile(6)}
                    {this.renderTile(7)}
                </div>
                <div className="row">
                    {this.renderTile(8)}
                    {this.renderTile(9)}
                    {this.renderTile(10)}
                    {this.renderTile(11)}
                </div>
                <div className="row">
                    {this.renderTile(12)}
                    {this.renderTile(13)}
                    {this.renderTile(14)}
                    {this.renderTile(15)}
                </div>
            </div>
        );
    }
}


// Represents a tile on the board
function Tile(props) {
    let display = '';

    if (props.visible) {
        display = props.value;
    }
    return (
        <button className="tile" onClick={props.onClick}>
            {display}
        </button>
    );
}




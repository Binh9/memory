import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

//export default function game_init(root) {
//  ReactDOM.render(<Starter />, root);
//}

export default function game_init(root, channel) {
    ReactDOM.render(<Starter channel={channel} />, root);
}

// Client-Side for Memory is :
// {
// tiles: tiles in the game
// tilesleft: tiles left to solve
// clickAllow: flag if clicking is allowed
// numClicks: numberOfClicks
// matching: true if the second tile is being open
// openID: stores the id of the first open tile

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

	this.channel
	    .join()
	    .receive("ok", this.got_view.bind(this))
	    .receive("error", resp => { console.log("Unable to join", resp); });
    }


    got_view(view) {
	console.log("new view", view);
	this.setState(view.game);
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

    // Handles not matching case 
    handleNotMatching(i) {
        let cc = this.state.tiles.slice();

        cc[i].visible = false;
        cc[this.state.openID].visible = false;

        window.setTimeout(() => {
            this.setState({
                tiles: cc,
                clickAllow: true,
                matching: false,
                openID: -1
            });
        }, 1000);
    }


    // Handle the clicks
    handleClick(i) {
        // Clicks is allowed and the chosed tile is not visible
        if (this.state.clickAllow && !this.state.tiles[i].visible && !this.state.tiles[i].done) {

            // to render the open tile
            let copy = this.state.tiles.slice();
            copy[i].visible = true;
 
            this.setState({
                tiles: copy,
                numClicks: this.state.numClicks + 1,
            });

            // This is the guessing process
            if (this.state.matching) {

                // not allow click after the second tile is selected
                this.setState({
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
                            matching: false,
                            openID: -1
                        });
                    }, 1000);
                }

                // Failed matching
                else {

                    this.setState({
                        tiles: copy,
                        numClicks: this.state.numClicks + 1,
                    }, () => this.handleNotMatching(i));
                }
            }
            else {
                // first tile was selected
                this.setState({
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




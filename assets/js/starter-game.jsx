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
            tiles: this.assignDummy(),
            tilesLeft: 16,
            numClicks: 0,
            openID: -1
        }
    this.channel = props.channel;  
 	  this.channel
	    .join()
	    .receive("ok", this.got_view.bind(this))
	    .receive("error", resp => { console.log("Unable to join", resp); });
    }

    // Assigns dummy values to the 
    assignDummy() {
        let outArr = [];
        for (var i = 0; i < 16; i++) {
            outArr.push({
              id: i,
              value: "GUESS",
              visible: false,
              done: false
            }); 
        }
        return outArr;
    }


    got_view(view) {
	    console.log("new view", view);
	    this.setState(view.game);
    }

    // Handle the clicks
    handleClick(i) {
      // TILE is clicked --> we tell channel
      // if the tile is not visible
      if (!this.state.tiles[i].visible) {
        // Reveal the card
        this.channel.push("reveal", { id: i })
                    .receive("ok", this.got_view.bind(this))

        this.channel.push("guess", { id: i })
                    .receive("ok", this.got_view.bind(this))
      }
    }

    // Handles the reset
    reset() {
        this.channel.push("reset", {})
                    .receive("ok", this.got_view.bind(this))
    }

    // Renders a Tile
    renderTile(i) {
        return (
            <Tile
                id = {i}
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
            status = "Good job! Your Score is " + this.state.numClicks;
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




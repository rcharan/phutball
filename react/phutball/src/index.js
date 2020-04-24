import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BoardState, initialState, initialBallLoc } from './gameLogic/boardState'
import { empty, player, ball } from './gameLogic/locationState'

class Game extends React.Component {
	constructor(props) {
		super(props);
		const initialBoard = new BoardState(initialState, initialBallLoc)
		this.state = {
			board   : initialBoard,
			xIsNext : true,
			history : [initialBoard]
		};
	}

	doMove(moveInfo) {
		if (moveInfo === null) {
			return
		}
		this.setState({
			board   : moveInfo.board,
			xIsNext : !this.state.xIsNext,
			history : this.state.history.concat([moveInfo]),
		})
	}

	handlePlacement(flatIndex) {
		const moveInfo = this.state.board.place(flatIndex);
		this.doMove(moveInfo)
	}

	handleJump(jumpStr) {
		const moveInfo = this.state.board.jump(jumpStr);
		this.doMove(moveInfo)
	}

	render() {
		return (
			<div className = "game">
				<div className = "game-board">
					<Board 
						boardState = {this.state.board}
						onPlace    = {(i) => this.handlePlacement(i)}
					/>
				</div>
				<div className = "game-info">
					<div>Next player: {this.state.xIsNext ? 'X' : 'O'}</div>
					<div className = "jumps"><h1>Jumps</h1><br/>
						<JumpList
							boardState = {this.state.board}
							onJump     = {(jumpStr) => this.handleJump(jumpStr)}
						/>
					</div>
				</div>
			</div>


		)
	}
}

class JumpList extends React.Component {
	render() {
		return (
			<ol>
			{this.props.boardState.getLegalJumps().map(jumpStr => 
				<li key={jumpStr}>
				<JumpButton
					str     = {jumpStr}
					onClick = {() => this.props.onJump(jumpStr)}
				/></li>
			)}
			</ol>
		)
	}

}

class JumpButton extends React.Component {
	render () {
		return (
		    <button 
		    	className="jump"
		    	onClick={this.props.onClick}
		    	key={this.props.str}
		    >
		    	{this.props.str}
		    </button>
		)
	}
}

class Board extends React.Component {
	renderSquare(index, contents) {
		return (
			<Square 
				contents = {contents}
				onClick  = {() => this.props.onPlace(index)}
				index    = {index}
			/>
		)
	}

	renderRow(rowArray) {
		return (rowArray.map(data => this.renderSquare(data.index, data.contents)))
	}

	render() {
		return (this.props.boardState.boardArray.map(row => 
			<div className="board-row">
				{this.renderRow(row)}
			</div>
		))
	}
}

function Square(props) {
	if (props.contents === empty) {
		return (
		    <button className="square" onClick={props.onClick} key={props.index}></button>
		)	
	} else if (props.contents === player) {
		return (
		    <button className="square" onClick={props.onClick} key={props.index}>
		    	<div className="player"/>
		    </button>
		)
	} else if (props.contents === ball) {
			return (
		    <button className="square" onClick={props.onClick} key={props.index}>
		    	<div className="ball"/>
		    </button>
		)
	}
}

ReactDOM.render(<Game />, document.getElementById("root"));

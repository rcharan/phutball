import React from 'react';
import { BoardState, initialState, initialBallLoc } from '../gameLogic/boardState'
import Board from './board'
import JumpList from './jump'
import History from './history'

class Game extends React.Component {
	constructor(props) {
		super(props);
		const initialBoard = new BoardState(initialState, initialBallLoc)
		this.state = {
			board   : initialBoard,
			xIsNext : true,
			history : [{moveStr : 'Reset', board : initialBoard}],
			moveNum : 1, // Number of move about to be made, 0 is start-of-game
			jumpMouseOver : null,
		};
	}

	doMove(moveInfo) {
		if (moveInfo === null) {
			return
		}
		this.setState({
			board         : moveInfo.board,
			xIsNext       : !this.state.xIsNext,
			history       : this.state.history.slice(0, this.state.moveNum).concat([moveInfo]),
			moveNum 	  : this.state.moveNum + 1,
			jumpMouseOver : null,
		})
	}

	handlePlacement(flatIndex) {
		if (this.state.board.gameOver) {
			return
		} else {
			const moveInfo = this.state.board.place(flatIndex);
			this.doMove(moveInfo)
		}
	}

	handleJump(jumpObj) {
		const moveInfo = this.state.board.jump(jumpObj);
		this.doMove(moveInfo)
	}

	handleHistory(moveNum) {
		this.setState({
			board   : this.state.history[moveNum].board,
			xIsNext : (moveNum % 2 === 0),
			history : this.state.history,
			moveNum : moveNum + 1,
			jumpMouseOver : null,
		})
	}

	handleJumpMouseEnter(jumpObj) {
		this.setState({
			board         : this.state.board,
			xIsNext       : this.state.xIsNext,
			history       : this.state.history,
			moveNum 	  : this.state.moveNum,
			jumpMouseOver : jumpObj,
		})
	}

	handleJumpMouseLeave() {
		this.setState({
			board         : this.state.board,
			xIsNext       : this.state.xIsNext,
			history       : this.state.history,
			moveNum       : this.state.moveNum,
			jumpMouseOver : null,
		})
	}

	renderBoard() {
		return (
			<div className = "game-board">
				<Board 
					boardState     = {this.state.board}
					onPlace        = {(i) => this.handlePlacement(i)}
					jumpMouseOver  = {this.state.jumpMouseOver}
				/>
			</div>
		)
	}

	renderNextMove() {
		if (this.state.board.gameOver) {
			return (
				<div><h1>
					Winner: {this.state.board.winner ? 'X' : 'O'}
				</h1></div>
			)
		} else {
			return (
				<div>
					<h1>
						Next player: {this.state.xIsNext ? 'X' : 'O'} <br/>
					</h1>
					Playing towards: {this.state.xIsNext ? 'Right' : 'Left'}
				</div>
			)
		}
			
	}

	renderJumpList() {
		if (this.state.board.gameOver) {
			return null
		} else {
			return (
				<div className = "jumps"><h1>Jumps</h1><br/>
					<JumpList
						boardState   = {this.state.board}
						onJump       = {(jumpObj) => this.handleJump(jumpObj)}
						onMouseEnter = {(jumpObj) => this.handleJumpMouseEnter(jumpObj)}
						onMouseLeave  = {()       => this.handleJumpMouseLeave()}
					/>
				</div>
			)
		}
	}

	renderHistory() {
		return (
			<div className = "history"><h1>History</h1><br/>
				<History
					history     = {this.state.history}
					onClick     = {(moveNum) => this.handleHistory(moveNum)}
				/>
			</div>
		)
	}

	renderGameInfo() {
		return (
			<div className = "game-info">
				{[
					this.renderNextMove(),
					this.renderJumpList(),
					this.renderHistory()
				]}
			</div>
		)	
	}

	render() {
		return (
			<div className = "game">
				{[this.renderBoard(),
				  this.renderGameInfo()]}
			</div>
		)
	}
}


export default Game
import React from 'react';
import { BoardState, initialState, initialBallLoc } from '../gameLogic/boardState'
import Board from './board'
import JumpList from './jump'
import History from './history'
import AI from './ai'

class Game extends React.Component {
	constructor(props) {
		super(props);
		const initialBoard = new BoardState(initialState, initialBallLoc)
		this.state = {
			board         : initialBoard,
			xIsNext       : true,
			history       : [{moveStr : 'Reset', board : initialBoard}],
			moveNum       : 1, // Number of move about to be made, 0 is start-of-game
			jumpMouseOver : null,
		};
	}

	get isAiTurn() {
		if (this.state.board.gameOver) {
			return false
		} else if ((this.props.aiPlayer === 'X' && this.state.xIsNext) ||
				   (this.props.aiPlayer === 'O' && !this.state.xIsNext)) {
		   	return true
	    } else {
	    	return false
	    }
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
		if (this.state.board.gameOver || this.isAiTurn) {
			return
		} else {
			const moveInfo = this.state.board.place(flatIndex);
			this.doMove(moveInfo)
		}
	}

	handleJump(jumpObj) {
		if (this.state.board.gameOver || this.isAiTurn) {
			return
		} else {
			const moveInfo = this.state.board.jump(jumpObj);
			this.doMove(moveInfo)
		}
	}

	handleHistory(moveNum) {
		this.setState({
			board         : this.state.history[moveNum].board,
			xIsNext       : (moveNum % 2 === 0),
			history       : this.state.history,
			moveNum       : moveNum + 1,
			jumpMouseOver : null,
		})
	}

	handleJumpMouseEnter(jumpObj) {
		this.setState({
			jumpMouseOver : jumpObj,
		})
	}

	handleJumpMouseLeave() {
		this.setState({
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
		} else if (this.isAiTurn) {
			return (
				<AI
					board    ={this.state.board}
					playRight={this.state.xIsNext}
					doMove   ={(move) => this.doMove(move)}
				/>
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
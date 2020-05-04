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
			moveNum : 1 // Number of move about to be made, 0 is start-of-game
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
			jumpMouseOver : null
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

	handleHistory(moveNum) {
		this.setState({
			board   : this.state.history[moveNum].board,
			xIsNext : (moveNum % 2 === 0),
			history : this.state.history,
			moveNum : moveNum + 1
		})
	}

	handleJumpMouseOver(jumpStr) {
		this.setState({
			board         : this.state.board,
			xIsNext       : this.state.xIsNext,
			history       : this.state.history,
			moveNum 	  : this.state.moveNum,
			jumpMouseOver : jumpStr
		})
	}

	handleJumpMouseLeave() {
		this.setState({
			board         : this.state.board,
			xIsNext       : this.state.xIsNext,
			history       : this.state.history,
			moveNum       : this.state.moveNum,
			jumpMouseOver : null
		})
	}

	render() {
		return (
			<div className = "game">
				<div className = "game-board">
					<Board 
						boardState    = {this.state.board}
						onPlace       = {(i) => this.handlePlacement(i)}
						jumpMouseOver = {this.state.jumpMouseOver}
					/>
				</div>
				<div className = "game-info">
					<div>Next player: {this.state.xIsNext ? 'X' : 'O'}</div>
					<div className = "jumps"><h1>Jumps</h1><br/>
						<JumpList
							boardState   = {this.state.board}
							onJump       = {(jumpStr) => this.handleJump(jumpStr)}
							onMouseEnter = {(jumpStr) => this.handleJumpMouseOver(jumpStr)}
							onMouseLeave  = {()        => this.handleJumpMouseLeave()}
						/>
					</div>
					<div className = "history"><h1>History</h1><br/>
						<History
							history     = {this.state.history}
							onClick     = {(moveNum) => this.handleHistory(moveNum)}
						/>
					</div>
				</div>
			</div>


		)
	}
}


export default Game
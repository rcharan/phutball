import React from 'react';
import { BoardState, initialState, initialBallLoc, emptyState, emptyBallLoc} from '../gameLogic/boardState'
import Board from './board'
import JumpList from './jump'
import History from './history'
import Rules from './rules'
import BackButton from './backbutton'
import { HelpI, HelpII } from './help'
import { ReactComponent as Logo } from '../icons/philosphers-play-football.svg'
import AI from './ai'
import API from '../api'
import './game.css'
import { withRouter } from "react-router-dom";
import ErrorNotifier from './errorNotifier'


class Game extends React.Component {
	constructor(props) {
		super(props);

		const gameID     = this.props.match.params.gameID
		const emptyBoard = new BoardState(emptyState, emptyBallLoc);

		this.state = {
			board         : emptyBoard,
			gameID        : gameID,
			player0Name   : "X's",
			player1Name   : "O's",
			aiPlayer      : false,
			aiPlayerNum   : false,
			history       : [],
			moveNum       : 0, // Number of move about to be made, 0 is start-of-game
			jumpMouseOver : null,
			xIsNext       : false,
			loadStatus    : 'waiting',
			errorStatus   : null,
			offlineMoveQueue  : []
		};
		this.api = new API(gameID)

	}

	loadOffline(error) {
		const initialBoard = new BoardState(initialState, initialBallLoc)
		this.setState({
			board      : initialBoard,
			history    : [{moveStr : 'Reset', board : initialBoard}],
			xIsNext    : true,
			moveNum    : 1,
			loadStatus : 'failed',
			errorStatus: error
			offlineMoveQueue : [{moveNum: 0, moveStr : 'Reset', board : initialBoard}]
		})	
	}

	goOffline(error, moveInfo, oldMoveNum) {
		moveInfo[moveNum] = oldMoveNum;
		this.setState({
			loadStatus       : 'failed',
			errorStatus      : error
			offlineMoveQueue : this.state.offlineMoveQueue.concat([moveInfo])
		})
	}

	componentDidMount() {
		this.api.getGame().then(result => {
			result['loadStatus'] = 'ready'
			this.setState(result);
		}).catch(error => this.loadOffline(error))
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
		const oldMoveNum = this.state.moveNum
		this.setState({
			board         : moveInfo.board,
			xIsNext       : !this.state.xIsNext,
			history       : this.state.history.slice(0, this.state.moveNum).concat([moveInfo]),
			moveNum 	  : oldMoveNum + 1,
			jumpMouseOver : null,
		})
		this.api.postMove(moveInfo, oldMoveNum).catch(error =>
			this.goOffline(error, moveInfo, oldMoveNum))
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
			<div key="gameboard" className = "game-board">
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
				<div className="nextPlayer" key="gameover"><h1>
					{this.state.board.winner ? this.state.player0Name : this.state.player1Name} wins!
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
				<div className="nextplayer" key="nextplayer">
						{this.state.xIsNext ?
											this.state.player0Name : 
											this.state.player1Name
									 } to play
					(Playing to the {this.state.xIsNext ? 'right' : 'left'})
				</div>
			)
		}
			
	}

	renderHelp() {
		return (
			<div key="help" className="help-section">
				<BackButton/> <Rules/> <HelpI/> <HelpII/>
			</div>
		)
	}

	renderJumpList() {
		if (this.state.board.gameOver || this.state.board.ballLoc === null) {
			return null
		} else {
			return (
				<div key="jumplist" className = "jumps"><h1>Jumps</h1>
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
		if (this.state.history.length === 0) {
			return null
		} else {
			return (
				<div key="history" className="history"><h1>History</h1>
					<History
						history     = {this.state.history}
						onClick     = {(moveNum) => this.handleHistory(moveNum)}
					/>
				</div>
			)
		}
	}

	renderAnyErrors() {
		if (this.state.loadStatus === 'failed') {
			return (
				<div key="error" className="error">
					<ErrorNotifier
						errorStatus={this.state.errorStatus}
					/>
				</div>
			)
		} else {
			return null
		}
	}

	renderGameInfo() {
		return (
			<div key="gameinfo" className="menu">
			<Logo/>
			<div key="gameinfo" className = "game-info">
				{[
					this.renderAnyErrors(),
					this.renderNextMove(),
					this.renderHelp(),
					this.renderJumpList(),
					this.renderHistory()
				]}
			</div>
			</div>
		)	
	}

	render() {
		if (this.state.loadStatus == 'waiting') {
			return <div className="loader">Loading</div>
		} else {
			return (
				<div className = "game">
					{[this.renderBoard(),
					  this.renderGameInfo()]}
				</div>
			)
		}
	}
}


export default withRouter(Game)
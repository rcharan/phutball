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
import './game.css'
import { withRouter } from "react-router-dom";
import ConnectionManager from '../api'
import LiveConnectionManager from '../ws'


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
			aiPlayer      : null,
			aiPlayerNum   : false, // False: x's, True: o's
			history       : [],
			moveNum       : 0, // Number of move about to be made, 0 is start-of-game
			jumpMouseOver : null,
			xIsNext       : false,
			loadStatus    : 'waiting', // waiting, online, or offline
			errorStatus   : null,
			errorMessage  : null,
			offlineMoveQueue  : [],
		};

		this.loadOffline      = this.loadOffline.bind(this)
		this.loadFromServer   = this.loadFromServer.bind(this)
		this.goOffline        = this.goOffline.bind(this)
		this.goOnline         = this.goOnline.bind(this)
		this.dequeueMove      = this.dequeueMove.bind(this)
		this.setGameID        = this.setGameID.bind(this)
		this.handleRemoteMove = this.handleRemoteMove.bind(this)
		this.goDead           = this.goDead.bind(this)

		window.game = this

	}

	get gameType() {
		if (this.props.type === 'live') {
			return 'live'
		} else if (this.state.aiPlayer === null) {
			return 'local'
		} else {
			return 'ai'
		}
	}

	get isLocalPlayerTurn() {
		if (this.state.board.gameOver) {
			return false
		} else if (this.props.localPlayer === null) {
			return !this.isAITurn
		} else if ((!this.props.localPlayer &&  this.state.xIsNext) ||
				  (  this.props.localPlayer && !this.state.xIsNext)) {
			return true
		} else {
			return false
		}
	}

	get isAITurn() {
		if (this.state.board.gameOver || this.state.aiPlayer === null) {
			return false
		} else if ((!this.state.aiPlayerNum &&  this.state.xIsNext) ||
				    (this.state.aiPlayerNum && !this.state.xIsNext)) {
		   	return true
	    } else {
	    	return false
	    }
	}

	loadOffline(error) {
		const initialBoard = new BoardState(initialState, initialBallLoc)
		this.setState({
			board      : initialBoard,
			history    : [{moveStr : 'Reset', board : initialBoard}],
			xIsNext    : true,
			moveNum    : 1,
			loadStatus : 'offline',
			errorStatus: error,
			offlineMoveQueue : [{moveNum: 0,
								 moveInfo: {
								 		moveStr : 'Reset',
									 	board : initialBoard
									}
								}]
		})	
	}

	loadFromServer(result) {
		result['loadStatus']   = 'online'
		result['errorMessage'] = null
		this.setState(result)
	}

	goOffline(error) {
		this.setState({
			loadStatus       : 'offline',
			errorStatus      : error,
		})
	}

	goDead(error) {
		this.setState({
			loadStatus       : 'offline',
			errorStatus      : error,
			errorMessage     : 'Connection issue. Please refresh the page.',
		})
	}

	goOnline() {
		this.setState({
			loadStatus : 'online',
			errorStatus: null,
		})
	}

	setGameID(gameID) {
		this.setState({gameID : gameID})
	}

	dequeueMove() {
		this.setState((state) => ({
			offlineMoveQueue : state.offlineMoveQueue.slice(1),
		}))
	}


	doMove(moveInfo) {
		if (moveInfo === null) {
			return 
		}
		else if (this.gameType !== 'local' && this.loadStatus === 'offline') {
			return
		}
		else if (this.gameType === 'local') {
			this.doMoveOffline(moveInfo)
		} else {
			this.doMoveOnline(moveInfo)
		}
	}

	doMoveOffline(moveInfo) {
		this.setState((state) => ({
			board            : moveInfo.board,
			xIsNext          : !state.xIsNext,
			history          : state.history.slice(0, this.state.moveNum).concat([moveInfo]),
			moveNum 	     : state.moveNum + 1,
			jumpMouseOver    : null,
			offlineMoveQueue : state.offlineMoveQueue.concat([{
				moveNum : state.moveNum,
				moveInfo: moveInfo,
			}])
		}))
	}

	doMoveOnline(moveInfo) {
		// Check whether the player can move

		// Make sure they haven't gone back in history
		if (this.state.history.length !== this.state.moveNum) {
			this.setState({
				errorMessage : 'Please move from the latest position',
			})
			this.handleHistory(this.state.history.length-1)
		}

		// Make sure the game isn't over
		else if (this.state.board.gameOver) {
			this.setState({
				errorMessage : "No more moves – the game is over!"
			})
		}

		// Make sure it is their turn
		else if (!this.isLocalPlayerTurn) {
			this.setState({
				errorMessage : "It's not your turn",
			})
		}

		// Make sure they aren't waiting for a previously made move to resolve
		else if (this.state.offlineMoveQueue.length !== 0) {
			this.setState({
				errorMessage : 'You already moved',
			})
		}

		else {
			// Queue up the move!
			this.setState((state) => ({
				offlineMoveQueue : [{
					moveNum : state.moveNum,
					moveInfo: moveInfo,
				}],
				errorMessage : null
			}))
		}
	}

	handleRemoteMove(moveInfo, moveNum) {
		this.setState((state) => {
			if (moveNum > state.history.length) { 
				return ({
					errorMessage : 'Out-of-order moves received. Refresh the page.',
					loadStatus   : 'offline',
				})
			} else if (moveNum < state.history.length) {
				return ({})
			} else {
				return ({
					board            : moveInfo.board,
					xIsNext	         : (moveNum % 2 === 0),
					history          : state.history.concat([moveInfo]),
					moveNum          : moveNum + 1,
					jumpMouseOver    : null,
					offlineMoveQueue : [],
					errorMessage     : null,
				})
			}
		})
	}

	handlePlacement(flatIndex) {
		if (this.state.board.gameOver || this.isAITurn) {
			return
		} else {
			const moveInfo = this.state.board.place(flatIndex);
			this.doMove(moveInfo)
		}
	}

	handleJump(jumpObj) {
		if (this.state.board.gameOver || this.isAITurn) {
			return
		} else {
			const moveInfo = this.state.board.jump(jumpObj);
			this.doMove(moveInfo)
		}
	}

	handleHistory(moveNum) {
		let xIsNext;

		if (this.gameType === 'local') {
			xIsNext = (state) => moveNum % 2 === 0
		} else {
			xIsNext = (state) => state.xIsNext
		}

		this.setState(state => ({
			board         : state.history[moveNum].board,
			xIsNext       : xIsNext(state),
			history       : state.history,
			moveNum       : moveNum + 1,
			jumpMouseOver : null,
		}))
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
		var out = []
		out.push(<div key="f" className="faceoff">
			{this.state.player0Name} (X) vs {this.state.player1Name} (O)
		</div>)



		// Case 1: Game is over
		if (this.state.board.gameOver) {
			out.push(
				<div className="nextPlayer" key="gameover"><h1>
					{this.state.board.winner ? this.state.player0Name : this.state.player1Name} wins!
				</h1></div>
			)

		// Case 2: you are playing against a bot, and it is the bot's turn
		} else if (this.gameType === 'ai' && this.isAITurn) {
			out.push(
				<AI
					name={this.state.aiPlayer}
				/>
			)

		// Case 3: you are playing remotely against a human, and it is their turn
		} else if (this.props.type === 'live' && !this.isLocalPlayerTurn) {
			out.push(
				<div className="nextplayer" key="nextplayer">
					Waiting for	{this.state.xIsNext ?
											this.state.player0Name : 
											this.state.player1Name
					} to play
				</div>
			)

		// Case 4: You are playing locally against another human
		} else if (this.gameType === 'local') {
			out.push(
				<div className="nextplayer" key="nextplayer">
						{this.state.xIsNext ?
											this.state.player0Name : 
											this.state.player1Name
									 } to play
					(Playing to the {this.state.xIsNext ? 'right' : 'left'})
				</div>
			)

		// Case 5: You are playing against a bot or a human and it is your turn
		} else {
			out.push(
				<div className="nextplayer alert" key="nextplayer">
					Your turn
				</div>
			)
		}

		out.push(<div key="e" className="error">{this.state.errorMessage}</div>)

		return out
		
	}

	renderHelp() {
		let connectionManager;
		if (this.gameType === 'local') {
			connectionManager = <ConnectionManager
					goOffline   = {this.goOffline}
					goOnline    = {this.goOnline}
					loadOffline = {this.loadOffline}
					loadOnline  = {this.loadFromServer}
					dequeue     = {this.dequeueMove}
					moveQueue   = {this.state.offlineMoveQueue}
					status      = {this.state.loadStatus}
					setGameID   = {this.setGameID}
					errorStatus = {this.state.errorStatus}	
					gameID      = {this.state.gameID}
					gameParams  = {{
						player_0_name : this.state.player0Name,
						player_1_name : this.state.player1Name,
						ai_player     : this.state.aiPlayer,
						ai_player_num : this.state.aiPlayerNum
					}}
			/>
		} else {
			connectionManager = <LiveConnectionManager
				goOffline   = {this.goOffline}
				goOnline    = {this.goOnline}
				loadOnline  = {this.loadFromServer}
				dequeue     = {this.dequeueMove}
				moveQueue   = {this.state.offlineMoveQueue}
				status      = {this.state.loadStatus}
				errorStatus = {this.state.errorStatus}	
				gameID      = {this.state.gameID}
				doMove      = {this.handleRemoteMove}
				gameType    = {this.gameType}
				goDead      = {this.goDead}
				gameParams  = {{
						player_0_name : this.state.player0Name,
						player_1_name : this.state.player1Name,
						ai_player     : this.state.aiPlayer,
						ai_player_num : this.state.aiPlayerNum
					}}
				/>

		}

		var gameLink = null
		if (this.gameType === 'live') {
			gameLink = (
				<div key="link">
				<br/>
				<div className = "no-select">
					Game Link:
				</div>
				<div className = "game-link">
					{`philosophers.football/live/${this.state.gameID}`}
				</div>
				</div>
			)
		}


		return (
			<div key="help" className="help-section">
				<BackButton/> <Rules/> <HelpI/> <HelpII/>
				{connectionManager} {gameLink}
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

	renderGameInfo() {
		return (
			<div key="gameinfo" className="menu">
				<Logo/>
				<div key="gameinfo2" className = "game-info">
					{[
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
		return (
			[
				this.state.loadStatus === 'waiting' ?
				<div className="loader" key="a">Loading</div> :
				null,

				<div className = "game" key="b">
					{[this.renderBoard(),
					  this.renderGameInfo()]}
				</div>
			]
		)
	}
}


export default withRouter(Game)
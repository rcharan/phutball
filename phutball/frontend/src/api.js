import React from 'react'
import axios from 'axios';
import Location       from './gameLogic/location'
import { BoardState } from './gameLogic/boardState'
import { ReactComponent as Cloud } from './icons/cloud.svg'
import { withRouter } from 'react-router-dom'

const API_URL = 'http://localhost:8000';
const BASE_POLL_FREQ = 500

class ConnectionManager extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			focus         : false,
			dead          : false,
		}

		this.timerID       = null
		this.pollFrequency = BASE_POLL_FREQ
		this.api = new API(this.props.gameID)
		this.requestIsPending = false // Force async calls to behave synchronously internally

		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleClick      = this.handleClick.bind(this)

	}

	redirect(gameID) {
		this.props.setGameID(gameID);
		this.props.history.push(`/game/${gameID}`)
		this.api = new API(gameID)
	}


	/**************************************************************************
	*
	* Background: Games can be created with an ID (online mode) or
	*  without (offline). State is contained in:
	*  - moveQueue, a queue of moves not yet posted
	*  - status: waiting (on initial load only), online or offline
	*  - gameID: "offline" or a valid gameID
	*  - the Browser's URL: which is either /game/offline or /game/:gameID
	*     depending on how the game was loaded (offline or online mode).
	*     Note that the URL does not have to match the game ID if the 
	*     URL is offline and the game has since been assigned an ID.
	*
	* Note: repeated requests are made with truncated exponential backoff
	*  (except that requests eventually terminate)
	*
	* Behaviour (testable behaviours numbered)
	*  - On loading offline, attempt to create a game.
	*
	*	  (1) On failure, play offline.
	*     Reconnection attempts will be made. If the full move history is
	*     later posted, the user is redirected to the online game with their 
	*     full move history available.
	*
	*     Internally, the game is locally assigned an ID when that ID is 
	*      created server side, and then redirect occurs after all history
	*      is posted.
	*    
	*     (2) On success, redirect to an online load
	*
	* - On loading online, attempt to load the game.
	*
	*     (3) On success, great!
	*     (4) On failure, redirect to an offline line.
	*
	* - (5) During online play, moves are posted asynchronously from being played
	* - (6) During online play, a failure to post goes to offline mode and 
	*        reconnection/reposting attempts are periodically made
	*
	**************************************************************************/

	tick() {
		if (this.requestIsPending) {
			return 
		}

		const closeRequest = (() => this.requestIsPending = false)

		if (this.props.status === 'waiting') {
			let promise;
			if (this.props.gameID === 'offline') {
				// Try to create a game, otherwise just play offline
				const game = this.api.createGame(this.props.gameParams)

				this.requestIsPending = true;
				promise = game.then(
					gameID => this.redirect(gameID)
				).catch(
					error => this.props.loadOffline(error)
				)

			} else {
				// Try to play online, otherwise redirect to offline
				const gameData = this.api.getGame()

				this.requestIsPending = true;
				promise = gameData.then(
					result => this.props.loadOnline(result)
				).catch(
					error  => this.redirect('offline')
				)
			}
			promise.finally(closeRequest).finally(() => this.setTimer())

		} else if (this.props.status === 'online') {
			// Try to post a move if there are any to post.
			//  on failure, go offline and set a timer
			//  to retry
			if (this.props.moveQueue.length === 0) {
				return
			} else {
				const data = this.props.moveQueue[0]
				const post = this.api.postMove(data.moveInfo, data.moveNum)

				this.requestIsPending = true;

				post.then(reponse => {
					this.props.dequeue(data);
				}).catch(error => {
					this.props.goOffline(error);
				}).finally(closeRequest)
			}
		} else if (this.props.status === 'offline') {

			// In case of successful reconnection and 
			//  now all data has been posted
			if (this.props.moveQueue.length === 0) {
				if (this.props.location.pathname.includes('offline')) {
					this.redirect(this.props.gameID)
				} else {
					this.props.goOnline()
				}

			// When loading offline, a new game will need 
			//  to be created before any moves are posted
			} else if (this.props.gameID === 'offline') {
				const game = this.api.createGame(this.props.gameParams)

				this.requestIsPending = true;
				game.then(
					gameID => {
						this.api = new API(gameID)
						this.props.setGameID(gameID)
						this.props.dequeue();
						this.revive()
					}
				).catch(
					() => {
						this.pollFrequency *= 2;
						this.resetTimer()
					}
				).finally(closeRequest)

			} else {
				const data = this.props.moveQueue[0]
				const post = this.api.postMove(data.moveInfo, data.moveNum)

				this.requestIsPending = true;

				post.then(response => {
					this.props.dequeue();
					this.revive()
				}
				).catch(error => {
					this.pollFrequency *= 2;
					this.resetTimer();
				}).finally(closeRequest)
			}

		}

	}

	revive() {
		this.pollFrequency = BASE_POLL_FREQ
		this.setState({dead : false})
		this.resetTimer()
	}

	resetTimer() {
		this.unsetTimer()
		if (this.pollFrequency >= (BASE_POLL_FREQ*64)) {
			this.setState({dead : true})
		} else {
			this.setTimer()
		}
	}

	setTimer() {
		this.timerID = setInterval(
			() => this.tick(),
			this.pollFrequency
		)
	}

	unsetTimer() {
		if (this.timerID !== null) {
		    clearInterval(this.timerID);
		    this.timerID = null
		}
	}

	componentDidMount() {
		this.tick()
	}

	componentWillUnmount() {
		this.unsetTimer()
	}

	handleMouseEnter() {
		this.setState({focus : true})
	}

	handleMouseLeave() {
		this.setState({focus: false})
	}

	handleClick() {
		this.pollFrequency = 1000;
		this.resetTimer()
	}

	// handleDismiss() {
	// 	this.setState({acknowledged : true})
	// }

	renderMessage() {
		if ((this.state.focus) && (this.props.status === 'offline')) {
			return (
				<div className = "float" id="error" key="0">
					<h1>Game is in offline mode<br/>({this.props.errorStatus.message})</h1>
					<ul>
						<li key="2"> This could by an issue with your Internet connection,
							the application, or a server issue</li>
						{
							this.state.dead ? 
							<li key="3">
								The game <div className="dead">will not
								attempt to reconnect</div> automatically.
								Click to reattempt.
							</li>
							:
							<li key="3"> The game will attempt to reconnect periodically.</li>
						}
						<li key="1"> Unsaved moves are greyed out </li>
					</ul>
				</div>
			)
	    } else if ((this.state.focus) && (this.props.status === 'online')) {
	    	return (
				<div className = "float" id="error" key="0">
					<h1>Game is in online mode</h1>
					<ul>
						<li key="1">Your moves are saved and you can return to the game
						at any time by navigating to the current URL</li>
					</ul>
				</div>
	    	)
	    } else {
			return null
		}
	}

	render() {
		let buttonClass
		if (this.props.status === 'offline') {
			if (this.state.dead) {
				buttonClass = 'dead'
			} else {
				buttonClass = 'offline'
			}
		} else {
			buttonClass = 'online'
		}
		return (
			[<button
				type="button"
				className={buttonClass}
				id="connection-status"
				onClick     ={this.handleClick}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				key="a"
			>
				<Cloud/>
			</button>,
			this.renderMessage()]
		)
	}
}






class API {
	constructor(gameID) {
		if (arguments.length === 0 || gameID === null || gameID === 'offline') {
			this.url = `${API_URL}/api/game/`

		} else {
			
			this.gameID = gameID
			this.url = `${API_URL}/api/game/${gameID}`;
		}
	}

	/**************************************************************************
	*
	* API Calls
	*
	**************************************************************************/

	getGame() {
		return axios.get(this.url).then(request => deserializeGame(request.data))
	}

	postMove(moveInfo, move_num) {
		var data = serializeMove(moveInfo)
		data.move_num = move_num
		data.game_id  = this.gameID

        return axios.post(this.url, data);

	}

	createGame(data) {
		return axios.put(this.url, data).then(request => request.data['game_id'])
	}


}



/**************************************************************************
*
* Serialization : Games
*
**************************************************************************/

function deserializeGame(data) {
	return {
		board         : deserializeBoard(data.board),
		gameID        : data.game_id,
		player0Name   : data.player_0_name,
		player1Name   : data.player_1_name,
		aiPlayer      : data.ai_player,
		aiPlayerNum   : data.ai_player_num,
		history       : data.history.map(deserializeMove),
		moveNum       : data.moveNum,
		jumpMouseOver : data.jumpMouseOver,
		xIsNext       : data.xIsNext,
	}
}

/**************************************************************************
*
* Serialization : Moves
*
**************************************************************************/

function serializeMove(moveInfo) {
	var data = serializeBoard(moveInfo.board);
	data.move_str = moveInfo.moveStr;

	return data

}

function deserializeMove(data) {
	return {
		moveStr : data.move_str,
		board   : deserializeBoard(data.board),
	}
}

/**************************************************************************
*
* Serialization : Boards
*
**************************************************************************/

function serializeBoard(board) {
	return {
		space_array : serializeSpaceArray(board.spaceArray),
		ball_loc    : serializeLocation(board.ballLoc),
	}
}

function deserializeBoard(data) {
	const loc = deserializeLocation(data.ball_loc);
	const spaceArray = deserializeSpaceArray(data.space_array)
	return new BoardState(spaceArray, loc)
}

function serializeSpaceArray(spaceArray) {
	return spaceArray.join('')
}

function deserializeSpaceArray(spaceArray) {
	return spaceArray.split('')	
}

/**************************************************************************
*
* Serialization : Locations
*
**************************************************************************/

function serializeLocation(loc) {
	return {
			number_index : loc.numberIndex,
			letter_index : loc.letterIndex,
	}
}

function deserializeLocation(data) {
	return new Location(null, data.letter_index, data.number_index)
}

export default withRouter(ConnectionManager);
export { API } 


import React from 'react'
import { ReactComponent as Cloud } from './icons/cloud.svg'

import { WS_URL_AI, WS_URL_LIVE} from './settings/settings'
import { API, serializeMove, deserializeBoard } from './api'


/**************************************************************************
*
* Connection Manager - for "online" games
*  Uses websockets, mostly
*
**************************************************************************/


export default class LiveConnectionManager extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			focus            : false,
			dead             : false,
			pendingResponse  : false,
		}

		this.api = new API(this.props.gameID)
		this.requestIsPending = false // Force async calls to behave synchronously internally

		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)

		console.log('constructing')
	}

	newWebSocket() {
		console.log('new socket')
		if (this.props.gameType === 'live') {
			this.ws = new WebSocket(WS_URL_LIVE + '/' + this.props.gameID)
		} else if (this.props.gameType === 'ai') {
			this.ws = new WebSocket(WS_URL_AI + '/' + this.props.gameID)
		} else {
			this.die()
		}
	}

	// load() {
	// 	if (this.props.status === 'waiting') {
	// 		const gameData = this.api.getGame()

	// 		gameData.then(
	// 			result => {
	// 				this.props.loadOnline(result)
	// 				this.setup()
	// 			}
	// 		).catch(
	// 			error  => {
	// 				this.die()
	// 			}
	// 		)	
	// 	}
	// }

	die() {
		this.props.goDead()	
		this.setState({dead : true})
	}

	setup() {
		this.newWebSocket()		

		this.ws.onopen = () => {
			this.props.goOnline()
		}

		this.ws.onmessage = event => {
			var data     = JSON.parse(event.data)
			const success  = data.success
			if (!success) {
				this.die()
				return
			}

			const moveInfo = {
				moveStr : data.move_data.move_str,
				board   : deserializeBoard(data.move_data)
			}

			const moveNum  = data.move_data.move_num

			this.props.doMove(moveInfo, moveNum)
			this.setState({pendingResponse : false})
		}

		this.ws.onclose = () => {
			this.die()
		}
	}

	componentDidMount() {
		this.setup()
	}

	componentDidUpdate() {
		if (this.state.pendingResponse || this.props.moveQueue.length === 0) {
			return	
		} else {
			this.setState({pendingResponse : true})

			const move = this.props.moveQueue[0]
			var data   = serializeMove(move.moveInfo)
			data.move_num = move.moveNum
			data.game_id   = this.props.gameID
			this.ws.send(JSON.stringify(data))
		}

	}


	handleMouseEnter() {
		this.setState({focus : true})
	}

	handleMouseLeave() {
		this.setState({focus: false})
	}


	renderMessage() {
		if ((this.state.focus) && (this.props.status === 'offline')) {
			return (
				<div className = "float" id="error" key="0">
					<h1>Game is in offline mode<br/>({this.props.errorStatus.message})</h1>
					<ul>
						<li key="2"> This could by an issue with your Internet connection,
							the application, or a server issue</li>
						<li key="1"> Refresh the page to attempt to reconnect</li>
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



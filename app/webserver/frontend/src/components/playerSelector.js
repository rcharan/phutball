import React from 'react'
import { API } from '../api'
import { withRouter } from "react-router-dom";

class PlayerSelector extends React.Component {
	constructor(props) {
		super(props)

		console.log(props)

		const gameID     = this.props.match.params.gameID

		this.state = {
			status : 'waiting',
			gameID : gameID
		}	

		this.api = new API(gameID)

	}

	componentDidMount() {
		this.api.getGame().then(data => this.setState({
			player0Name   : data.player0Name,
			player1Name   : data.player1Name,
			status        : 'loaded'
		})).catch(error => 
			this.setState({status : 'failed'})
		)
	}

	handleClick(playerLetter) {
		window.location.href=`/live/${this.state.gameID}/${playerLetter}`
	}

	content() {
		if (this.state.status === 'waiting') {
			return 'Loading'
		} else if (this.state.status === 'failed') {
			return 'Issue finding the game. Try refreshing the page'
		} else if (this.state.status === 'loaded') {
			return (
				<div className="loaderContent">
					Who are you playing as?
					<br/>
				<button className="playerSelector" onClick={() => this.handleClick('X')}>
					<div className="playertype">X's</div><div className="playerName">{this.state.player0Name}</div>
				</button>
				<button className="playerSelector" onClick={() => this.handleClick('O')}>
					<div className="playertype">O's</div><div className="playerName">{this.state.player1Name}</div>
				</button>
				</div>
			)
		}
	}

	render() {
		return (
			<div className="loader" key="a">
				{this.content()}	
			</div>
		)
	}
}


export default withRouter(PlayerSelector)
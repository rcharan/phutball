import React from 'react';
import { empty } from '../gameLogic/locationState'


class AI extends React.Component {
	render() {
		return (
			<div className="nextplayer" key="nextplayer">
					Waiting for	{this.props.aiPlayer.toUpperCase()} to play
			</div>
		)
	}
}

export default AI
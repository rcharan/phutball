import React from 'react';

class JumpList extends React.Component {
	render() {
		return (
			<ol>
			{this.props.boardState.getLegalJumps().map(jumpStr => 
				<li key={jumpStr}>
				<JumpButton
					str          = {jumpStr}
					onClick      = {() => this.props.onJump(jumpStr)}
					onMouseEnter = {() => this.props.onMouseEnter(jumpStr)}
					onMouseLeave = {this.props.onMouseLeave}
				/></li>
			)}
			</ol>
		)
	}

}

class JumpButton extends React.Component {
	render () {
		console.log(this.props.onMouseLeave)
		return (
		    <button 
		    	className    = "jump"
		    	onClick      = {this.props.onClick}
		    	key          = {this.props.str}
		    	onMouseEnter = {this.props.onMouseEnter}
		    	onMouseLeave = {this.props.onMouseLeave}
		    >
		    	{this.props.str}
		    </button>
		)
	}
}

export default JumpList
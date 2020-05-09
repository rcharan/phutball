import React from 'react';

class JumpList extends React.Component {
	render() {
		return (
			<ol>
			{this.props.boardState.getLegalJumps().toList().map(jumpObj => 
				<li key={jumpObj.toString()}>
				<JumpButton
					str          = {jumpObj.toString()}
					onClick      = {() => this.props.onJump(jumpObj)}
					onMouseEnter = {() => this.props.onMouseEnter(jumpObj)}
					onMouseLeave = {this.props.onMouseLeave}
				/></li>
			)}
			</ol>
		)
	}

}


function createJumpTree(jumpList) {
	var out = []	
}


class JumpButton extends React.Component {
	render () {
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
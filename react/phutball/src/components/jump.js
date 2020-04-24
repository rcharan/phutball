import React from 'react';

class JumpList extends React.Component {
	render() {
		return (
			<ol>
			{this.props.boardState.getLegalJumps().map(jumpStr => 
				<li key={jumpStr}>
				<JumpButton
					str     = {jumpStr}
					onClick = {() => this.props.onJump(jumpStr)}
				/></li>
			)}
			</ol>
		)
	}

}

class JumpButton extends React.Component {
	render () {
		return (
		    <button 
		    	className="jump"
		    	onClick={this.props.onClick}
		    	key={this.props.str}
		    >
		    	{this.props.str}
		    </button>
		)
	}
}

export default JumpList
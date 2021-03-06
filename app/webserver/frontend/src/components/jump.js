import React from 'react';

class JumpList extends React.Component {
	render() {
		const jumpChains = this.props.boardState.getLegalJumps().descendingChains()
		return (
			<div className="ol-container">
			<ol>
			{jumpChains.map((chain, i) => 
				<li key={i}>
					<JumpChain
						chain       ={chain}
						onClick     ={this.props.onJump}
						onMouseEnter={this.props.onMouseEnter}
						onMouseLeave={this.props.onMouseLeave}
					/>
				</li>
			)}
			</ol>
			</div>
		)
	}

}

class JumpChain extends React.Component {
	render() {
		const options = this.props.chain.map((elt, i) => 
		    <button 
				className    = {elt.repeated ? "repeat jump" : "new jump"}
				onClick      = {() => this.props.onClick(elt.value)}
				onMouseEnter = {() => this.props.onMouseEnter(elt.value)}
				onMouseLeave = {this.props.onMouseLeave}	
				key          = {i}
			>
				{elt.value.endLoc.toString()}
		    </button>
		)
		return options
	}
}



export default JumpList
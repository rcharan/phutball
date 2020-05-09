import React from 'react';

const intersperse = (arr, sep) => arr.reduce((a,v)=>[...a,v,sep],[]).slice(0,-1)

class JumpList extends React.Component {
	render() {
		const jumpChains = this.props.boardState.getLegalJumps().descendingChains()
		return (
			<ol>
			{jumpChains.map((chain, i) => 
				<li key={i}>
					<JumpChain
						chain       ={chain}
						onClick     ={this.props.onClick}
						onMouseEnter={this.props.onMouseEnter}
						onMouseLeave={this.props.onMouseLeave}
					/>
				</li>
			)}
			</ol>
		)
	}

}

class JumpChain extends React.Component {
	render() {
		const options = this.props.chain.map((elt, i) => 
		    <button 
				className    = {elt.repeated ? "repeat jump" : "new jump"}
				onClick      = {() => this.props.onJump(elt.value)}
				onMouseEnter = {() => this.props.onMouseEnter(elt.value)}
				onMouseLeave = {this.props.onMouseLeave}	
				key          = {i}
			>
				{elt.value.endLoc.toString()}
		    </button>
		)
		return options
		// return intersperse(options, '-')
	}
}



export default JumpList
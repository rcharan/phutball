import React from 'react';
import { empty } from '../gameLogic/locationState'


class AI extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			status : {moveStr : 'thinking'},
			time   : 0
		}

	}

	tick() {
		this.setState({time : this.state.time + 1})
		if (this.state.time === 3) {
			this.setState({status : this.randomMove()})
		} else if (this.state.time >= 5) {
			this.props.doMove(this.state.status)	
		}
	};

	componentDidMount() {
	    this.timerID = setInterval(
    	  () => this.tick(),
	    1000
	    )
    };

	componentWillUnmount() {
    	clearInterval(this.timerID);
	}

	randomMove() {
		const possibleMoves = this.availableMoves()
		const moveNum = Math.floor(Math.random() * possibleMoves.length)
		return possibleMoves[moveNum]
	}

	render() {
		return (<div><h1>Hello, it's RandoTron</h1>
			<h2>I have status: {this.state.status.moveStr}</h2>
			<h2> Time elapsed: {this.state.time} seconds </h2>
		</div>
		)
	}

	availableMoves() {
		// Start by figuring out where a placement is possible
		var placements = this.props.board.spaceArray

		// Tag with the flat index
		placements = placements.map((contents, i) => ({
			contents  : contents,
			flatIndex : i
		}));

		// Only allow placement in empty spaces
		placements = placements.filter(obj => obj.contents === empty)

		// Turn each placement into a moveInfo Object
		placements = placements.map(obj => this.props.board.place(obj.flatIndex))


		// Next look at the jumps
		var jumps = this.props.board.getLegalJumps()

		// Turn each jump into a moveInfo object
		jumps = jumps.map(jump => this.props.board.jump(jump))

		return [...placements, ...jumps]
	}

}

export default AI
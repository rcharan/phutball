import React from 'react';
import { BoardState, initialState, initialBallLoc } from '../gameLogic/boardState'
import { empty, player, ball } from '../gameLogic/locationState'

class Board extends React.Component {
	renderSquare(index, contents) {
		return (
			<Square 
				contents = {contents}
				onClick  = {() => this.props.onPlace(index)}
				index    = {index}
			/>
		)
	}

	renderRow(rowArray) {
		return (rowArray.map(data => this.renderSquare(data.index, data.contents)))
	}

	render() {
		return (this.props.boardState.boardArray.map(row => 
			<div className="board-row">
				{this.renderRow(row)}
			</div>
		))
	}
}

function Square(props) {
	if (props.contents === empty) {
		return (
		    <button className="square" onClick={props.onClick} key={props.index}></button>
		)	
	} else if (props.contents === player) {
		return (
		    <button className="square" onClick={props.onClick} key={props.index}>
		    	<div className="player"/>
		    </button>
		)
	} else if (props.contents === ball) {
			return (
		    <button className="square" onClick={props.onClick} key={props.index}>
		    	<div className="ball"/>
		    </button>
		)
	}
}


export default Board
import React from 'react';
import { empty, player, ball } from '../gameLogic/locationState'

class Board extends React.Component {
	renderSquare(index, contents) {
		return (
			<Square 
				contents = {contents}
				onClick  = {() => this.props.onPlace(index)}
				index    = {index}
				key      = {index}
			/>
		)
	}

	renderRow(rowArray) {
		return (rowArray.map(data => this.renderSquare(data.index, data.contents)))
	}

	render() {
		return (this.props.boardState.boardArray.map((row, numberIndex) => 
			<div className="board-row" key={numberIndex}>
				{this.renderRow(row)}
			</div>
		))
	}
}

function Square(props) {
	if (props.contents === empty) {
		return (
		    <button className="square" onClick={props.onClick}></button>
		)	
	} else if (props.contents === player) {
		return (
		    <button className="square" onClick={props.onClick}>
		    	<div className="player"/>
		    </button>
		)
	} else if (props.contents === ball) {
			return (
		    <button className="square" onClick={props.onClick}>
		    	<div className="ball"/>
		    </button>
		)
	}
}


export default Board
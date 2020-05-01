import React from 'react';
import { empty, player, ball } from '../gameLogic/locationState'
import config from '../gameLogic/config'

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

	renderRow(rowArray, letterIndex) {
		console.log(letterIndex, config.letters[letterIndex])
		return (

		[<div className="label-square">{config.letters[letterIndex]}</div>].concat(
			rowArray.map(data => this.renderSquare(data.index, data.contents)),
			[<div className="label-square"></div>]
		))

	}

	renderColLabels() {
		const colLabels = [''].concat(
			Array(config.cols).fill().map((_, i) => i + 1),
			['']
		)
		return (
			<div className="board-row">	
			{colLabels.map(i =>
				<div className="label-square">
					{i}
				</div>
			)}
			</div>
		)
	}

	render() {
		return (
			[
				this.renderColLabels(),
				this.props.boardState.boardArray.map((row, letterIndex) => 
					<div className="board-row" key={letterIndex}>
						{this.renderRow(row, letterIndex)}
					</div>),
				this.renderColLabels()
			]
		)
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
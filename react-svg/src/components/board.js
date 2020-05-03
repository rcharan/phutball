import React from 'react';
import { empty, player, ball } from '../gameLogic/locationState'
import config from '../gameLogic/config'


function map2DArray(array, func) {
	return array.map((row, i) => row.map((cell, j) => func(cell, i, j)))
}

function bracketArray(array, left, right) {
	return [left, ...array, right]
}

function leftRowLabel(rowIndex) {
	return {
		type : 'rowLabelLeft',
		row  : rowIndex + 1,
		col  : 0,		
	}
}

function rightRowLabel(rowIndex) {
	return {
		type : 'rowLabelRight',
		row  : rowIndex + 1,
		col  : config.cols + 1,		
	}
}

function emptyCell(row, col) {
	return {
		type : 'empty',
		row  : row,
		col  : col
	}
}

function colLabels(row) {
	return (
		bracketArray(
			Array(config.cols).fill().map((_, i) =>
				({
					type : 'colLabel',
					row  : row,
					col  : i+1
				})
			),
			emptyCell(row, 0),
			emptyCell(row, config.cols + 1)
		)
	)
}



function boardCellData(cellChar, row, col) {
	var type = 'emptyBoardCell'
	if (cellChar === player) {
		type = 'player'
	}
	return {
		type : type,
		row  : row + 1,
		col  : col + 1
	}
}

class Board extends React.Component {

	// Adds labels around the edge of the board
	addBoundary(boardArray) {
		return (
			bracketArray(
				boardArray.map((row, rowIndex) => 
					bracketArray(row, leftRowLabel(rowIndex), rightRowLabel(rowIndex))
				),
				colLabels(0),
				colLabels(config.rows + 1)
			)
		)
	}

	// Format the board data to a 2D array of square-data
	formatBoard() {
		return map2DArray(this.props.boardState.boardArray, boardCellData)
	}

	getSquareData() {
		var out = this.addBoundary(this.formatBoard())
		console.log(out)
		const ballLoc = this.props.boardState.ballLoc
		out[ballLoc.letterIndex + 1][ballLoc.numberIndex + 1].type = 'ball'
		return out
	}


	render() {
		return (
			<svg
				width  = {(config.cols + 2)*35}
				height = {(config.rows + 2)*35}
			>
				{
					map2DArray(this.getSquareData(), squareData => 
						<Square 
							type = {squareData.type}
							row  = {squareData.row}
							col  = {squareData.col}
							key  = {squareData.row * (config.cols + 2) + squareData.col}
						/>
					)
				}
			</svg>
		)

	}
}

		// 	// x = {this.props.col / (config.cols + 2)}%
		// 	// y = {this.props.row / (config.rows + 2)}%
function Square(props) {
	console.log(props)
	return (
		<svg 
			x = {props.col * 35}
			y = {props.row * 35}
			width  = "35"
			height = "35"
		>
			<circle cx="50%" cy="50%" r="30%" stroke="#1c87c9" stroke-width="4" fill="lightgray"/>
		</svg>
	)
}


export default Board
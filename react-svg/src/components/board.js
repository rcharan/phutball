import React from 'react';
import { player } from '../gameLogic/locationState'
import config from '../gameLogic/config'
import Square from './square'
import uiConfig from './config'


/*****************************************************************************
*
* Utilities
*
*****************************************************************************/

function map2DArray(array, func) {
	return array.map((row, i) => row.map((cell, j) => func(cell, i, j)))
}

function bracketArray(array, left, right) {
	return [left, ...array, right]
}

/*****************************************************************************
*
* Construction/Standardization of data for squares
*
*****************************************************************************/

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

function boardCellData(cellData, row, col) {
	var type = 'emptyBoardCell'
	if (cellData.contents === player) {
		type = 'player'
	}

	return {
		type      : type,
		row       : row + 1,
		col  	  : col + 1,
		flatIndex : cellData.index
	}
}

/*****************************************************************************
*
* Board: constructs the array of squares with appropriate data and passes
*
*****************************************************************************/

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
		console.log(this.props.boardState.boardArray)
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
			<>
			<svg
				width  = {(config.cols + 2)*uiConfig.squareSize}
				height = {(config.rows + 2)*uiConfig.squareSize}
			>
				{
					map2DArray(this.getSquareData(), squareData => 
						<Square 
							type 	= {squareData.type}
							row  	= {squareData.row}
							col  	= {squareData.col}
							key  	= {squareData.row * (config.cols + 2) + squareData.col}
							onClick = {() => this.props.onPlace((squareData.row-1) * (config.cols) + (squareData.col - 1))}
						/>
					)
				}
			</svg>
			<div>{this.props.jumpMouseOver} is being moused over!</div>
			</>
		)

	}
}


export default Board
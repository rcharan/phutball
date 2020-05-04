import React from 'react';
import { player } from '../gameLogic/locationState'
import config from '../gameLogic/config'
import Square from './square'
import uiConfig from './uiConfig'


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
* Arrow
*
*****************************************************************************/

function arrow(sourceLoc, targetLoc) {
	const startXY = uiConfig.xyCenterCoords(sourceLoc.letterIndex + 1, sourceLoc.number)
	const endXY   = uiConfig.xyCenterCoords(targetLoc.letterIndex + 1, targetLoc.number)
	return (
		<line
			x1 = {startXY.x}
			y1 = {startXY.y}
			x2 = {endXY.x}
			y2 = {endXY.y}
			fill = "none"
			stroke = "black"
			strokeWidth = "2"
			markerEnd = "url(#arrow)"
		/>
	)
}

function arrowheadDef() {
	// From the Mozilla Docs
	return (
	    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
	        markerWidth="6" markerHeight="6"
	        orient="auto-start-reverse">
	      <path d="M 0 0 L 10 5 L 0 10 z" />
	    </marker>
    )
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
		Type : 'rowLabelRight',
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
		return map2DArray(this.props.boardState.boardArray, boardCellData)
	}

	getSquareData() {
		var out = this.addBoundary(this.formatBoard())
		const ballLoc = this.props.boardState.ballLoc
		out[ballLoc.letterIndex + 1][ballLoc.numberIndex + 1].type = 'ball'
		return out
	}

	hoverArrow() {
		var arrowArray = []
		if (this.props.jumpMouseOver !== null) {
			const locArray = [this.props.boardState.ballLoc, ...this.props.jumpMouseOver.path]
			for (var i = 0; i < locArray.length - 1; i ++) {
				const source = locArray[i]
				const target = locArray[i+1]
				arrowArray.push(arrow(source, target))
			}
		}
		return arrowArray
	}


	render() {
		return (
			<>
			<svg
				width  = {(config.cols + 2)*uiConfig.cellSize}
				height = {(config.rows + 2)*uiConfig.cellSize}
			>
				<defs>
					{arrowheadDef()}
				</defs>
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
				{this.hoverArrow()}
			</svg>
			</>
		)

	}
}


export default Board
import React from 'react';
import { player } from '../gameLogic/locationState'
import config from '../gameLogic/config'
import Square from './square'
import uiConfig from './uiConfig'


/*****************************************************************************
*
* Utilities
*  - Array abstraction
*  - Vector arithmetic
*
*****************************************************************************/

class PaddedArray {
	constructor(array) {
		this.array = array
	}

	boardLoc(loc) {
		return this.array[loc.letterIndex+1][loc.numberIndex+1]
	}
}

function map2DArray(array, func) {
	return array.map((row, i) => row.map((cell, j) => func(cell, i, j)))
}

function bracketArray(array, left, right) {
	return [left, ...array, right]
}

class Vector {
	constructor(deltaX, deltaY) {
		this.x = deltaX
		this.y = deltaY
	};

	static fromPoints(source, target) {
		return new Vector(target.x - source.x, target.y - source.y)
	}

	get length() {
		return Math.sqrt(this.x**2 + this.y**2)
	}

	get unitVector() {
		if (this.length === 0) {
			return null
		} else {
			return this.scale(1/this.length)
		}
	}

	scale(scalar) {
		return new Vector(this.x * scalar, this.y * scalar)
	}

	add(other) {
		return new Vector(this.x + other.x, this.y + other.y)
	}

}



/*****************************************************************************
*
* Arrow
*
*****************************************************************************/

function arrow(sourceLoc, targetLoc) {
	var source = uiConfig.xyCenterCoords(sourceLoc.letterIndex + 1, sourceLoc.number);
	var target = uiConfig.xyCenterCoords(targetLoc.letterIndex + 1, targetLoc.number);

	const delta = Vector.fromPoints(source, target)

	source = delta.unitVector.scale(  8).add(source)
	target = delta.unitVector.scale(-12).add(target)

	return (
		<line
			x1 = {source.x}
			y1 = {source.y}
			x2 = {target.x}
			y2 = {target.y}
			fill = "none"
			stroke = "red"
			strokeWidth = "2"
			markerEnd = "url(#arrow)"
		/>
	)
}

function arrowheadDef() {
	// From the Mozilla Docs
	return (
	    <marker
	    	id="arrow"
	    	viewBox="0 0 6 5"
	    	refX="3"
	    	refY="2.5"
	    	fill="red"
	        markerWidth="6"
	        markerHeight="5"
	        orient="auto-start-reverse"
	    >
	      <path d="M 0 0 L 6 2.5 L 0 5 z" />
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

	greyOutJumps(paddedArray) {
		if (this.props.jumpMouseOver === null) {
			return paddedArray
		} else {
			const jump = this.props.jumpMouseOver

			var toGreyOut = jump.removedLocations
			toGreyOut.push(this.props.boardState.ballLoc)

			for (var i = 0; i < toGreyOut.length; i++) {
				const loc      = toGreyOut[i]
				const contents = paddedArray.boardLoc(loc)
				contents.type  = contents.type + 'Gray'
			}

			paddedArray.boardLoc(jump.path[jump.path.length-1]).type = 'ball'

			return paddedArray
		}
	}

	getSquareData() {
		// Format the board and add boundaries
		var out = this.addBoundary(this.formatBoard())
		out = new PaddedArray(out)

		// Add the ball to the board (or off the board as the case may be)
		out.boardLoc(this.props.boardState.ballLoc).type = 'ball'

		// Add extra features for hovering
		out = this.greyOutJumps(out)

		return out.array
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

		function flatIndex(squareData) {
			return (squareData.row-1) * (config.cols) + (squareData.col - 1)
		}

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
							type 	     = {squareData.type}
							row  	     = {squareData.row}
							col  	     = {squareData.col}
							key  	     = {squareData.row * (config.cols + 2) + squareData.col}
							onClick      = {() => this.props.onPlace(     flatIndex(squareData))}
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
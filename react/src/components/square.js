import React from 'react';
import config from '../gameLogic/config'
import uiConfig from './uiConfig'

		// 	// x = {this.props.col / (config.cols + 2)}%
		// 	// y = {this.props.row / (config.rows + 2)}%

function labelText(text) {
		// return <text x="50%" y="50%" fill="grey">{text}</text>
	return <text
				x="50%"
				y="50%"
				fill="#999999"
				fillOpacity="1.0"
				// stroke="#999999"
				// strokeWidth="1"
				textAnchor="middle"
				alignmentBaseline="middle"
				// style = {{
					// font : "13px sans-serif"
				// }}
			>
				{text}
			</text>
}

// Rectangle serves as the button
function rectangle() {
	return <rect cx="50%" cy="50%" width="100%" height="100%"
					  fill="#FFFFFF" fillOpacity="0.0"
					  stroke="#FFFFFF" strokeWidth={uiConfig.borderWidth}
					  strokeOpaction="0.0"
		   />
}


function crossComponent(startX, startY) {
	const strokeLen = uiConfig.cellOffset/2
	return (<path
				d={`M ${strokeLen*startX} ${strokeLen*startY} L ${strokeLen} ${strokeLen}`}
				fill="#FFFFFF"
				fillOpacity="0.0"
				stroke="#000000"
				strokeWidth={uiConfig.borderWidth}
			/>)
}

const leftCross   = crossComponent(0,1)
const rightCross  = crossComponent(2,1)
const topCross    = crossComponent(1,0)
const bottomCross = crossComponent(1,2)


class Square extends React.Component {
	content() {
		switch(this.props.type) {
			case 'rowLabelLeft':
				return labelText(config.letters[this.props.row-1])

			case 'rowLabelRight':
				return null;

			case 'empty':
				return null;

			case 'colLabel':
				return labelText(this.props.col)

			case 'emptyBoardCell':
				return this.cross();

			// case 'emptyBoardCellHover': 
				// return [labelText(config.letters[this.props.row-1]+this.props.col), rectangle()]

			case 'player':
				return ([...this.cross(), 
					<circle cx="50%" cy="50%" r="30%" stroke="#000000" strokeWidth="2" fill="#000000" fillOpacity="1.0"/>,
				]);

			case 'playerGray':
				return ([
					<circle cx="50%" cy="50%" r="30%" stroke="#999999" strokeWidth="2" fill="#999999" fillOpacity="1.0"/>,
					...this.cross()
				]);

			case 'ball':
				return [...this.cross(), <circle
							cx="50%" cy="50%" r="30%"
							stroke="#000000" strokeWidth="2"
							fill="#FFFFFF" fillOpacity="1.0"
						/>]

			case 'ballGray':
				return [...this.cross(), <circle
							cx="50%" cy="50%" r="30%"
							stroke="#999999" strokeWidth="2"
							fill="#DDDDDD" fillOpacity="1.0"
					   />]

			default:
				return labelText(this.props.type)
		}
	};


	cross() {
		var out = []
		if (this.props.col === 1) {
			out.push(rightCross) 
		} else if (this.props.col === config.cols) {
			out.push(leftCross)
		} else if (this.props.col <= 0) {
			return []
		} else if (this.props.col > config.cols) {
			return []
		} else {
			out.push(rightCross, leftCross)
		}

		if (this.props.row === 1) {
			out.push(bottomCross)
		} else if (this.props.row === config.rows) {
			out.push(topCross)
		} else {
			out.push(bottomCross, topCross)
		}

		return [rectangle(), ...out]
	}

	render() {
		const coords = uiConfig.xyCoords(this.props.row, this.props.col);
		return (
			<>
			<svg 
				x = {coords.x}
				y = {coords.y}
				width  = {uiConfig.cellSize}
				height = {uiConfig.cellSize}
				fillOpacity = "0.0"
				onClick      = {this.props.onClick}
			>
				{this.content()}
			</svg>
			</>
		)
	}
}


export default Square
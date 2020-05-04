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

function rectangle() {
	return <rect cx="50%" cy="50%" width="100%" height="100%"
					  fill="#FFFFFF" fillOpacity="0.0"
					  stroke="#000000" strokeWidth={uiConfig.borderWidth}/>
}

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
				return rectangle();

			case 'player':
				return ([
					<circle cx="50%" cy="50%" r="30%" stroke="#000000" strokeWidth="2" fill="#000000" fillOpacity="1.0"/>,
					rectangle(),
				]);

			case 'playerGray':
				return ([
					<circle cx="50%" cy="50%" r="30%" stroke="#999999" strokeWidth="2" fill="#999999" fillOpacity="1.0"/>,
					rectangle(),
				]);

			case 'ball':
				var out = [<circle cx="50%" cy="50%" r="30%" stroke="#000000" strokeWidth="2" fill="#FFFFFF"/>]
				if ((this.props.col > 0) && (this.props.col <= config.cols)) {
					out.push(rectangle())
				}
				return out

			case 'ballGray':
				var out = [<circle cx="50%" cy="50%" r="30%" stroke="#999999" strokeWidth="2" fill="#DDDDDD"/>]
				if ((this.props.col > 0) && (this.props.col <= config.cols)) {
					out.push(rectangle())
				}
				return out

			default:
				return labelText(this.props.type)
		}
	};

	// mouseover() {
// 
	// }

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
				onClick = {this.props.onClick}
			>
				{this.content()}
			</svg>
			</>
		)
	}
}


export default Square
import React from 'react';
import config from '../gameLogic/config'

		// 	// x = {this.props.col / (config.cols + 2)}%
		// 	// y = {this.props.row / (config.rows + 2)}%

function labelText(text) {
	return <text cx="50%" cy="50%" fill="grey">{text}</text>
}

function rectangle() {
	return <rect cx="50%" cy="50%" width="100%" height="100%"
					  fill="#FFFFFF" fillOpacity="0.0"
					  stroke="#000000" strokeWidth="1"/>
}

class Square extends React.Component {
	content() {
		switch(this.props.type) {
			case 'rowLabelLeft':
				return labelText(config.letters[this.props.row-1])

			case 'rowLabelRight':
				return null;

			case 'emptyCell':
				return null;

			case 'colLabel':
				return labelText(this.props.col)

			case 'emptyBoardCell':
				return rectangle();

			case 'player':
				return ([
					<circle cx="50%" cy="50%" r="30%" stroke="#000000" strokeWidth="2" fill="#000000"/>,
					rectangle()
				]);

			case 'ball':
				return ([
					<circle cx="50%" cy="50%" r="30%" stroke="#000000" strokeWidth="2" fill="#FFFFFF"/>,
					rectangle()
				]);

			default:
				return labelText(this.props.type)
		}
	};

	// mouseover() {
// 
	// }

	render() {
		return (
			<svg 
				x = {this.props.col * 34.5}
				y = {this.props.row * 34.5}
				width  = "35"
				height = "35"
				fillOpacity = "0.0"
			>
				{this.content()}
			</svg>
		)
	}
}


export default Square
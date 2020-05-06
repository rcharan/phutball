import React from 'react';

class History extends React.Component {

	render() {
		// Assign move numbers in order
		const history = this.props.history.map((hist, i) => ({
				moveNum : i             ,
				moveStr : hist.moveStr  ,
			})
		)

		const initialState = history[0];	

		// Parcel the historys (excluding the initial state)
		//  into units of two
		var   rows = [];
		while (rows.length * 2 < (history.length - 1)) {
			const index = rows.length * 2
			rows.push(history.slice(index + 1, index + 3))
		};

		// Render JSX
		return (
			<>
			<table>
				<thead>
				<tr>
					<th/>
					<th>X</th>
					<th>O</th>
				</tr>
				</thead>
				<tbody>
				{rows.map((historyArray, index) => 
					<HistoryRow
						rowNum  = {index + 1}
						items   = {historyArray}
						onClick = {this.props.onClick}
						key     = {index + 1}
					/>
					)
				}
				</tbody>
			</table>
			<HistoryButton
				onClick = {this.props.onClick}
				moveNum = {initialState.moveNum}
				moveStr = {initialState.moveStr}
			/>
			</>
		);

	}
}


class HistoryRow extends React.Component {
	render() {
		return (
			<tr key = {this.props.rowNum}>		
			<td><b>{this.props.rowNum}.</b></td>
			{this.props.items.map(item => 
				<HistoryButton
					onClick = {this.props.onClick}
					moveNum = {item.moveNum}
					moveStr = {item.moveStr}
					key     = {item.moveNum}
				/>
			)}
			</tr>
		)	
	}
}

class HistoryButton extends React.Component {
	render() {
		return (
			<td><button
				className   = "historyButton"
				onClick     = {() => this.props.onClick(this.props.moveNum)}
				key         = {this.props.moveNum}
			>
				{this.props.moveStr}
			</button></td>
		)	
	}
}

export default History
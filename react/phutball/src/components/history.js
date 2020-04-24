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

		console.log(rows)

		// Render JSX
		return (
			<>
			<table>
				<tr>
					<th/>
					<th>X</th>
					<th>O</th>
				</tr>
				{rows.map((historyArray, index) => 
					<HistoryRow
						rowNum  = {index + 1}
						items   = {historyArray}
						onClick = {this.props.onClick}
					/>
					)
				}
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
			<td><bold>{this.props.rowNum}.</bold></td>
			{this.props.items.map(item => 
				<HistoryButton
					onClick = {this.props.onClick}
					moveNum = {item.moveNum}
					moveStr = {item.moveStr}
				/>
			)}
			</tr>
		)	
	}
}


class HistoryButton extends React.Component {
	render() {
		return (
			<th><button
				className = "historyButton"
				onClick   = {() => this.props.onClick(this.props.moveNum)}
				key       = {this.props.moveNum}
			>
				{this.props.moveStr}
			</button></th>
		)	
	}
}

export default History
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
			<div key="historytable">
			<div className ="special-history" key="1">
				<HistoryButton
					onClick = {this.props.onClick}
					moveNum = {initialState.moveNum}
					moveStr = {initialState.moveStr}
				/>
				{/*<HistoryButton
					onClick = {this.props.onClick}
					moveNum = {history.length - 2}
					moveStr = "Undo"
				/>*/}
			</div>
			<div className="table" key="2">
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
					<tr key={index+1}>		
					<td key="row"><b>{index+1}.</b></td>
						<HistoryRow
							rowNum  = {index + 1}
							items   = {historyArray}
							onClick = {this.props.onClick}
							key     = {index + 1}
						/>
					</tr>
					)
				}
				</tbody>
			</table>
			</div>
			</div>
		);

	}
};


class HistoryRow extends React.Component {
	render() {
		return (this.props.items.map((item, i) => (
				<td key={i}><HistoryButton
					onClick = {this.props.onClick}
					moveNum = {item.moveNum}
					moveStr = {item.moveStr}
					key     = {item.moveNum}
				/></td>
			))
		)
	}
}

class HistoryButton extends React.Component {
	render() {
		return (
			<button
				className   = "historyButton"
				onClick     = {() => this.props.onClick(this.props.moveNum)}
				key         = {this.props.moveNum}
			>
				{this.props.moveStr}
			</button>
		)	
	}
}

export default History
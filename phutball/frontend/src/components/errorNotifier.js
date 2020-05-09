import React from 'react';

export default class ErrorNotifier extends React.Component {
	constructor(props) {
		super(props)
		this.state = {focus : false}
	}

	handleMouseEnter() {
		this.setState({focus : true})
	}

	handleMouseLeave() {
		this.setState({focus: false})
	}

	renderMessage() {
		if (this.state.focus) {
			return (
				<div className = "float" id="error" key="0">
					<h1>Game is in offline mode<br/>({this.props.errorStatus.message})</h1>
					<ul>
						<li key="2"> This could by an issue with your Internet connection;
							the application (including if you modified it locally); or a server issue</li>
						<li key="3"> The game is in offline mode and further moves will not be saved
							unless and until you refresh the page without encountering offline-mode.
							(Even if the issue is fixed before your refresh)
						</li>
						<li key="4"> If the problem persists unexpectedly,
							please submit bug reports on the
							github
						</li>
					</ul>
				</div>
			)
		} else {
			return null
		}
	}

	render() {
		return (
			<div className="error" id="error" key="a">
				{[<button
					onClick     ={() => this.handleMouseEnter()}
					onMouseEnter={() => this.handleMouseEnter()}
					onMouseLeave={() => this.handleMouseLeave()}
				>
				Offline Mode
				</button>,
				this.renderMessage()]}
			</div>
		)	
	}
}
import React from 'react';

export default class Help extends React.Component {
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

	renderHelp() {
		if (this.state.focus) {
			return (
				<div className = "float" key="1">
					<h1>Help</h1>
						<ol>
							<li key="1">hi</li>
						</ol>
				</div>
			)
		} else {
			return null
		}
	}

	render() {
		return(
			<div className="help" key="2">
				{[<button
					onClick     ={() => this.handleMouseEnter()}
					onMouseEnter={() => this.handleMouseEnter()}
					onMouseLeave={() => this.handleMouseLeave()}
				>
				Help
				</button>,
				this.renderHelp()]}
			</div>

		)
	}
}

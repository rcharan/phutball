import React from 'react';

class HelpI extends React.Component {
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
					<h1>Guide: how to play</h1>
						<ol>
							<li key="2">(Placement)
								To place a piece, click on the space.
							</li>
							<li key="1">(Jumping)
								Jumps are displayed in the menu at the right.
								To preview a jump, mouse over it. To make the jump, click.
								<ul>
									<li key="1"> Jumps are displayed according to the final location
										of the ball.
									</li>
									<li key="2">
										Jump chains are shown together. For example if it is possible
										to jump (from H10) to F10 and then continue to D10, they will
										be shown in one row.
									</li>
									<li key="3">
										If a chain branches (say, e.g., from F10, continuation is possible to 
										F8 or D10) then each branch will be shown on a seperate line, 
										with the redundant parts of the branch greyed out.
									</li>
									<li key="4"> All legal jumps are listed in the menu. If you can't find a jump,
									try scrolling down in the jumps section!
									</li>
								</ul>
							</li>
							<li key="3">
								(History/Undo)  To view an earlier position, click on a move in the history 
								menu to see the board after that move was made. To undo a move, view an earlier
								position then make a new move.
								<ul>
									<li key="5">
										If you can't see your latest move, try scrolling in the history section.
									</li>
									<li key="1">
										Undo is only available in local play with two humans on the same computer. Otherwise,
										all you can do is view past positions.
									</li>
									<li key="3">
										When you undo a move by making a new move from an earlier position, the undone moves
										are no longer displayed.
									</li>
								</ul>
							</li>
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
					key="3"
				>
				Guide
				</button>,
				this.renderHelp()]}
			</div>

		)
	}
}


class HelpII extends React.Component {
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
					<h1>Game Modes</h1>
						<ol>
							<li key="1"> (Local or AI) If you are playing with another human on the same computer (local mode) or against a bot, you can resume
							your game at any time by navigating to the game page in your browser history. The URL will look like
							<a href="http://philosophers.football/game/ABC123">http://philosophers.football/game/ABC123</a>.
							</li>
							<li key="2"> (Online Remote) If you are playing against another human online from different computers, you will need
							to send them the Game Link at the right. They should choose X or O depending on who they are playin as.
							You can resume the game from that link at any time.</li>
							<li key="7"> (Mobile) This game doesn't work on mobile. If you are having any issues, try using Chrome for desktop. </li>
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
					key="42"
				>
				Modes
				</button>,
				this.renderHelp()]}
			</div>

		)
	}
}

export { HelpI, HelpII }
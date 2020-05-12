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
					<h1>Help I</h1>
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
									try scrolling down in the jumps section! If you really think your jump is missing,
									please submit a bug report on github (link in the About section of the homepage). (But, hint: it&rsquo;s not missing)
									</li>
								</ul>
							</li>
							<li key="3">
								(History/Undo) To undo a move, go to the history menu and click on 
								the move before it. Or click Reset to go to the beginning of the game.
								<ul>
									<li key="1">
										Even if you go back, the full history of the game will continue to
										display. If you make a new move after going back to a previous state,
										the history will update to represent the new history-branch.
									</li>
									<li key="2">
										If your internet connection and the server are working properly,
										all moves are logged, including abandoned branches. All logging is anonymous
										and will be used to train an AI player.
									</li>
									<li key="4"> If your internet connection or the server are broken, the game
										will work fine, but moves will not be logged.
									</li>
									<li key="3">
										If you abandon a history-branch by going back and making a new move (even by repeating
										what would have been the next move), you cannot see the previous branch. If you had
										and epic game and would like it back, the data exists but will have to be recovered manually.
										Contact me if you feel so strongly. (See the about section of the home page).
									</li>
									<li key="5">
										If you can't see your latest move, try scrolling in the history section.
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
				Help I
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
					<h1>Help II </h1>
						<ol>
						<li key="4"> (Resuming Games; Security) There is no authentication. Anyone with access
							  to your game ID, contained in your URL, can access your game and impersonate any player.
							  Conversely, you can resume a game at any time by navigating to the URL from your
							  browser history. Note: there is no user data (valuable or otherwise) server-side &ndash; please 
							  don't abuse this.
							</li>
								<ul><li>If there was an issue logging any moves, the game will restore to 
									the latest state with a continuous history of logged-moves available.
									</li>
								</ul>
							<li key="5"> (Playing Remotely) Noting the previous point, it is possible to play remotely by sending your
							game&rsquo;s URL to your opponent. You will have to refresh the page to see your opponent's moves.
							</li>
							<li key="7"> (Support) This game is only supported for Chrome for desktop. But 
							(desktop versions) of Safari and Firefox should work as well.</li>
							<li key="6"> (Bug Reports) please submit on github (link in the About section of the home page).
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
					key="42"
				>
				Help II
				</button>,
				this.renderHelp()]}
			</div>

		)
	}
}

export { HelpI, HelpII }
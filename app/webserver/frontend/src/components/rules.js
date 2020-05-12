import React from 'react';

export default class Rules extends React.Component {
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

	renderRules() {
		if (this.state.focus) {
			return (
				<div className = "float" key="2">
						<h1>Rules</h1>
						<ol>
							<li key="1">
								The white piece is the ball. The black pieces are players.
							</li>
							<li key="2">
								The game ends if the ball ends up in the left- or right-most columns, <i>or</i> over them.
								<ul>
									<li key="1">
										<u>X's</u> win if the game ends with the ball on or over the <u>right</u> side
										(columns 19 and &ldquo;20&rdquo;).
									</li>
									<li key="2">
										<u>O's</u> win if the game ends with the ball on the <u>left</u> side
										(columns 1 and &ldquo;0&rdquo;).
									</li>
								</ul>
							</li>
							<li key="3">
								On your turn you <i>must</i> either place a piece in any unoccupied space
								(by clicking on it), or jump (using the menu at right).
							</li>
							<li key="4">(Jumping &ndash; basics) Jumps are a bit like in checkers. The ball can jump
							the players, and the players are removed when jumped. This is the only way to move the ball!<br/>
								<ul>
									<li key = "1">
										Jumps can be horizontal, vertical, or diagonal.
									</li>
									<li key = "2">
										Jumps can be chained (like checkers).
									</li>
									<li key = "3">
										Jumps can be over multiple players in a straight line (unlike checkers).
									</li>
								</ul>
							</li>
							<li key="5">(Jumping &ndash; details)
								<ul>
									<li key = "1">
										You cannot jump over the top or bottom of the board. This includes the spaces
										diagonally over the corner like &ldquo;Q0&rdquo;.
									</li>
									<li key = "2">
										You <i>can</i> jump over the left or right ends of the board, into
										the unlabeled &ldquo;columns&rdquo; 0 or 20.
									</li>
									<li> A jump <i>can</i> be continued/chained through the goalline (columns 1 and 19) without
									the game ending (as long as the ball doesn't end there). Jumps <i>cannot</i> be continued
									through the &ldquo;endzone&rdquo; (columns 0 and 20).
									</li>
									<li> When a player is jumped, it is removed <i>immediately</i>. It cannot be jumped
									again in the same move.
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
			<div className="rules" key="2">
				{[<button
					onClick     ={() => this.handleMouseEnter()}
					onMouseEnter={() => this.handleMouseEnter()}
					onMouseLeave={() => this.handleMouseLeave()}
					key="1"
				>
				Rules
				</button>,
				this.renderRules()]}
			</div>

		)
	}
}

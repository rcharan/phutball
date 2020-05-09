import React from 'react';
import API from '../../api'
import { version, releaseDate } from '../versionInfo'

export default class Play extends React.Component {
  render() {
    return (
      <div>
      <span className="title">
        Play
      </span>
      <span className="text">
      <div className="content">
        <div id="sub" className="subtitle" key="a">
          Version {version} ({releaseDate})
        </div>
        <div id="content" className="text" key="b">
          <p id="1">
          philosophers.football currently only supports playing against another
          real-life person on the same computer. Workarounds are available however:</p>
          <ul>
            <li id="3">
          Future versions will include bots you can play against! (This workaround is called &ldquo;waiting&rdquo;)
            </li>
          <li id="2"> If you want to play against another real-life person who will use a
          different computer, you can play pseudo-asynchronously by
          starting a game and sending them the URL to the game, which
          contains the unique game ID.</li>
          </ul>
          <p id="4">
          If playing on different computers, be warned:
            <ul>
              <li key="1"> There is no authentication &ndash; nothing stops a
              third party from interfering in your game by impersonating you,
              or stops your opponent from playing as you. However, you
              can always and easily undo moves.
              </li><li key="3">Note: The Game IDs are sufficiently unique
              that an attacker is unlikely to guess yours; hence the 
              philosophers.football equivalent of Zoom-bombing is unlikely.</li>
              <li key="2"> You and your opponent will have to refresh the 
              page manually to check for new moves.</li>
            </ul>
          </p>

        </div>
        <div id="creator" className="creator" key="c">
          <GameCreator/>
        </div>
        <div id="content" className="text" key="d">
          <p>
          Looking to resume a previous game? All games are saved if
          your internet was working! Just find a URL like philosophers.football/game/ABC123 in your browser history.
          </p>
          <p>Can't find your game, or accidentally lost access to the move history to an epic match by going back in the history
          and starting a new branch? Contact me (see the About section) to get your data back.</p>
        </div>
      </div>
      </span>
      </div>
    );
  }
};




class GameCreator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      player0Name : '',
      player1Name : '',
      requestStatus : 'unsent',
    }

    this.handlePlayer0Change = this.handlePlayer0Change.bind(this);
    this.handlePlayer1Change = this.handlePlayer1Change.bind(this)
    this.handleSubmit        = this.handleSubmit.bind(this);

    this.api = new API()

  }

  handlePlayer0Change(event) {
    if (this.state.requestStatus !== 'unsent') {
      event.preventDefault()
    } else {
      this.setState({player0Name : event.target.value.toUpperCase()})
    }
  }

  handlePlayer1Change(event) {
    if (this.state.requestStatus !== 'unsent') {
      event.preventDefault()
    } else {
      this.setState({player1Name : event.target.value.toUpperCase()})
    }
  }

  setFailure(error) {
    this.setState({'requestStatus' : 'failed'}) 
    setTimeout(() => {this.setState(
        {'requestStatus' : 'unsent'})}, 3000);
  }

  handleSubmit(event) {
    event.preventDefault()
    const gameParams = {
      'player_0_name' : this.state.player0Name,
      'player_1_name' : this.state.player1Name
    }

    this.setState({requestStatus : 'sent'})
    this.api.createGame(gameParams).then(
      gameID => (window.location.href=`/game/${gameID}`)
    ).catch(error => this.setFailure(error))
  }

  requestStatusView() {
    if (this.state.requestStatus==='unsent') {
      return 'Get Started'
    } else if (this.state.requestStatus==='sent') {
      return 'Preparing your game'
    } else if (this.state.requestStatus==='failed') {
      return 'Error preparing your game. Check your connection or try again later.'
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label key="1" className="input">
          Player 1 (X's) <input type="text" id="player0"
            value={this.state.player0Name} 
            onChange={this.handlePlayer0Change}
            placeholder="X's"
          />
        </label>
        <br/>
        <label key="2" className="input">
          Player 2 (O's) <input type="text" id="player1"
            value={this.state.player1Name} 
            onChange={this.handlePlayer1Change}
            placeholder="O's"
          />
        </label><br/>
        <input className="submit" type="submit" value={this.requestStatusView()}/>
      </form>
    )
  } 
}
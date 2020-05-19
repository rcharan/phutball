import React from 'react';
import { API } from '../../api'
import { version, releaseDate } from '../../settings/settings'

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
        <div key="7" className="subsub">
          philosophers.football can be played in 3 modes: local, remote/online, or AI.
        </div>
        <div id="content" className="text" key="b">
          <div id="creator" className="creator" key="c">
            Choose your player type and enter your names
            <GameCreator/>
          </div>
          <p key="1">
            <h2>Game Modes</h2>
            <ul>
              <li key="1"> (<b>Local</b>) Play against another human on the same computer. Just type in
              your names and click the "Play" button.</li>
              <li key="2"> (<b>Remote</b>) Play against another human on different computers. One of you should
              type in your names and click the "Play Remote" button. You will get a link to
              share with your opponent.
              </li>
              <li key="3"> (<b>AI</b>) Play against a bot! Select one of the players to a bot using the
              dropdown menu below, then type in your name and click the "Play" button!
                <ul>
                  <li> <b>RandoTron.</b> Weighing in at 200 kilos and as featured in Rick and Morty Season
                  4, <a href="https://www.youtube.com/watch?v=wezE6RLlcDA">RandoTron</a> is a master
                  of the heist and will steal victory from the jaws of defeat. Also RandoTron plays
                  completly randomly.</li>
                  <li> <b>T.D. Conway.</b> Weighing in a 4,381,505 floating points, T.D. Conway is a nascent
                  artificial intelligence with a 17-layer convolutional neural network for a brain. However,
                  T.D. Conway hasn't played many games yet, and currently has the intelligence of a small
                  child. Come back later to see how much he improves with intensive Temporal Difference training
                  and check out his sweet eligibility trace.</li>
                </ul>
              </li>
            </ul>
          </p>
          <p key="2">
          <h2>Some things to keep in mind</h2>
          <ul>
            <li key="1"> There is no authentication &ndash; nothing stops a
              third party with your (hard to guess) Game ID from interfering in your
              game by impersonating you or stops your opponent from playing
              as you.
              </li>
              <li key="4">
                Looking to resume a previous game? All games are saved if
                your internet was working! Just find a URL like philosophers.football/game/ABC123 in your browser history.
                For live games, look for philosphers.football/live/ABC123. (Leave off the /X or /O ending though)
              </li>
              <li key="5"> Live games are untimed</li>
              <li key="6"> Live games and AI games don't allow you to undo a move! So move carefully</li>
            </ul>
          </p>
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
      playerNames   : ['', ''],
      playerTypes   : ['human', 'human'],
      requestStatus : 'unsent'
    }

    this.handleName   = this.handleName.bind(this);
    this.handleType   = this.handleType.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);

    this.api = new API()

  }

  handleName(i, event) {
    const eventValue = event.target.value
    this.setState(state => {
      if (state.playerTypes[i] === 'human') {
        var out = state.playerNames.concat()
        out[i] = eventValue.toUpperCase()
        return ({
          playerNames : out,
          requestStatus : 'unsent'
        })
      } else {
        event.preventDefault()
        return ({})
      }
    })
  }

  handleType(i, event) {
    const eventValue = event.target.value
    this.setState(state => {
      if ((state.playerTypes[1-i] === 'human') ||
          (eventValue === 'human')) {
        var out = state.playerTypes.slice()
        out[i] = eventValue
        return ({
          playerTypes   : out,
          requestStatus : 'unsent'
        })
      } else {
        event.preventDefault()
        return ({})
      }
    })
  }


  handleSubmit(event) {
    event.preventDefault()

    if (this.state.requestStatus === 'sent') {
      return 
    } else {
      this.setState({requestStatus : 'sent'})
    }

    var playType = event.target.name // 'play' or 'remote'

    let gameParams;
    if (this.state.playerTypes[0] !== 'human') {
      gameParams = {
        ai_player     : this.state.playerTypes[0],
        ai_player_num : false,
        player_0_name : this.state.playerTypes[0].toUpperCase(),
        player_1_name : this.state.playerNames[1],
      }
      playType = 'ai'
    } else if (this.state.playerTypes[1] !== 'human') {
      gameParams = {
        ai_player     : this.state.playerTypes[1],
        ai_player_num : true,
        player_0_name : this.state.playerNames[0],
        player_1_name : this.state.playerTypes[1].toUpperCase()
      }
      playType = 'ai'
    } else {
      gameParams = {
        player_0_name : this.state.playerNames[0],
        player_1_name : this.state.playerNames[1]
      }
    }

    if (playType === 'play' || playType === 'ai') {
      this.api.createGame(gameParams).then(
        gameID => (window.location.href=`/game/${gameID}`)
      ).catch(
        error => window.location.href='/game/offline/'
      )
    } else if (playType === 'remote') {
      this.api.createGame(gameParams).then(
        gameID => (window.location.href=`/live/${gameID}`)
      ).catch(
        this.setState({requestStatus : 'failed'})
      )
    }
  }

  renderFailures() { 
    if (this.state.requestStatus === 'failed') {
      return (
        <div>
        <br/>
        <div className="fail"> 
          {/*Issue setting up the game. You can try again or play with two humans
          locally on your computer though!*/}
        </div>
        </div>
      ) 
    } else {
      return null
    }
  }

  renderSubmit() {
    const twoButtons = (this.state.playerTypes[0] === 'human' &&
                        this.state.playerTypes[1] === 'human')
    var out = [<input
                  className={twoButtons ? "submit half" : "submit"}
                  type="submit"
                  name="play"
                  onClick={this.handleSubmit}
                  value="Play"/>
              ]

    if (twoButtons) {
      out.push(
          <input
            className="submit half"
            type="submit"
            name="remote"
            onClick={this.handleSubmit}
            value="Play Remotely"
          />)
    }
    return out
  }

  render() {
    return (
      <form onSubmit={event => event.preventDefault()}>
        <PlayerInput
          playerNum         = {0}
          playerType        = {this.state.playerTypes}
          playerTypeHandler = {this.handleType}
          playerName        = {this.state.playerNames}
          playerNameHandler = {this.handleName}
        />
        <br/>
        <PlayerInput
          playerNum         = {1}
          playerType        = {this.state.playerTypes}
          playerTypeHandler = {this.handleType}
          playerName        = {this.state.playerNames}
          playerNameHandler = {this.handleName}
        />
        <br/>
        {this.renderSubmit()}
        {this.renderFailures()}
      </form>
    )
  } 

}

class PlayerInput extends React.Component {
  render() {
    const i = this.props.playerNum
    return(
      <label key="1" className="input">
        Player {i + 1} ({i === 0 ? 'X' : 'O'}'s)
        {this.renderTypes(i)} 
        <input type="text"
          value={ this.props.playerType[i] === 'human' ? 
                  this.props.playerName[i] : 
                  this.props.playerType[i].toUpperCase()}
          onChange={(event) => this.props.playerNameHandler(i, event)}
          placeholder={i === 0 ? "X's" : "O's"}
        />
      </label>
  )}

  renderTypes(i) {
    if (this.props.playerType[1-i] === 'human') {
      return (<select
          value   ={this.props.playerType[i]}
          onChange={(event) => this.props.playerTypeHandler(i, event)}
        >
          <option value="human"      >Human      </option>
          <option value="randotron"  >RandoTron  </option>
          <option value="t.d. conway">T.D. Conway</option>
        </select>)
    } else {
      return (
        <select
            value   ={this.props.playerType[i]}
            onChange={event => null}
        >
            <option value="human"      >Human      </option>
        </select>
      )
    }
  }
}
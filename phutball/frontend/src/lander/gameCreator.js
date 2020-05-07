import React from 'react';
import API from '../api'

export default class GameCreator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      player0Name : '',
      player1Name : '',
      requestSent : false,
    }

    this.handlePlayer0Change = this.handlePlayer0Change.bind(this);
    this.handlePlayer1Change = this.handlePlayer1Change.bind(this)
    this.handleSubmit        = this.handleSubmit.bind(this);

    this.api = new API()

  }

  handlePlayer0Change(event) {
    if (this.state.requestSent) {
      event.preventDefault()
    } else {
      this.setState({player0Name : event.target.value})
    }
  }

  handlePlayer1Change(event) {
    if (this.state.requestSent) {
      event.preventDefault()
    } else {
      this.setState({player1Name : event.target.value})
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    const gameParams = {
      'player_0_name' : this.state.player0Name,
      'player_1_name' : this.state.player1Name
    }

    this.setState({requestSent : true})
    this.api.createGame(gameParams).then(gameID => (window.location.href=`/game/${gameID}`))
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Player 1 (X's) Name:
          <input type="text" id="player0"
            value={this.state.player0Name} 
            onChange={this.handlePlayer0Change}
          />
        </label>
        <br/>
        <label>
          Player 2 (O's) Name:
          <input type="text" id="player1"
            value={this.state.player1Name} 
            onChange={this.handlePlayer1Change}
          />
        </label><br/>
        <input type="submit" value={this.state.requestSent ? 'Preparing your game' : 'Get Started!'}/>
      </form>
    )
  } 
}
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

    this.api = API()

  }

  handlePlayer0Change(event) {
    if (this.state.requestSent) {
      event.preventdefault()
    } else {
      this.setState({player0Name : event.target.value})
    }
  }

  handlePlayer1Change(event) {
    if (this.state.requestSent) {
      event.preventdefault()
    } else {
      this.setState({player1Name : event.target.value})
    }
  }

  handleSubmit(event) {
    event.preventdefault()
    this.setState({requestSent : true})
    this.api.createGame().then(gameID => (window.location.href=`/game/${gameID}`))
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label for="player0">
          Player 1 (X's) Name:
        </label>
        <input type="text" id="player0"
          value={this.state.player0Name} 
          onChange={this.handlePlayer0Change}
        /><br/>

        <label for="player1">
          Player 2 (O's) Name:
        </label>
        <input type="text" id="player1"
          value={this.state.player1Name} 
          onChange={this.handlePlayer1Change}
        /><br/>
        <input type="submit" value={this.state.requestSent ? 'Preparing your game' : 'Get Started!'}/>
      </form>
    )
  } 
}
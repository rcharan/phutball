import axios from 'axios';

import Location   from './gameLogic/location'
import { BoardState } from './gameLogic/boardState'

const API_URL = 'http://localhost:8000';

export default class API {
	constructor(gameID) {
		if (arguments.length === 0 || gameID === null) {
			this.url = `${API_URL}/api/game/`
		} else {
			this.registerGameID(gameID)
		}
	}

	/**************************************************************************
	*
	* API Calls
	*
	**************************************************************************/

	getGame() {
		return axios.get(this.url).then(request => deserializeGame(request.data))
	}

	postMove(moveInfo, move_num) {
		var data = serializeMove(moveInfo)
		data.move_num = move_num
		data.game_id  = this.gameID

        return axios.post(this.url,data);
	}

	createGame() {
		return axios.put(this.url).then(request => deserializeGame(request.data))
	}

	registerGameID(gameID) {
		this.gameID = gameID
		this.url = `${API_URL}/api/game/${gameID}`;
	}

}



/**************************************************************************
*
* Serialization : Games
*
**************************************************************************/

function deserializeGame(data) {
	console.log(data.history)
	return {
		board         : deserializeBoard(data.board),
		gameID        : data.game_id,
		player0Name   : data.player_0_name,
		player1Name   : data.player_1_name,
		aiPlayer      : data.ai_player,
		aiPlayerNum   : data.ai_player_num,
		history       : data.history.map(deserializeMove),
		moveNum       : data.moveNum,
		jumpMouseOver : data.jumpMouseOver,
		xIsNext       : data.xIsNext,
	}
}

/**************************************************************************
*
* Serialization : Moves
*
**************************************************************************/

function serializeMove(moveInfo) {
	var data = serializeBoard(moveInfo.board);
	data.move_str = moveInfo.moveStr;

	return data

}

function deserializeMove(data) {
	return {
		moveStr : data.move_str,
		board   : deserializeBoard(data.board),
	}
}

/**************************************************************************
*
* Serialization : Boards
*
**************************************************************************/

function serializeBoard(board) {
	return {
		space_array : serializeSpaceArray(board.spaceArray),
		ball_loc    : serializeLocation(board.ballLoc),
	}
}

function deserializeBoard(data) {
	const loc = deserializeLocation(data.ball_loc);
	const spaceArray = deserializeSpaceArray(data.space_array)
	return new BoardState(spaceArray, loc)
}

function serializeSpaceArray(spaceArray) {
	return spaceArray.join('')
}

function deserializeSpaceArray(spaceArray) {
	return spaceArray.split('')	
}

/**************************************************************************
*
* Serialization : Locations
*
**************************************************************************/

function serializeLocation(loc) {
	return {
			number_index : loc.numberIndex,
			letter_index : loc.letterIndex,
	}
}

function deserializeLocation(data) {
	return new Location(null, data.letter_index, data.number_index)
}

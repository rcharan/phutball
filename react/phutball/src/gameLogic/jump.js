import directions from './direction'
import { empty, player } from './locationState'

class Jump {
	constructor(path, endState) {
		this._path    = path
		this.endState = endState
	}

	get path() {
		if (Array.isArray(this._path)) {
			return this._path
		} else {
			return [this._path]
		}
	}

	toString() {
		return '*'+this.path.map(loc => loc.toString()).join('-')
	}

	prependTo(nextJump) {
		const newPath = this.path.concat(nextJump.path)
		return new Jump(newPath, nextJump.endState)
	}

	static getLegalJumps(boardState) {
		const options  = directions.map(direction => Jump._fromRest(boardState, direction))
		if (options.reduce((left, right) => left.concat(right)).includes(undefined)) {
			console.log('cry')
			Jump._fromRest(boardState, directions[6])
		}
		return options.reduce((left, right) => left.concat(right))
	}

	static _fromRest(boardState, direction) {
		const targetLoc = direction.add(boardState.ballLoc)

		// Don't attempt to jump to a place that does not exist
		if (targetLoc === null) {
			return []
		}

		// No jumping immediately to the off-board goalline from rest
		else if (!targetLoc.onBoard) {
			return []
		}

		// No jumping if there is nothing there to jump over
		else if (!(boardState.getSpace(targetLoc) === player)) {
			return []
		}

		else {
			var intermediateState = boardState.copy()
			intermediateState._moveBall(targetLoc)
			return Jump._fromMotion(intermediateState, direction)
		}
	}

	static _fromMotion(boardState, direction) {
		const targetLoc = direction.add(boardState.ballLoc)

		// Don't attempt to jump to a place that does not exist
		if (targetLoc === null) {
			return []
		}

		// Advance the piece
		const previousOccupant = boardState.getSpace(targetLoc)
		var nextState = boardState.copy()
		nextState._moveBall(targetLoc)

		// If jumping to the goalline or the target is empty, land!
		//  And then consider more jumps
		if (!(targetLoc.onBoard) || (previousOccupant === empty)) {
			const jump = new Jump(targetLoc, nextState);
			var out = [jump];
			Jump.getLegalJumps(nextState).forEach(nextJump => out.push(jump.prependTo(nextJump)))
			return out
		}

		// If the target is occupied, the jump must continue
		else if (previousOccupant === player) {
			return Jump._fromMotion(nextState, direction)
		} 

	}

};

export default Jump;
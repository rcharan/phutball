import directions from './direction'
import { empty, player } from './locationState'
import Tree from '../structs/tree'

// Wraps the jumps as a tree
export default function getLegalJumps(boardState) {
	const jumpList = Jump.getLegalJumps(boardState)	
	return Tree.buildTreeAsChildofMatch(jumpList, predecessorPredicate)
}


function predecessorPredicate(child, parent) {
	return parent.isPredecessorOf(child)
}

class Jump {
	constructor(path, endState, removedLocations, predecessor) {
		this._path            = path
		this.endState         = endState
		this.removedLocations = removedLocations
	}

	get path() {
		if (Array.isArray(this._path)) {
			return this._path
		} else {
			return [this._path]
		}
	}

	get endLoc() {
		return this.path[this.path.length-1]
	}

	toString() {
		return '*'+this.path.map(loc => loc.toString()).join('-')
	}

	isPredecessorOf(other) {
		if (other.path.length <= this.path.length) {
			return false
		}
		for (var step = 0 ; step < this.path.length; step++) {
			if (other.path[step] != this.path[step]) {
				return false
			}
		}
		return true
	}

	prependTo(nextJump) {
		const newPath          = this.path.concat(nextJump.path)
		const removedLocations = this.removedLocations.concat(nextJump.removedLocations)

		return new Jump(newPath, nextJump.endState, removedLocations)
	}

	static getLegalJumps(boardState) {
		const options  = directions.map(direction => Jump._fromRest(boardState, direction))

		// Join (concat) and return
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

		// No jumping from the off-board goal-line
		else if (!boardState.ballLoc.onBoard) {
			return []
		}

		else {
			var intermediateState = boardState.copy()
			intermediateState._moveBall(targetLoc)

			const removedLocations = [targetLoc]

			return Jump._fromMotion(intermediateState, direction, removedLocations)
		}
	}

	static _fromMotion(boardState, direction, removedLocations) {
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

			const jump = new Jump(targetLoc, nextState, removedLocations);

			var out = [jump];
			Jump.getLegalJumps(nextState).forEach(nextJump => out.push(jump.prependTo(nextJump)))
			return out
		}

		// If the target is occupied, the jump must continue
		else if (previousOccupant === player) {
			removedLocations.push(targetLoc)
			return Jump._fromMotion(nextState, direction, removedLocations)
		} 

	}

};

import config from './config'
import { empty, player, ball } from './locationState'
import Location from './location'
import getLegalJumps from './jump'

// Set the initial state
var   initialState    = Array(config.rows * config.cols).fill(empty);
const initialBallLoc = new Location((initialState.length - 1) / 2);

initialState[initialBallLoc.flatIndex] = ball;

const emptyState = Array(config.rows * config.cols).fill(empty)
const emptyBallLoc = null

class BoardState {

  // Allows empty construction (for copy)
  constructor(flatArray, ballLoc) {
    if (arguments.length === 2) {
      this.spaceArray = flatArray.slice();
      this.ballLoc    = ballLoc
    }
  };

  // Get and set indexed by a location object
  getSpace(loc) {
    return this.spaceArray[loc.flatIndex]
  };

  setSpace(loc, val) {
    this.spaceArray[loc.flatIndex] = val
  };

  copy() {
    var out = new BoardState();
    out.spaceArray = this.spaceArray.slice();
    out.ballLoc    = this.ballLoc;
    return out
  };

  get gameOver() {
    if (this.ballLoc === null) {
      return false;
    } else {
      return this.ballLoc.onGoalLine
    }
  };

  get winner() {
    if (!this.gameOver) {
      return null
    } else {
      return this.ballLoc.atRightGoalline
    }
  };

  isLegalPlacement(flatIndex) {
    return this.spaceArray[flatIndex] === empty
  };

  place(flatIndex) {
    if (this.isLegalPlacement(flatIndex)) {
      var   newBoard = this.copy();
      const placeLoc = new Location(flatIndex)
      newBoard.setSpace(placeLoc, player);
      return ({
       board    : newBoard,
       moveStr  : placeLoc.toString()
      })
    } else {
      return null
    }
  };

  getLegalJumps() {
    return getLegalJumps(this)
  }

  jump(jumpObj) {
    return {
      board   : jumpObj.endState,
      moveStr : jumpObj.toString()
    }

  }

  _moveBall(loc) {
    this.setSpace(this.ballLoc, empty);
    this.ballLoc = loc;
    if (loc.onBoard) {
      this.setSpace(loc     , ball)
    }
  };

  get boardArray() {
    var out = Array(config.rows);
    for (var i = 0; i < config.rows; i++) {
      out[i] = Array(config.cols);
      for (var j = 0; j < config.cols; j++) {
        const flatIndex = i * config.cols + j
        out[i][j] = {
          contents : this.spaceArray[flatIndex],
          index    : flatIndex
        }
      }
    };
    return out
  };

};

export {BoardState, initialState, initialBallLoc, emptyState, emptyBallLoc}
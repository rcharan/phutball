import config from './config'
import { empty, player, ball } from './locationState'
import Location from './location'
import Jump from './jump'

// Set the initial state
var   initialState    = Array(config.rows * config.cols).fill(empty);
const initialBallLoc = new Location((initialState.length - 1) / 2);

initialState[initialBallLoc.flatIndex] = ball;

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
    return this.ballLoc.onGoalLine()
  };

  get winner() {
    if (!this.gameOver) {
      return null
    } else {
      return this.ballLoc.atTopGoalline
    }
  };

  isLegalPlacement(flatIndex) {
    return this.spaceArray[flatIndex] === empty
  };

  place(loc) {
    if (this.isLegalPlacement(loc)) {
      var   newBoard = this.copy();
      const placeLoc = new Location(loc)
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
    const legalJumps = Jump.getLegalJumps(this)
    return legalJumps.map(jump => jump.toString())
  }

  jump(jumpStr) {
    const legalJumps = Jump.getLegalJumps(this)
    for (let jump in legalJumps) {
      if (jump.toString() === jumpStr) {
        return ({
          board    : jump.endState,
          moveStr  : jump.toString()
        })
      }
    }

    return null

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

  // TO DO: Implement Jumps


};

export {BoardState, initialState, initialBallLoc}
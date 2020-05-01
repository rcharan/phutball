import config from './config'

class Location {

	constructor(flatIndex, letterIndex, numberIndex) {
		// Pass either: flatIndex solely, or null, letterIndex, numberIndex
		if (flatIndex === null) {
			this.numberIndex = numberIndex
			this.letterIndex = letterIndex
			this.flatIndex   = numberIndex + letterIndex * config.cols;

		} else {
			// Constructor only for the case of on-board point
			this.numberIndex  = flatIndex % config.cols;
			this.letterIndex  = (flatIndex - this.numberIndex) / config.cols;
			this.flatIndex    = flatIndex
		}
		this.number      = this.numberIndex +1
	};

	static fromVector(letterIndex, numberIndex) {
		if ((numberIndex < -1) || (config.cols <  numberIndex) ||
			(letterIndex <  0) || (config.rows <= letterIndex)) {
			return null
		} else {
			return new Location(null, letterIndex, numberIndex)
		}
	};

	get letter() {
		return config.letters.charAt(this.letterIndex);
	};	

	toString() {
		return this.letter + this.number
	};

	get onBoard() {
		return (1 <= this.number) && (this.number <= config.cols)
	};

	get onGoalLine() {
		return (this.number <= 1) || (config.cols <= this.number)
	};


	get atRightGoalline() {
		return this.number >= config.cols
	};
}


export default Location;
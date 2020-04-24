import config from './config'

class Location {
	constructor(flatIndex) {
		this.letterIndex  = flatIndex % config.cols;
		this.numberIndex  = (flatIndex - this.letterIndex) / config.cols;
		this.number       = config.rows - this.numberIndex;
		this.flatIndex    = flatIndex
	};

	static fromVector(letterIndex, numberIndex) {
		const flatIndex = letterIndex + numberIndex * config.cols;
		var out = new Location(flatIndex);
		if (out.exists) {
			return out
		} else {
			return null
		}
	};

	get letter() {
		return config.letters.charAt(this.letterIndex);
	};	

	toString() {
		return this.letter + this.number
	};

	get onBoard() {
		return (1 <= this.number) && (this.number <= config.rows)
	};

	get onGoalLine() {
		return (this.number <= 1) || (config.rows <= this.number)
	};

	get exists() {
		return (
			 (0 <= this.number)       && (this.number <= config.rows + 1) 
		  && (0 <= this.letterIndex) && (this.letterIndex < config.cols)
		)
	};

	get atTopGoalline() {
		return this.number >= config.rows
	};
}


export default Location;
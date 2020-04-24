import config from './config'

class Location {
	constructor(flatIndex) {
		this.letterIndex  = flatIndex % config.cols;
		// Deal with negatives correctly
		if (this.letterIndex < 0) {
			this.letterIndex = this.letterIndex + config.cols
		};
		this.numberIndex  = (flatIndex - this.letterIndex) / config.cols;
		this.number       = config.rows - this.numberIndex;
		this.flatIndex    = flatIndex
	};

	static fromVector(letterIndex, numberIndex) {
		if ((numberIndex < -1) || (config.rows <  numberIndex) ||
			(letterIndex <  0) || (config.cols <= letterIndex)) {
			return null
		} else {
			const flatIndex = letterIndex + numberIndex * config.cols;
			return new Location(flatIndex)
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


	get atTopGoalline() {
		return this.number >= config.rows
	};
}


export default Location;
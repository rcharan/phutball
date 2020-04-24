import Location from './location'

class Direction {
	constructor(num) {
		this.delta_x = 0;
		this.delta_y = 0;

		if ([1,4,7].includes(num)) {
			this.delta_x = -1
		} else if ([3, 6, 9].includes(num)) {
			this.delta_x = +1
		};

		if ([1,2,3].includes(num)) {
			this.delta_y = +1
		} else if ([7,8,9].includes(num)) {
			this.delta_y = -1
		}
	}

	add(loc) {
		console.log('parent', loc.toString(), loc.letterIndex, loc.numberIndex)
		return (Location.fromVector(
			loc.letterIndex + this.delta_x,
			loc.numberIndex + this.delta_y)
		)
	}
}

var directions = Array(8);

for (var i = 0; i < 8; i ++) {
	directions[i] = new Direction([1,2,3,4,6,7,8,9][i])
}

export default directions

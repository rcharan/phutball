export default class Vector {
	constructor(deltaX, deltaY) {
		this.x = deltaX
		this.y = deltaY
	};

	static fromPoints(source, target) {
		return new Vector(target.x - source.x, target.y - source.y)
	}

	get length() {
		return Math.sqrt(this.x**2 + this.y**2)
	}

	get unitVector() {
		if (this.length === 0) {
			return null
		} else {
			return this.scale(1/this.length)
		}
	}

	scale(scalar) {
		return new Vector(this.x * scalar, this.y * scalar)
	}

	add(other) {
		return new Vector(this.x + other.x, this.y + other.y)
	}

}

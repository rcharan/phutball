const cellSize    = 35;
const borderWidth = 1;

var uiConfig = {
	cellSize    : cellSize,
	borderWidth : borderWidth,
	cellOffset  : cellSize - (borderWidth/2)
};

function xyCoords(row, col) {
	return {
		x : col * (uiConfig.cellOffset),
		y : row * (uiConfig.cellOffset)
	}
};

function xyCenterCoords(row, col) {
	const topLeftCoords = xyCoords(row, col)
	return {
		x : topLeftCoords.x + uiConfig.cellOffset/2,
		y : topLeftCoords.y + uiConfig.cellOffset/2
	}
};

uiConfig.xyCoords       = xyCoords
uiConfig.xyCenterCoords = xyCenterCoords

console.log(uiConfig)

// export { uiConfig, xyCoords, xyCenterCoords };
export default uiConfig
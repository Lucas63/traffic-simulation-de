
// value denoting error, I prefer it to numerical variables instead of null
const INVALID = -1;

const TURN_DURATION_BASE = 0.5;
const TURN_DURATION_FOR_LANE = 0.5;

if ( !Array.prototype.first )
{
	Array.prototype.first = function()
	{
		return this[0];
	};
}

// simple way to get last element of any array
if ( !Array.prototype.last )
{
	Array.prototype.last = function()
	{
		return this[this.length - 1];
	};
}

if ( !Array.prototype.empty )
{
	Array.prototype.empty = function()
	{
		return this.length == 0;
	};
}

function printDebug( functionName, message )
{
	console.debug(functionName + ": " + message);
}

function printWarning( functionName, message )
{
	console.warn(functionName + ": " + message);
}

function printError( functionName, message )
{
	console.error(functionName + ": " + message);
}

// TODO move this code for appropriate place in renderer

// just already computed fixed coefficients for calculating Bezier curve length
const COEF1 = 5/9;
const COEF2 = 8/9;
const COEF3 = 1.774597;
const COEF4 = 0.225403;

// t - parameter for Bezier curve
// x1,y1 - coordinates of start point
// x2,y2 - cooridinates of control point
// x3, y3 - coordinates of end point
function getBezierCurveLength(t, x1, y1, x2, y2, x3, y3)
{
	// This formula taken from "Approximate Arc Length Parametrization"
	// MARCELO WALTER and ALAIN FOURNIER. Formula 7
	let b = t / 2;

	let s = 0; // length of the curve

	s = b * (COEF1 * getNormOfCurve(COEF3 * b, x1, y1, x2, y2, x3, y3) +
			COEF2 * getNormOfCurve(b, x1, y1, x2, y2, x3, y3) +
			COEF1 * getNormOfCurve(COEF4 * b, x1, y1, x2, y2, x3, y3));

	return s;
}

function getBezierCurveX(t, x1, x2, x3)
{
	return Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * x2 + Math.pow(t, 2) * x3;
}

function getBezierCurveY(t, y1, y2, y3)
{
	return Math.pow(1 - t, 2) * y1 + 2 * (1 - t) * y2 + Math.pow(t, 2) * y3;
}

function getNormOfCurve(t, x1, y1, x2, y2, x3, y3)
{
	let x = getBezierCurveX(t, x1, x2, x3);
	let y = getBezierCurveY(t, y1, y2, y3);

	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

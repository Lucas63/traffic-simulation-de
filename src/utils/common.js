
// value denoting error, I prefer it to numerical variables instead of null
//const INVALID = -1;

const RADIANS_TO_DEGREES_CONVERTION = 180 / Math.PI;


const TURN_DURATION_BASE = 0.5;
const TURN_DURATION_FOR_LANE = 0.5;

angles = [{}, {}, {}, {}];

angles[ RoadDirection.BOTTOM_TO_UP ] = 90;
angles[ RoadDirection.LEFT_TO_RIGHT ] = 0;
angles[ RoadDirection.UP_TO_BOTTOM ]  = 270;
angles[ RoadDirection.RIGHT_TO_LEFT ] = 180;


road_bases = [{}, {}, {}, {}];

road_bases[ RoadDirection.BOTTOM_TO_UP ].dx = 0;
road_bases[ RoadDirection.BOTTOM_TO_UP ].dy = -1;

road_bases[ RoadDirection.LEFT_TO_RIGHT ].dx = 1;
road_bases[ RoadDirection.LEFT_TO_RIGHT ].dy = 0;

road_bases[ RoadDirection.UP_TO_BOTTOM ].dx = 0;
road_bases[ RoadDirection.UP_TO_BOTTOM ].dy = 1;

road_bases[ RoadDirection.RIGHT_TO_LEFT ].dx = -1;
road_bases[ RoadDirection.RIGHT_TO_LEFT ].dy = 0;

leftLC_bases = [{}, {}, {}, {}];

leftLC_bases[ RoadDirection.BOTTOM_TO_UP ].dx = -1;
leftLC_bases[ RoadDirection.BOTTOM_TO_UP ].dy = -1;

leftLC_bases[ RoadDirection.LEFT_TO_RIGHT ].dx = 1;
leftLC_bases[ RoadDirection.LEFT_TO_RIGHT ].dy = -1;

leftLC_bases[ RoadDirection.UP_TO_BOTTOM ].dx = 1;
leftLC_bases[ RoadDirection.UP_TO_BOTTOM ].dy = 1;

leftLC_bases[ RoadDirection.RIGHT_TO_LEFT ].dx = -1;
leftLC_bases[ RoadDirection.RIGHT_TO_LEFT ].dy = 1;

rightLC_bases = [{}, {}, {}, {}];

rightLC_bases[ RoadDirection.BOTTOM_TO_UP ].dx = 1;
rightLC_bases[ RoadDirection.BOTTOM_TO_UP ].dy = -1;

rightLC_bases[ RoadDirection.LEFT_TO_RIGHT ].dx = 1;
rightLC_bases[ RoadDirection.LEFT_TO_RIGHT ].dy = 1;

rightLC_bases[ RoadDirection.UP_TO_BOTTOM ].dx = -1;
rightLC_bases[ RoadDirection.UP_TO_BOTTOM ].dy = 1;

rightLC_bases[ RoadDirection.RIGHT_TO_LEFT ].dx = -1;
rightLC_bases[ RoadDirection.RIGHT_TO_LEFT ].dy = -1;


function getOppositeDirection( direction )
{
	switch (direction)
	{
		case RoadDirection.BOTTOM_TO_UP:
			return RoadDirection.UP_TO_BOTTOM;

		case RoadDirection.LEFT_TO_RIGHT:
			return RoadDirection.RIGHT_TO_LEFT;

		case RoadDirection.UP_TO_BOTTOM:
			return RoadDirection.BOTTOM_TO_UP;

		case RoadDirection.RIGHT_TO_LEFT:
			return RoadDirection.LEFT_TO_RIGHT;
	}
}

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
function getBezierCurveLength(t, startPoint, controlPoint, endPoint)
{
	// This formula taken from "Approximate Arc Length Parametrization"
	// MARCELO WALTER and ALAIN FOURNIER. Formula 7
	let b = t / 2;

	let s = b; // length of the curve

	s *=
		COEF1 * getNormOfCurve(COEF3 * b, startPoint, controlPoint, endPoint) +
		COEF2 * getNormOfCurve(b, startPoint, controlPoint, endPoint) +
		COEF1 * getNormOfCurve(COEF4 * b, startPoint, controlPoint, endPoint);

	return s;
}

function getNormOfCurve(t, startPoint, controlPoint, endPoint)
{
	let x = getBezierCurveCoord(t, startPoint.x, controlPoint.x, endPoint.x);
	let y = getBezierCurveCoord(t, startPoint.y, controlPoint.y, endPoint.y);

	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function getBezierCurveCoord(t, coord1, coord2, coord3)
{
	return Math.pow(1 - t, 2) * coord1 +
		   2 * (1 - t) * coord2 +
		   Math.pow(t, 2) * coord3;
}

function getBezierTangent(t, startCoord, controlCoord, endCoord)
{
	return 2 * ( t * (startCoord -2 * controlCoord + endCoord) +
				 controlCoord - startCoord );
}

// calculate points for turn on each of *turnLanes* required
// to draw Bezier curve
function setTurnData( turnLanes, sourceRoad, sourceLanes, destinationLanes )
{
	// if source road has vertical orientation, then destination one
	// has horizontal orientation
	let vertical = is_vertical_road(sourceRoad);

	let turnLength = 0;
	for (let i = 0; i < turnLanes.length; ++i)
	{
		turnLanes[i].startPoint =
			new Point(sourceLanes[i].finishX, sourceLanes[i].finishY);

		if (vertical)
		{
			turnLanes[i].controlPoint =
				new Point(sourceLanes[i].finishX, destinationLanes[i].startY);
		}
		else
		{
			turnLanes[i].controlPoint =
				new Point(destinationLanes[i].startX, sourceLanes[i].finishY);
		}

		turnLanes[i].endPoint =
			new Point(destinationLanes[i].startX, destinationLanes[i].startY);

		turnLength =
			getBezierCurveLength(1,
								 turnLanes[i].startPoint,
								 turnLanes[i].controlPoint,
								 turnLanes[i].endPoint);

		// virtual vehicle with zero length at the end of turn
		turnLanes[i].virtualVehicle =
			new VirtualVehicle(turnLength, turnLength, 0, 0);
	}
}

function setOnrampTurnData( turnLanes, sourceRoad, sourceLanes, destinationLane)
{
	// if source road has vertical orientation, then destination one
	// has horizontal orientation
	let vertical = is_vertical_road(sourceRoad);

	let turnLength = 0;
	for (let i = 0; i < turnLanes.length; ++i)
	{
		turnLanes[i].startPoint =
			new Point(sourceLanes[i].finishX, sourceLanes[i].finishY);

		if (vertical)
		{
			turnLanes[i].controlPoint =
				new Point(sourceLanes[i].finishX, destinationLane.startY);
		}
		else
		{
			turnLanes[i].controlPoint =
				new Point(destinationLane.startX, sourceLanes[i].finishY);
		}

		turnLanes[i].endPoint =
			new Point(destinationLane.startX, destinationLane.startY);

		turnLength =
			getBezierCurveLength(1,
								 turnLanes[i].startPoint,
								 turnLanes[i].controlPoint,
								 turnLanes[i].endPoint);

		// virtual vehicle with zero length at the end of turn
		turnLanes[i].virtualVehicle =
			new VirtualVehicle(turnLength, turnLength, 0, 0);
	}
}

function setOfframpTurnData( turnLanes, sourceRoad,
							 sourceLane, destinationLanes)
{
	// if source road has vertical orientation, then destination one
	// has horizontal orientation
	let vertical = is_vertical_road(sourceRoad);

	let turnLength = 0;
	for (let i = 0; i < turnLanes.length; ++i)
	{
		turnLanes[i].startPoint =
			new Point(sourceLane.finishX, sourceLane.finishY);

		if (vertical)
		{
			turnLanes[i].controlPoint =
				new Point(sourceLane.finishX, destinationLanes[i].startY);
		}
		else
		{
			turnLanes[i].controlPoint =
				new Point(destinationLanes[i].startX, sourceLane.finishY);
		}

		turnLanes[i].endPoint =
			new Point(destinationLanes[i].startX, destinationLanes[i].startY);

		turnLength =
			getBezierCurveLength(1,
								 turnLanes[i].startPoint,
								 turnLanes[i].controlPoint,
								 turnLanes[i].endPoint);

		// virtual vehicle with zero length at the end of turn
		turnLanes[i].virtualVehicle =
			new VirtualVehicle(turnLength, turnLength, 0, 0);
	}
}

function getTangentVectorAngle(vehicle)
{
	let turnLane = vehicle.turnLane;

	// calculate tangent vector for actual position of vehicle
	// that's why used actual coordinates of vehicle as end point for
	// Bezier curve
	let x = getBezierTangent(vehicle.turnCompletion, turnLane.startPoint.x,
							 turnLane.controlPoint.x, turnLane.endPoint.x );
	let y = getBezierTangent(vehicle.turnCompletion, turnLane.startPoint.y,
							 turnLane.controlPoint.y, turnLane.endPoint.y );

	// if (x == 0)
	// {
	// 	if (y > 0)
	// 		vehicle.turnAngle = 270;
	// 	else
	// 		vehicle.turnAngle = 90;
	//
	// 	return;
	// }

	if (y == 0)
	{
		if (x > 0)
			vehicle.turnAngle = 0;
		else
			vehicle.turnAngle = Math.PI;

		return;
	}

	// + Pi, because positive Y axis oriented to the bottom, not the top
	vehicle.turnAngle = Math.atan(y / x) + Math.PI;
}

function calculateTurnDistance( vehicle, pathCalcFunction )
{
	let turnLane = vehicle.turnLane;

	vehicle.turnX =
		getBezierCurveCoord(vehicle.turnCompletion, turnLane.startPoint.x,
							turnLane.controlPoint.x, turnLane.endPoint.x);

	vehicle.turnY =
		getBezierCurveCoord(vehicle.turnCompletion, turnLane.startPoint.y,
							turnLane.controlPoint.y, turnLane.endPoint.y);

	getTangentVectorAngle(vehicle);

	return pathCalcFunction( vehicle.turnCompletion,
							 turnLane.startPoint,
							 turnLane.controlPoint,
							 turnLane.endPoint);
}

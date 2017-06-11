// \param _source - object of road vehicle moves from
// \param _destination - object of road vehicle moves to
// \param _pathCalcFunction - function for calculating moved distance on turn
// \note source and destination roads must have the same lanes quantity!
function Turn( _source, _destination, _pathCalcFunction )
{
	this.source = _source;
	this.destination = _destination;
	this.pathCalcFunction = _pathCalcFunction;

	// time elapsed from last update
	this.delta = 0;

	let lanesAmount = _source.getForwardLanesAmount() +
					  _source.getBackwardLanesAmount();

	this.lanes = new Array( lanesAmount );

	for (let i = 0; i < lanesAmount; ++i)
	{
		// each lane has array of vehicles on this lane
		this.lanes[i].vehicles = [];
	}

	// Renderer store here information about Start, Control and End points
	// to draw Bezier curve for each lane
	this.turnCoordinates = new Array( lanesAmount );

	for (let i = 0; i < lanesAmount; ++i)
	{
		// TODO add real calculation of coordinates
		// TODO set coordinates of center i-th lane on source road
		this.turnCoordinates[i].startPoint = { "x": 0, "y": 0 };

		// Canvas implementation of Bezier curve requires 2 control points,
		// but use only one point twice for simplicity's sake
		// TODO set x of source lane's center and y of destination lane's center
		this.turnCoordinates[i].controlPoint = { "x": 0, "y": 0 };

		// TODO set coordinates of center i-th lane on destination road
		this.turnCoordinates[i].endPoint = { "x": 0, "y": 0};
	}

	this.turnDuration = new Array( lanesAmount );
	for (let i = 0; i < lanesAmount; ++i)
	{
		this.turnDuration[i] = TURN_DURATION_BASE + i * TURN_DURATION_FOR_LANE;
	}

	// this formula used to decide direction of this turn
	// switching to the road with orientation UP_TO_BOTTOM is a different
	// turn whether vehicle moves on LEFT_TO_RIGHT or RIGHT_TO_LEFT road.
	// so find difference between road orientation, add 4 to avoid negative
	// values and wrap around 4
	// each road's direction points at side of the world and I found
	// whether new direction less than old or not
	//               BOTTOM_TO_UP: 0
	//                    ↑
	// RIGHT_TO_LEFT: 3 ←  → LEFT_TO_RIGHT: 1
	//                   ↓
	//               UP_TO_BOTTOM: 2
}

Turn.prototype.canTurn = function( laneIndex, vehicle )
{
	let isValidIndex = laneIndex < 0 || this.lanes.length < laneIndex;
	assert( isValidIndex, "Wrong index " + laneIndex + "; " +
			"lanes amount is " + this.lanes.length);

	// get the last vehicle from selected lane
	let lastVehicle = this.lanes[laneIndex].vehicles.last();

	// if last vehicle on selected turn lane not far from source road
	// and there is not enough space for new vehicle,
	// then vehicle on source road cannot start turning
	if (lastVehicle.uCoord < vehicle.getMinimalGap())
		return false;

	let destinationLane = null;

	if (this.destination.getForwardLanesAmount() > 0)
	{
		destinationLane = this.destination.forwardLanes[laneIndex];
	}
	else
	{
		destinationLane = this.destination.backwardLanes[laneIndex];
	}

	// check whether lane on destination road has enough space for new vehicle
	// if does, everything is OK, otherwise reject turn request
	return destinationLane.hasEnoughSpace( vehicleLength + MINIMAL_GAP );
}

// add vehicle to turn's lane with index *laneIndex*
Turn.prototype.startTurn = function( laneIndex, vehicle )
{
	vehicle.sourceLane = this.lanes[laneIndex];

	// TODO now turn connected only to forward lanes, but real check must be
	// done whether used backward or forward lanes
	vehicle.prepareForTurn(this.turnDuration[laneIndex],
						   this.destination.forwardLanes[laneIndex]);

	this.lanes[laneIndex].vehicles.push( vehicle );
}

//
Turn.prototype.setTurnData = function( vehicle, laneIndex )
{
	let laneData = this.renderInfo[laneIndex];

	vehicle.turnData["startX"] = laneData.startPoint["x"];
	vehicle.turnData["startY"] = laneData.startPoint["y"];

	vehicle.turnData["controlX"] = laneData.controlPoint["x"];
	vehicle.turnData["controlY"] = laneData.controlPoint["y"];

	vehicle.turnData["endX"] = laneData.endPoint["x"];
	vehicle.turnData["endY"] = laneData.endPoint["y"];
}

function updateTurn( vehicles )
{
	for (let i = 0;i < vehicles.length;++i)
	{
		let vehicle = vehicles[i];
		if (vehicle.arrived)
			continue;

		vehicle.update( this.delta, 0, this.pathCalcFunction );
	}
}

Turn.prototype.turnCompleted = function( laneIndex )
{
	let isValidIndex = laneIndex < 0 || this.lanes.length < laneIndex;
	assert( isValidIndex, "Wrong index " + laneIndex + "; " +
			"lanes amount is " + this.lanes.length);

	if ( this.lanes[laneIndex].vehicles.empty() )
		return false;

	// check whether first vehicle on lane has finished turn
	return this.lanes[lanesIndex].vehicles.first().arrived;
}

Turn.prototype.calculateTurnDistance = function( vehicle, dt )
{
	// TODO implement actual update
}

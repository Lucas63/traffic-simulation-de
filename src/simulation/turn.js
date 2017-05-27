// _source - object of road vehicle moves from
// \param _destination - object of road vehicle moves to
// \note source and destination roads must have the same lanes quantity!
function Turn( _source, _destination )
{
	this.source = _source;
	this.destination = _destination;
	this.type = _type;

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
	this.renderInfo = new Array( lanesAmount );

	for (let i = 0; i < lanesAmount; ++i)
	{
		// TODO add real calculation of coordinates
		// TODO set coordinates of center i-th lane on source road
		this.renderInfo[i].startPoint = { "x": 0, "y": 0 };

		// Canvas implementation of Bezier curve requires 2 control points,
		// but use only one point twice for simplicity's sake
		// TODO set x of source lane's center and y of destination lane's center
		this.renderInfo[i].controlPoint = { "x": 0, "y": 0 };

		// TODO set coordinates of center i-th lane on destination road
		this.renderInfo[i].endPoint = { "x": 0, "y": 0};
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

Turn.prototype.canTurn = function( laneIndex, vehicleLength, destinationLane )
{
	let isValidIndex = laneIndex < 0 || this.lanes.length < laneIndex;
	assert( isValidIndex, "Wrong index " + laneIndex + "; " +
			"lanes amount is " + this.lanes.length);

	assert( destinationLane["id"] == this.to)

	// get the last vehicle from selected lane
	let lastVehicle = this.lanes[laneIndex].vehicles.last();

	// if last vehicle on selected lane made turn less for 50%,
	// then vehicle on source road cannot start turning
	if (lastVehicle.turnCompletion < 0.5)
	{
		console.debug("Last vehicle on lane " + laneIndex + " completed turn " +
					"for " + lastVehicle.turnCompletion * 100 + "%");
		return false;
	}

	// check whether lane on destination road has enough space for new vehicle
	// if does, everything is OK, otherwise reject turn request
	return destinationLane.hasEnoughSpace( vehicleLength + MINIMAL_GAP );
}

Turn.prototype.startTurn = function( laneIndex, vehicle )
{
	// TODO add turn time
	vehicle.prepareForTurn( -1 );
	this.lanes[laneIndex].vehicles.push( vehicle );
}

function updateTurn( vehicles )
{
	for (let i = 0;i < vehicles.length;++i)
	{
		let vehicle = vehicles[i];
		if (vehicle.arrived)
			continue;

		vehicle.turnElapsedTime += this.delta;
		vehicle.turnCompletion = vehicle.turnElapsedTime / vehicle.turnFullTime;

		// it possible that vehicle waits on turn to move on destination road
		// if destination road is congested and no space for new vehicle
		if (vehicle.turnCompletion >= 1)
			vehicle.arrived = true;
	}
}

Turn.prototype.update = function( dt )
{
	this.delta = dt;

	for (let i = 0; i < this.lanes.length; ++i)
	{
		// update turn for all vehicles on lane
		updateTurn(this.lanes[i].vehicles);
	}
}

Turn.prototype.turnCompleted( laneIndex )
{
	let isValidIndex = laneIndex < 0 || this.lanes.length < laneIndex;
	assert( isValidIndex, "Wrong index " + laneIndex + "; " +
			"lanes amount is " + this.lanes.length);

	if ( this.lanes[laneIndex].vehicles.empty() )
		return false;

	// check whether first first vehicle on lane has finished turn
	return this.lanes[lanesIndex].vehicles.first().arrived;
}

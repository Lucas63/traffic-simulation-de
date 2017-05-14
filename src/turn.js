var TurnType =
{
	"left": 0,
	"right": 1
}

// _source - road id vehicle moves from
// _destination - road id vehicle moves to
// _type - turn's type: "left" or "right"
// _lanesNumber - number of lanes on turn, source and destination roads
// must have the same lanes quantity!
function Turn( _destination, _source, _type, _lanesNumber )
{
	this.source = _source;
	this.destination = _destination;
	this.type = _type;

	// time elapsed from last update
	this.delta = 0;

	this.lanes = new Array( _lanesNumber );

	for (let i = 0; i < _lanes; ++i)
	{
		// each lane has array of vehicles on this lane
		this.lanes[i] = [];
	}

	// Renderer store here information about Start, Control and End points
	// to draw Bezier curve for each lane
	this.renderInfo = new Array( _lanesNumber );

	for (let i = 0; i < _lanesNumber; ++i)
	{
		// TODO add real calculation of coordinates
		// TODO set coordinates of center i-th lane on source road
		this.renderInfo[i].StartPoint = { "x": 0, "y": 0 };

		// Canvas implementation of Bezier curve requires 2 control points,
		// but use only one point twice for simplicity's sake
		// TODO set x of source lane's center and y of destination lane's center
		this.renderInfo[i].ControlPoint = { "x": 0, "y": 0 };

		// TODO set coordinates of center i-th lane on destination road
		this.renderInfo[i].EndPoint = { "x": 0, "y": 0};
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
	let lastVehicle = this.lanes[laneIndex].last();

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
	vehicle.turnElapsedTime = 0;
	vehicle.turnCompletion = 0;

	// TODO add turn time
	vehicle.turnFullTime = -1;

	this.lanes[laneIndex].push( vehicle );
}

function updateTurn( vehicle )
{
	vehicle.turnElapsedTime += this.delta;
	vehicle.turnCompletion = vehicle.turnElapsedTime / vehicle.turnFullTime;

	// it possible that vehicle waits on turn to move on destination road
	// if destination road is congested and no space for new vehicle
	Math.max( vehicle.turnCompletion, 1 );
}

Turn.prototype.update = function( dt )
{
	this.delta = dt;

	for (let i = 0; this.lanes.length; ++i)
	{
		let lane = this.lanes[i];

		// update turn for all vehicles on lane
		lane.forEach( updateTurn );
	}
}

Turn.prototype.turnCompleted( laneIndex )
{
	let isValidIndex = laneIndex < 0 || this.lanes.length < laneIndex;
	assert( isValidIndex, "Wrong index " + laneIndex + "; " +
			"lanes amount is " + this.lanes.length);

	if ( this.lanes[laneIndex].length == 0 )
	{
		return false;
	}

	// check whether first first vehicle on lane has finished turn
	return this.lanes[lanesIndex][0].turnCompletion == 1;
}

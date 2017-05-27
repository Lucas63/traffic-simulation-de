
function Offramp( _source, _destination, _outflow, _length,
				 _connectedLaneType, _connectedLaneIndex )
{
	this.source = _source;
	this.destination = _destination;
	this.outflow = _outflow;

	this.length = _length;

	this.sourceId = this.source.getId();
	this.destinationId = this.destination.getId();
	this.outflowId = this.outflow.getId();

	this.destLanesAmount = this.destination.getLanesAmount();

	this.connectedLaneType = _connectedLaneType;
	this.connectedLaneIndex = _connectedLaneIndex;

	this.forwardLanes = new Array( this.source.getForwardLanesAmount() );

	this.forwardLanes.forEach( function(lane) {
		lane.vehicles = [];
	});

	this.backwardLanes = new Array( this.source.getBackwardLanesAmount() );

	this.backwardLanes.forEach( function(lane) {
		lane.vehicles = [];
	});

	if ( _connectedLaneType == LaneType.FORWARD )
	{
		this.connectedLane = this.forwardLanes.last();
	}
	else
	{
		this.connectedLane = this.backwardLanes.first();
	}

	// virtual lanes for turning vehicles
	this.turnLanes = new Array( this.destLanesAmount);
	for (let i = 0;i < this.destLanesAmount; ++i)
	{
		this.turnLanes[i].vehicles = [];
	}

	this.turnDuration = new Array( this.destLanesAmount );

	for (let i = 0;i < this.destLanesAmount; ++i)
	{
		this.turnDuration[i] = TURN_DURATION_BASE + i * TURN_DURATION_FOR_LANE;
	}
}

// check is it possible to turn now and return index of lane on destination
// road in case of success, otherwise INVALID
Offramp.prototype.canTurn( vehicleRequiredSpace)
{
	let freeLaneIndex = INVALID;

	if ( this.connectedLane.vehicles.empty() &&
		 this.turnLanes.vehicles.empty())
	{
		return true;
	}

	// check whether last turning vehicle has completed turn for at least 50%
	let vehicles = null;
	let lastVehicle = null;
	let vehiclesAmount = 0;

	for (let i = 0; i < this.turnLanes.length; ++i)
	{
		vehicles = this.turnLanes[i].vehicles;
		lastVehicle = vehicles.last();

		// if turn completed for less than 50%,
		// then another car cannot start turn
		if ( lastVehicle.turnCompletion < 0.5 )
			return freeLaneIndex;
	}

	// find closest free lane on destination road
	// because right-hand traffic is in use in this simulation,
	// vehicle turns only at right and thus iterate over destination lanes
	// in reverse order


	let destLanes = this.destination.forwardLanes;
	for (let i = this.destLanesAmount - 1; i >= 0; --i)
	{
		if (destLanes[i].hasEnoughSpace( vehicleRequiredSpace ))
		{
			freeLaneIndex = i;
			break;
		}
	}

	if ( freeLaneIndex == INVALID )
	{
		printWarning(arguments.callee.name, "No free lanes");
		return freeLaneIndex;
	}

	return freeLaneIndex;
}

Offramp.prototype.isConnectedLane = function( roadId, laneType, laneIndex )
{
	if (roadId != this.sourceId)
		return false;

	if (laneType != this.connectedLaneType)
		return false;

	if (laneIndex != this.connectedLaneIndex)
		return false;

	return true;
}

Offramp.prototype.canPassThroughConnectedLane = function( vehicle )
{
	let lanesAmount = this.turnlanes.length;
	var vehicles = null;
	var lastVehicle = null;

	for (let i = 0; i < lanesAmount; ++i)
	{
		vehicles = this.turnlanes[i].vehicles.
		if (vehicles.empty())
			continue;

		lastVehicle = vehicles.last();

		// if turn completed for less than 50%,
		// then another car cannot start turn
		if ( lastVehicle.turnCompletion < 0.5 )
			return false;
	}

	vehicles = this.connectedLane.vehicles;
	if (vehicles.empty())
		return true;

	let lastVehicle = vehicles.last();

	return lastVehicle.farFrom( vehicle.requiredSpace );
}

// check whether *vehicle* from road with *roadId* and lane identified
// by *laneType* and *laneIndex* can pass throug the offramp
Offramp.prototype.canPassThrough( vehicle, roadId, laneType, laneIndex )
{
	assert( roadId == this.source || roadId == this.outflow,
			"Wrong road id " + roadId);

	if (this.isConnectedLane( roadId, laneType, laneIndex ))
	{
		return this.canPassThroughConnectedLane( vehicle );
	}

	let selectedLane = null;
	if ( roadId == this.sourceId )
	{
		selectedLane = this.forwardLanes[ laneIndex ];
	}
	else
	{
		selectedLane = this.backwardLanes[ laneIndex ];
	}

	if ( selectedLane.vehicles.empty() )
	{
		// no vehicles on lane, of course vehicle can pass through
		return true;
	}

	let lastVehicle = selectedLane.vehicles.last();
	let state = lastVehicle.vehicleState;

	switch( state )
	{
		// check whether enough space for new vehicle
		case VehicleState.MOVING:
			return lastVehicle.farFrom( vehicle.getMinimalGap() );

		// jam on the offramp!
		case VehicleState.IDLE:
			return false;

		case VehicleState.CHANGE_LANE:
		default:
			printError( arguments.callee.name, "Wrong vehicle state " + state);
			return false;
	}
}

// laneIndex - index of lane on destination road
Offramp.prototype.startTurn = function( laneIndex, vehicle )
{
	vehicle.movementState = MovementState.ON_OFFRAMP;

	vehicle.prepareForTurn(this.turnDuration[laneIndex], laneIndex)
	this.turnLanes[laneIndex].vehicles.push( vehicle );
}

Offramp.prototype.startPassThrough = function( vehicle, roadId, laneIndex )
{
	vehicle.prepareForMove(MovementState.ON_OFFRAMP);

	if ( roadId == this.sourceId )
	{
		this.forwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
	else
	{
		this.backwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
}

Offramp.prototype.turnCompeleted = function( laneIndex )
{
	let lane = this.turnLanes[laneIndex];
	var vehicle = lane.vehicles.first();

	if (vehicle.arrived)
	{
		// delete vehicle from offramp
		// it will be added to destination road
		this.connectedLane.vehicles.splice(i, 1);
		return vehicle;
	}

	for (let i = 0; i < vehicles.length; i++)
	{
		vehicle = vehicles[i];

		// if turn completed
		if ( vehicle.turnCompletion == 1 )
		{

		}
	}

	return null;
}

// check vehicles completed pass to the road *roadId*
// i.e., roadId - id of destination or outflow
Offramp.prototype.passCompleted = function( roadId, laneIndex )
{
	let lanes = null;
	let vehicle = null;

	if ( roadId == this.sourceId )
	{
		lanes = this.forwardLanes;
	}
	else
	{
		lanes = this.backwardLanes;
	}

	if ( lanes[ laneIndex ].vehicles.empty )
	{
		return null;
	}

	vehicle = lanes[ laneIndex ].vehicles.first();

	if ( vehicle.uCoord == this.length )
	{
		// remove vehicle from offramp
		lanes[ laneIndex ].vehicles.splice( 0, 1);

		// return object holding reference to vehicle for further adding to
		// road, otherwise after removal from array object will be lost
		return vehicle;
	}

	return null;
}

Offramp.prototype.updateAllVehicles = function( dt )
{
	for (let i = 0; i < this.forwardLanesAmount; ++i)
	{
		updateVehicles( this.forwardLanes[i].vehicles, dt );
	}

	for (let i = 0; i < this.backwardLanesAmount; ++i)
	{
		updateVehicles( this.backwardLanes[i].vehicles, dt );
	}
}

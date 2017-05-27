function Onramp( _source, _destination, _inflow, _length,
				 _connectedLaneType, _connectedLaneIndex )
{
	this.source = _source;
	this.destination = _destination;
	this.inflow = _inflow;

	this.length = _length;

	this.sourceId = this.source.getId();
	this.destinationId = this.destination.getId();
	this.inflowId = this.inflow.getId();

	this.connectedLaneType = _connectedLaneType;
	this.connectedLaneIndex = _connectedLaneIndex;

	this.forwardLanes = new Array( this.destination.getForwardLanesAmount() );

	this.forwardLanes.forEach( function(lane) {
		lane.vehicles = [];
	});

	this.backwardLanes = new Array( this.destination.getBackwardLanesAmount() );

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

	let sourceLanesAmount = this.source.getLanesAmount();

	// virtual lanes for turning vehicles
	this.turnLanes = new Array( sourceLanesAmount );
	for (let i = 0;i < sourceLanesAmount; ++i)
	{
		this.turnLanes[i].vehicles = [];
	}

	this.turnDuration = new Array( sourceLanesAmount );
	for (let i = 0;i < sourceLanesAmount; ++i)
	{
		this.turnDuration[i] = TURN_DURATION_BASE + i * TURN_DURATION_FOR_LANE;
	}
}

Onramp.prototype.inflowRoadIsFree = function( requiredSpace )
{
	// at first check first vehicle at inflow road
	let inflowLane = this.inflow.forwardLanes.last();

	if (inflowLane.vehicles.empty() == false)
	{
		let firstVehicle = inflowLane.vehicles.first();

		// distance between vehicle's bumper and road's end
		let requiredSpace = inflowLane.length - 2*firstVehicle.getMinimalGap();

		// if vehicle too close for road's end
		if (firstVehicle.uCoord >= requiredSpace)
		{
			return false;
		}
	}

	return true;
}

Onramp.prototype.canTurn = function( sourceLaneIndex, requiredSpace )
{
	let freeLaneIndex = INVALID;

	// check the most obvious case
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
			return false;
	}

	if ( this.inflowRoadIsFree(requiredSpace) == false )
	{
		return false;
	}

	let vehicles = this.connectedLane.vehicles;
	let vehiclesAmount = vehicles.length;

	// check vehicles in reverse order
	// try to avoid conflicts with vehicles added recently
	for (let i = vehiclesAmount - 1; i >= 0; --i)
	{
		let vehicle = this.connectedLane.vehicles[i];
		switch( vehicle.vehicleState )
		{
			case VehicleState.MOVING:
				// no turn if any vehicle is moving right through the
				// onramp. It done for the simplicity's sake
				return false;

			case VehicleType.IDLE:
				// things gone wrong if vehicles stops on onramp,
				// reject turn request to avoid jam
				return false;

			case VehicleState.CHANGE_LANE:
				assert(false, "No lane change on onramp!!!");
				return false;;
		}
	}

	return true;
}

Onramp.prototype.isConnectedLane = function( laneType, laneIndex )
{
	if (laneType != this.connectedLaneType)
		return false;

	if (laneIndex != this.connectedLaneIndex)
		return false;

	return true;
}

Onramp.prototype.canPassThroughConnectedLane = function( vehicle )
{
	let vehicles = this.turnLanes;
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

	if (this.inflowRoadIsFree() == false)
	{
		return false;
	}

	vehicles = this.connectedLane.vehicles;
	if (vehicles.empty())
		return true;

	let lastVehicle = vehicles.last();

	return lastVehicle.farFrom( vehicle.requiredSpace );
}

Onramp.prototype.canPassThrough = function( vehicle, roadId,
											laneType, laneIndex)
{
	// The same logic as for offramp
	// TODO move to one function
	///////////////////////////////////////////////////////////////////////////
	assert( roadId == this.source || roadId == this.inflow,
			"Wrong road id " + roadId);

	if (this.isConnectedLane( laneType, laneIndex ))
	{
		return this.canPassThroughConnectedLane( vehicle );
	}

	let selectedLane = null;
	if ( laneType == LaneType.BACKWARD.value )
	{
		assert( laneIndex >= this.backwardLanes.length );
		selectedLane = this.backwardLanes[ laneIndex ];
	}
	else
	{
		assert( laneIndex >= this.forwardLanes.length );
		selectedLane = this.forwardLanes[ laneIndex ];
	}

	if ( selectedLane.vehicles.empty() )
	{
		return true;
	}
	///////////////////////////////////////////////////////////////////////////

	let lastVehicle = selectedLane.vehicles.last();
	let state = lastVehicle.vehicleState;

	switch( state )
	{
		// check whether enough space for new vehicle
		case VehicleState.MOVING:
			return lastVehicle.farFrom( vehicle.getMinimalGap() );

		// last vehicle inside the onramp has stopped
		case VehicleState.IDLE:
			return false;

		case VehicleState.CHANGE_LANE:
		default:
			printError( arguments.callee.name, "Wrong vehicle state " + state);
			return false;
	}
}

// laneIndex - index of lane on source road
Onramp.prototype.startTurn = function( laneIndex, vehicle )
{
	vehicle.movementState = MovementState.ON_ONRAMP;
	vehicle.prepareForTurn(this.turnDuration[laneIndex],
						   this.connectedLaneIndex);

	this.turnLanes[laneIndex].vehicles.push( vehicle );
}

Onramp.prototype.startPassThrough = function( vehicle, roadId,
											  laneType, laneIndex,)
{
	vehicle.prepareForMove(MovementState.ON_ONRAMP);
	if ( laneType == LaneType.FORWARD )
	{
		this.forwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
	else
	{
		this.backwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
}

Onramp.prototype.turnCompeleted = function( laneIndex )
{
	let lane = this.turnLanes[laneIndex];
	let vehicles = lane.vehicles;
	var vehicle = null;

	for (let i = 0; i < vehicles.length; i++)
	{
		vehicle = vehicles[i];

		// if turn completed
		if ( vehicle.turnCompletion == 1 )
		{
			// delete vehicle from offramp
			// it will be added to destination road
			this.connectedLane.vehicles.splice(i, 1);

			return vehicle;
		}
	}

	return null;
}

// check vehicles completed pass to the road *roadId*
// i.e., roadId - id of destination or inflow
Onramp.prototype.passCompleted = function( roadId, laneIndex )
{
	let lanes = null;
	let vehicle = null;

	if ( laneType == LaneType.FORWARD )
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
		// remove vehicle from onramp
		lanes[ laneIndex ].vehicles.splice( 0, 1);

		// return object holding reference to vehicle for next adding to
		// some road, otherwise after removal from array object will be lost
		return vehicle;
	}
}

Onramp.prototype.updateAllVehicles = function( dt )
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
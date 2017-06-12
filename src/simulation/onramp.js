function Onramp( _source, _destination, _inflow, _length,
				 _connectedLaneType, _connectedLaneIndex )
{
	this.source = _source;
	this.destination = _destination;
	this.inflow = _inflow;

	this.type = RoadObject.ONRAMP;

	this.length = _length;
	this.sourceId = this.source.getId();
	this.destinationId = this.destination.getId();
	this.inflowId = this.inflow.getId();

	this.connectedLaneType = _connectedLaneType;
	this.connectedLaneIndex = _connectedLaneIndex;

	this.forwardLanes = new Array( this.destination.getForwardLanesAmount() );
	setupPassLanes(this.forwardLanes, _length);

	this.backwardLanes = new Array( this.destination.getBackwardLanesAmount() );
	setupPassLanes(this.backwardLanes, _length);

	let turnDestinationLane = null;

	if ( _connectedLaneType == LaneType["forward"] )
	{
		this.connectedLane = this.forwardLanes.last();
		turnDestinationLane = _destination.forwardLanes.last();
	}
	else
	{
		this.connectedLane = this.backwardLanes.first();
		turnDestinationLane = _destination.backwardLanes.first();
	}

	let sourceLanesAmount = this.source.getLanesAmount();

	// virtual lanes for turning vehicles
	this.turnLanes = new Array( sourceLanesAmount );
	addVehiclesArray(this.turnLanes);

	setOnrampTurnData(this.turnLanes, _source, _source.forwardLanes,
					  turnDestinationLane)

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
};

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
};

Onramp.prototype.isConnectedLane = function( laneType, laneIndex )
{
	if (laneType != this.connectedLaneType)
		return false;

	if (laneIndex != this.connectedLaneIndex)
		return false;

	return true;
};

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
};

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
};

// laneIndex - index of lane on source road
Onramp.prototype.startTurn = function( laneIndex, vehicle )
{
	vehicle.movementState = MovementState.ON_ONRAMP;
	vehicle.sourceLane = this.turnLanes[laneIndex];

	vehicle.prepareForTurn(this.turnDuration[laneIndex],
						   this.connectedLane);

	this.turnLanes[laneIndex].vehicles.push( vehicle );
};

Onramp.prototype.startPassThrough = function( vehicle, roadId,
											  laneType, laneIndex,)
{
	vehicle.prepareForMove(MovementState.ON_ONRAMP);

	if ( laneType == LaneType["forward"] )
	{
		vehicle.sourceLane = this.forwardLanes[lanesIndex];
		this.forwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
	else
	{
		vehicle.sourceLane = this.backwardLanes[lanesIndex];
		this.backwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
};

Onramp.prototype.calculateTurnDistance = function( vehicle )
{
	return calculateTurnDistance(vehicle, this.pathCalcFunction);
};

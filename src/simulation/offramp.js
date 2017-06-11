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

	let turnSourceLane = null;

	if ( _connectedLaneType == LaneType["forward"] )
	{
		this.connectedLane = this.forwardLanes.last();
		turnSourceLane = _source.forwardLanes.last();
	}
	else
	{
		this.connectedLane = this.backwardLanes.first();
		turnSourceLane = _source.backwardLanes.first();
	}

	// virtual lanes for turning vehicles
	this.turnLanes = new Array( this.destLanesAmount());
	for (var i = 0;i < this.destLanesAmount; ++i)
		this.turnLanes[i].vehicles = [];

	setOffampTurnData(this.turnLanes, _source, turnSourceLane,
					  _destination.forwardLanes);

	this.turnDuration = new Array( this.destLanesAmount );

	for (var i = 0;i < this.destLanesAmount; ++i)
		this.turnDuration[i] = TURN_DURATION_BASE + i * TURN_DURATION_FOR_LANE;
}

// check is it possible to turn now and return index of lane on destination
// road in case of success, otherwise INVALID
Offramp.prototype.canTurn = function( vehicleRequiredSpace)
{
	var freeLaneIndex = INVALID;

	if ( this.connectedLane.vehicles.empty() &&
		 this.turnLanes.vehicles.empty())
	{
		return true;
	}

	// check whether last turning vehicle has completed turn for at least 50%
	var vehicles = null;
	var lastVehicle = null;
	var vehiclesAmount = 0;

	for (var i = 0; i < this.turnLanes.length; ++i)
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


	var destLanes = this.destination.forwardLanes;
	for (var i = this.destLanesAmount - 1; i >= 0; --i)
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
	var lanesAmount = this.turnlanes.length;
	var vehicles = null;
	var lastVehicle = null;

	for (var i = 0; i < lanesAmount; ++i)
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

	return vehicles.last().farFrom( vehicle.requiredSpace );
}

// check whether *vehicle* from road with *roadId* and lane identified
// by *laneType* and *laneIndex* can pass throug the offramp
Offramp.prototype.canPassThrough = function( vehicle, roadId,
											 laneType, laneIndex )
{
	assert( roadId == this.source || roadId == this.outflow,
			"Wrong road id " + roadId);

	if (this.isConnectedLane( roadId, laneType, laneIndex ))
	{
		return this.canPassThroughConnectedLane( vehicle );
	}

	// lane where vehicle moves on
	var selectedLane = null;
	if ( roadId == this.sourceId )
		selectedLane = this.forwardLanes[ laneIndex ];
	else
		selectedLane = this.backwardLanes[ laneIndex ];

	// no vehicles on lane, of course vehicle can pass through
	if ( selectedLane.vehicles.empty() )
		return true;


	var lastVehicle = selectedLane.vehicles.last();
	var state = lastVehicle.vehicleState;

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
	vehicle.turnLane = this.turnLanes[laneIndex];

	vehicle.movementState = MovementState.ON_OFFRAMP;

	vehicle.prepareForTurn(this.turnDuration[laneIndex],
						   this.turnLanes[laneIndex])

	this.turnLanes[laneIndex].vehicles.push( vehicle );
}

Offramp.prototype.startPassThrough = function( vehicle, roadId, laneIndex )
{
	vehicle.prepareForMove(MovementState.ON_OFFRAMP);

	if ( roadId == this.sourceId )
	{
		vehicle.sourceLane = this.forwardLanes[ laneIndex ];
		this.forwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
	else
	{
		vehicle.sourceLane = this.backwardLanes[ laneIndex ];
		this.backwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
}

Offramp.prototype.calculateTurnDistance = function( vehicle )
{
	return calculateTurnDistance(vehicle, this.pathCalcFunction);
}

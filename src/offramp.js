
function Offramp( _source, _destination, _outflow, _turnType,
				 _connectedLaneType, _connectedLaneIndex )
{
	this.source = _source;
	this.destination = _destination;
	this.outflow = _outflow;

	this.sourceId = this.source.getId();
	this.destinationId = this.destination.getId();
	this.outflowId = this.outflow.getId();

	this.destLanesAmount = this.destination.getLanesAmount();

	this.turn = turnType;

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

	this.turnDuration[] = new Array( this.destLanesAmount );

	for (let i = 0;i < this.destLanesAmount; ++i)
	{
		this.turnDuration[i] = TURN_DURATION_BASE + i * TURN_DURATION_FOR_LANE;
	}
}

// check is it possible to turn now and return index of lane on destination
// road in case of success, otherwise INVALID
Offramp.prototype.canTurn()
{
	// find closest free lane on destination road
	// because right-hand traffic is in use in this simulation,
	// vehicle turns only at right and thus iterate over destination lanes
	// in reverse order

	let freeLaneIndex = INVALID;

	for (let i = this.destLanesAmount - 0; i >= 0; --i)
	{
		if (this.forwardLanes[i].hasEnoughSpace())
		{
			freeLaneIndex = i;
			break;
		}
	}

	if ( freeLaneIndex == INVALID )
	{
		printWarning(arguments.callee.name, "No free lanes");
	}

	return freeLaneIndex;
}

// check whether *vehicle* from road with *roadId* and lane identified
// by *laneType* and *laneIndex* can pass throug the offramp
Offramp.prototype.canPassThrough( vehicle, roadId, laneType, laneIndex )
{
	assert( roadId == this.source || roadId == this.outflow,
			"Wrong road id " + roadId);

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
		// no vehicles on lane, of course vehicle can pass through
		return true;
	}

	let lastVehicle = selectedLane.vehicles.last();
	let state = lastVehicle.vehicleState;

	switch( state )
	{
		case VehicleState.TURNING:
			return lastVehicle.turnCompletion >= 0.5;

		// check whether enough space for new vehicle
		case VehicleState.MOVING:
			return lastVehicle.farFrom( vehicle.getMinimalGap() );

		default:
			printError( arguments.callee.name, "Wrong vehicle state " + state);
			return false;
	}
}

// laneIndex - index of lane on destination road
Offramp.prototype.startTurn = function( laneIndex, vehicle )
{
	if (laneIndex < 0 || laneIndex >= this.destLanesAmount)
	{
		printError("Wrong lane index " + laneIndex);
		return false;
	}

	vehicle.trafficState = TrafficState.FREE_ROAD;
	vehicle.vehicleState = VehicleState.TURNING;
	vehicle.movementState = MovementState.ON_OFFRAMP;

	vehicle.turnCompletion = vehicle.turnElapsedTime = 0;
	vehicle.turnFullTime = this.turnDuration[ laneIndex ];

	vehicle.turnDestinationLane = laneIndex;

	this.connectedLane.vehicles.push( vehicle );

	return true;
}

Offramp.prototype.startPassThrough = function( roadId, laneType,
											  laneIndex, vehicle)
{
	// TODO think is free road state?
	vehicle.trafficState = trafficState.FREE_ROAD;
	vehicle.vehicleState = VehicleState.MOVING;
	vehicle.movementState = MovementState.ON_OFFRAMP;

	if ( laneType == LaneType.FORWARD )
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
	var vehicle = null;
	let vehiclesAmount = this.connectedLane.vehicles.length;

	for (let i = 0; i < vehiclesAmount; i++)
	{
		vehicle = this.connectedLane.vehicles[i];

		// if this vehicle is turning now
		if ( vehicle.vehicleState == VehicleState.TURNING )
		{
			// if turn completed
			if ( vehicle.turnCompletion == 1 )
			{
				// delete vehicle from offramp
				// it will be added to destination road
				this.connectedLane.vehicles.splice(i, 1);

				return vehicle.turnDestinationLane;
			}
		}
	}
}

Offramp.prototype.passCompleted = function( laneType, laneIndex )
{
	let lanes = null;
	let vehicle = null;

	if ( laneType == LaneType.FORWARD )
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

	if ( vehicle.vehicleState == VehicleState.IDLE )
	{
		// remove vehicle from offramp
		lanes[ laneIndex ].vehicles.splice( 0, 1);

		// return object holding reference to vehicle for next adding to
		// some road, otherwise after removal from array object will be lost
		return vehicle;
	}
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

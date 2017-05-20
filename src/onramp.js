function Onramp( _source, _destination, _inflow, _turnType,
				 _connectedLaneType, _connectedLaneIndex )
{
	this.source = _source;
	this.destination = _destination;
	this.inflow = _inflow;

	this.sourceId = this.source.getId();
	this.destinationId = this.destination.getId();
	this.inflowId = this.inflow.getId();

	this.turnType = turnType;

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
	this.turnDuration[] = new Array( sourceLanesAmount );

	for (let i = 0;i < sourceLanesAmount; ++i)
	{
		this.turnDuration[i] = TURN_DURATION_BASE + i * TURN_DURATION_FOR_LANE;
	}
}

Onramp.prototype.canTurn = function( sourceLaneIndex )
{
	// check the most obvious case
	if ( this.connectedLane.vehicles.empty())
	{
		return true;
	}

	// at first check first vehicle at inflow road
	let inflowLane = null;
	if ( this.connectedLaneType == LaneType.FORWARD)
	{
		inflowLane = this.inflow.forwardLanes.last();
	}
	else
	{
		inflowLane = this.inflow.backwardLanes.first();
	}


	if (inflowLane.vehicles.empty() == false)
	{
		let firstVehicle = inflowLane.vehicles.first();

		// distance between vehicle's bumper and road's end
		let requiredSpace = inflowLane.length - 2 *firstVehicle.getMinimalGap();

		// if vehicle too close for road's end
		if (firstVehicle.uCoord >= requiredSpace)
		{
			return false;
		}
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
			case VehicleState.TURNING:
				// if turn completed for less than 50%,
				// then another car cannot start turn
				if ( vehicle.turnCompletion < 0.5 )
					return false;

				break;

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

Onramp.prototype.canPassThrough = function( vehicle, roadId,
											laneType, laneIndex)
{
	// The same logic as for offramp
	// TODO move to one function
	///////////////////////////////////////////////////////////////////////////
	assert( roadId == this.source || roadId == this.inflow,
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
		return true;
	}
	///////////////////////////////////////////////////////////////////////////

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

// laneIndex - index of lane on source road
Onramp.prototype.startTurn = function( laneIndex, vehicle )
{
	vehicle.trafficState = TrafficState.FREE_ROAD;
	vehicle.vehicleState = VehicleState.TURNING;
	vehicle.movementState = MovementState.ON_ONRAMP;

	vehicle.turnCompletion = vehicle.turnElapsedTime = 0;
	vehicle.turnFullTime = this.turnDuration[ laneIndex ];

	this.connectedLane.vehicles.push( vehicle );
}

Onramp.prototype.startPassThrough = function( vehicle, roadId,
											  laneType, laneIndex,)
{
	vehicle.trafficState = trafficState.FREE_ROAD;
	vehicle.vehicleState = VehicleState.MOVING;
	vehicle.movementState = MovementState.ON_ONRAMP;

	if ( laneType == LaneType.FORWARD )
	{
		this.forwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
	else
	{
		this.backwardLanes[ laneIndex ].vehicles.push( vehicle );
	}
}

Onramp.prototype.turnCompeleted = function()
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

				return vehicle;
			}
		}
	}
}

Onramp.prototype.passCompleted = function( laneType, laneIndex )
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

function Onramp( _source, _destination, _inflow,
				_length, _width, _connectedLaneType)
{
	this.source = _source;
	this.destination = _destination;
	this.inflow = _inflow;

	this.type = RoadObject.ONRAMP;

	this.length = _length;
	this.width = _width;

	this.sourceId = this.source.getId();
	this.destinationId = this.destination.getId();
	this.inflowId = this.inflow.getId();

	this.connectedLaneType = _connectedLaneType;

	this.forwardLanes = new Array( this.destination.getForwardLanesAmount() );
	initJunctionLanes(this.forwardLanes);
	setupPassLanes(this.forwardLanes, _length);

	for (let i = 0; i < this.forwardLanes.length; ++i)
	{
        this.forwardLanes[i].angle = _destination.forwardLanes[i].angle;
        this.forwardLanes[i].startX = _inflow.forwardLanes[i].finishX;
        this.forwardLanes[i].startY = _inflow.forwardLanes[i].finishY;
	}


	this.backwardLanes = new Array( this.destination.getBackwardLanesAmount() );
	initJunctionLanes(this.backwardLanes);
	setupPassLanes(this.backwardLanes, _length);

	for (let i = 0; i < this.backwardLanes.length; ++i)
	{
        this.backwardLanes[i].angle = _destination.backwardLanes[i].angle;
        this.backwardLanes[i].startX = _destination.backwardLanes[i].finishX;
        this.backwardLanes[i].startY = _destination.backwardLanes[i].finishY;
	}


	let turnDestinationLane = null;

	if ( _connectedLaneType == LaneType["forward"] )
	{
		this.connectedLane = this.forwardLanes.last();
		this.connectedLaneIndex = this.forwardLanes.length - 1;

		this.inflowLane = _inflow.forwardLanes.last();
		turnDestinationLane = _destination.forwardLanes.last();
	}
	else
	{
		this.connectedLane = this.backwardLanes.last();
		this.connectedLaneIndex = this.backwardLanes.length - 1;

		this.inflowLane = _inflow.backwardLanes.last();
		turnDestinationLane = _destination.backwardLanes.last();
	}

	let sourceLanesAmount = this.source.getLanesAmount();

	// virtual lanes for turning vehicles
	this.turnLanes = new Array( sourceLanesAmount );
	initJunctionLanes(this.turnLanes);
	addVehiclesArray(this.turnLanes);

	setOnrampTurnData(this.turnLanes, _source, _source.forwardLanes,
					  turnDestinationLane)

	let sourceBases = _source.forwardBases;

	let destBases = null;
	if (_destination.startConnection.type == RoadObject.ONRAMP)
		destBases = _destination.forwardBases;
	else
		destBases = _destination.backwardBases;

	this.dx = sourceBases.move_dx == 0 ?
		destBases.move_dx : sourceBases.move_dx;

	this.dy = sourceBases.move_dy == 0 ?
		destBases.move_dy : sourceBases.move_dy;

	this.turnDuration = new Array( sourceLanesAmount );
	for (let i = 0;i < sourceLanesAmount; ++i)
		this.turnDuration[i] = TURN_DURATION_BASE + i * TURN_DURATION_FOR_LANE;

	this.pathCalcFunction = getBezierCurveLength;
}

Onramp.prototype.inflowRoadIsFree = function( requiredSpace )
{
	// at first check first vehicle at inflow road
	if (this.inflowLane.vehicles.empty() == false)
	{
		let firstVehicle = this.inflowLane.vehicles.first();

		// distance between vehicle's bumper and road's end
		let requiredSpace = this.inflowLane.length - 2*firstVehicle.getMinimalGap();

		// if vehicle too close for road's end
		if (firstVehicle.uCoord >= requiredSpace)
			return false;
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

	for (let i = sourceLaneIndex; i < this.turnLanes.length; ++i)
	{
		vehicles = this.turnLanes[i].vehicles;
		lastVehicle = vehicles.last();

		// if turn completed for less than 50%,
		// then another car cannot start turn
		if ( lastVehicle.farFrom(requiredSpace) == false )
			return false;
	}

	if ( this.inflowRoadIsFree(requiredSpace) == false )
		return false;

	let vehicles = this.connectedLane.vehicles;
	let vehiclesAmount = vehicles.length;

	if (vehiclesAmount == 0)
		return true;

	//return false; // clutch

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
				printDebug(this.arguments.callee, "No lane change on onramp!!!");
				return false;
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
	let vehicles = null;
	let lastVehicle = null;

	for (let i = 0; i < this.turnLanes.length; ++i)
	{
		vehicles = this.turnLanes[i].vehicles.
		if (vehicles.empty())
			continue;

		lastVehicle = vehicles.last();

		// if turn completed for less than 50%,
		// then another car cannot start turn
		if ( lastVehicle.farFrom(vehicle.getMinimalGap()) == false )
			return false;
	}

	if (this.inflowRoadIsFree() == false)
		return false;

	vehicles = this.connectedLane.vehicles;
	if (vehicles.empty())
		return true;

	lastVehicle = vehicles.last();

	return lastVehicle.farFrom( vehicle.getMinimalGap() );
};

Onramp.prototype.canPassThrough = function( vehicle, roadId,
											laneType, laneIndex)
{
	// The same logic as for offramp
	// TODO move to one function
	///////////////////////////////////////////////////////////////////////////
	// assert( roadId == this.source || roadId == this.inflow,
	// 		"Wrong road id " + roadId);

	if (this.isConnectedLane( laneType, laneIndex ))
		return this.canPassThroughConnectedLane( vehicle );

	let selectedLane = null;
	if ( laneType == LaneType["backward"] )
	{
		// assert( laneIndex >= this.backwardLanes.length );
		selectedLane = this.backwardLanes[ laneIndex ];
	}
	else
	{
		// assert( laneIndex >= this.forwardLanes.length );
		selectedLane = this.forwardLanes[ laneIndex ];
	}

	if ( selectedLane.vehicles.empty() )
		return true;
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

	let sourceLane = this.turnLanes[laneIndex];

	vehicle.sourceLane = sourceLane;
	vehicle.prepareForTurn(this.turnDuration[laneIndex], sourceLane);

	if (sourceLane.vehicles.empty())
		vehicle.leader = sourceLane.virtualVehicle;

	sourceLane.vehicles.push( vehicle );
};

Onramp.prototype.startPassThrough = function( vehicle, roadId,
											  laneType, laneIndex)
{
	vehicle.movementState = MovementState.ON_ONRAMP;
	vehicle.prepareForMove();

	let sourceLane = null;
	if ( laneType == LaneType["forward"] )
		sourceLane = this.forwardLanes[laneIndex];
	else
		sourceLane = this.backwardLanes[laneIndex];

	vehicle.sourceLane = sourceLane;
	if (sourceLane.vehicles.empty())
		vehicle.leader = sourceLane.virtualVehicle;

	sourceLane.vehicles.push( vehicle );
};

Onramp.prototype.calculateTurnDistance = function( vehicle )
{
	return calculateTurnDistance(vehicle, this.pathCalcFunction);
};

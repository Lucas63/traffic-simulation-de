function Offramp( _source, _destination, _outflow,
				  _length, _width, _connectedLaneType)
{
	this.source = _source;
	this.destination = _destination;
	this.outflow = _outflow;

	this.type = RoadObject.OFFRAMP;

	this.length = _length;
	this.width = _width;

	this.sourceId = this.source.getId();
	this.destinationId = this.destination.getId();
	this.outflowId = this.outflow.getId();

	this.destLanesAmount = this.destination.getLanesAmount();

	this.connectedLaneType = _connectedLaneType;

	this.forwardLanes = new Array( this.source.getForwardLanesAmount() );
	initJunctionLanes(this.forwardLanes);
	setupPassLanes(this.forwardLanes);

	for (let i = 0; i < this.forwardLanes.length; ++i)
		this.forwardLanes[i].angle = _source.forwardLanes[i].angle;

	this.backwardLanes = new Array( this.source.getBackwardLanesAmount() );
	initJunctionLanes(this.backwardLanes);
	setupPassLanes(this.backwardLanes);

	for (let i = 0; i < this.backwardLanes.length; ++i)
		this.backwardLanes[i].angle = _source.backwardLanes[i].angle;

	let turnSourceLane = {};
	if ( _connectedLaneType == LaneType["forward"] )
	{
		this.connectedLane = this.forwardLanes.last();
		this.connectedLaneIndex = this.forwardLanes.length - 1;
		turnSourceLane = _source.forwardLanes.last();
	}
	else
	{
		this.connectedLane = this.backwardLanes.last();
		this.connectedLaneIndex = this.backwardLanes.length - 1;
		turnSourceLane = _source.backwardLanes.last();
	}

	// virtual lanes for turning vehicles
	this.turnLanes = new Array( this.destLanesAmount );
	initJunctionLanes(this.turnLanes);
	addVehiclesArray(this.turnLanes);

	setOfframpTurnData(this.turnLanes, _source, turnSourceLane,
					  _destination.forwardLanes);

	let sourceBases = null;
	if (_source.finishConnection.type == RoadObject.OFFRAMP)
		sourceBases = _source.forwardBases;
	else
		sourceBases = _source.backwardBases;

	let destBases = _destination.forwardLanes[0].bases;

	this.dx = sourceBases.move_dx == 0 ?
		destBases.move_dx : sourceBases.move_dx;

	this.dy = sourceBases.move_dy == 0 ?
		destBases.move_dy : sourceBases.move_dy;

	this.turnDuration = new Array( this.destLanesAmount );

	for (var i = 0;i < this.destLanesAmount; ++i)
		this.turnDuration[i] = TURN_DURATION_BASE + i * TURN_DURATION_FOR_LANE;

	this.pathCalcFunction = getBezierCurveLength;
}

// check is it possible to turn now and return index of lane on destination
// road in case of success, otherwise INVALID
Offramp.prototype.canTurn = function( vehicleRequiredSpace)
{
	var freeLaneIndex = INVALID;

	if ( this.connectedLane.vehicles.empty() &&
		 this.turnLanes.vehicles.empty())
	{
		return freeLaneIndex;
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
		if ( lastVehicle.farFrom(vehicleRequiredSpace) )
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
		printWarning(arguments.callee.name, "No free lanes");

	return freeLaneIndex;
};

Offramp.prototype.isConnectedLane = function( roadId, laneType, laneIndex )
{
	if (roadId != this.sourceId)
		return false;

	if (laneType != this.connectedLaneType)
		return false;

	if (laneIndex != this.connectedLaneIndex)
		return false;

	return true;
};

Offramp.prototype.canPassThroughConnectedLane = function( vehicle )
{
	var lanesAmount = this.turnLanes.length;
	var vehicles = null;
	var lastVehicle = null;

	for (var i = 0; i < lanesAmount; ++i)
	{
		vehicles = this.turnlanes[i].vehicles;
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
};

// check whether *vehicle* from road with *roadId* and lane identified
// by *laneType* and *laneIndex* can pass throug the offramp
Offramp.prototype.canPassThrough = function( vehicle, roadId,
											 laneType, laneIndex )
{
	// assert( roadId == this.source || roadId == this.outflow,
	// 		"Wrong road id " + roadId);

	if (this.isConnectedLane( roadId, laneType, laneIndex ))
		return this.canPassThroughConnectedLane( vehicle );

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
};

// laneIndex - index of lane on destination road
Offramp.prototype.startTurn = function( laneIndex, vehicle )
{
	vehicle.movementState = MovementState.ON_OFFRAMP;

	let sourceLane = this.turnLanes[laneIndex];

	vehicle.sourceLane = sourceLane;
	vehicle.prepareForTurn(this.turnDuration[laneIndex], sourceLane);

	if (sourceLane.vehicles.empty())
		vehicle.leader = sourceLane.virtualVehicle;

	vehicle.dx = this.dx;
	vehicle.dy = this.dy;

	sourceLane.vehicles.push( vehicle );
};

Offramp.prototype.startPassThrough = function( vehicle, roadId, laneIndex )
{
	vehicle.movementState = MovementState.ON_OFFRAMP;
	vehicle.prepareForMove();

	let sourceLane = null;
	if ( roadId == this.sourceId )
		sourceLane = this.forwardLanes[ laneIndex ];
	else
		sourceLane = this.backwardLanes[ laneIndex ];

	vehicle.sourceLane = sourceLane;
	if (sourceLane.vehicles.empty())
		vehicle.leader = sourceLane.virtualVehicle;

	sourceLane.vehicles.push( vehicle );
};

Offramp.prototype.calculateTurnDistance = function( vehicle )
{
	return calculateTurnDistance(vehicle, this.pathCalcFunction);
};

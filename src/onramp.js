

function Onramp( _source, _destination, _outflow, _turnType,
				 _connectedLaneType, _connectedLaneIndex )
{
	this.source = _source;
	this.destination = _destination;
	this.outflow = _outflow;

	this.sourceId = this.source.getId();
	this.destLanesAmount = this.destination.getLanesAmount();

	this.turn = turnType;

	this.connectedLaneType = _connectedLaneType;
	this.connectedLaneIndex = _connectedLaneIndex;

	this.forwardLanes = new Array( this.source.getForwardLanesAmount() );

	this.forwardLanes.forEach( function(lane) {
		lane.vehicles = [];
	})

	this.backwardLanes = new Array( this.source.getBackwardLanesAmount() );

	this.backwardLanes.forEach( function(lane) {
		lane.vehicles = [];
	})
}

// check is it possible to turn now and return index of lane on destination
// road in case of success, otherwise INVALID
Onramp.prototype.canTurn()
{
	// find closest free lane on destination road
	// because right-hand traffic is in use in this simulation,
	// vehicle turns only at right and thus iterate over destination lanes
	// in reverse order

	let freeLaneIndex = INVALID;

	for (let i = this.destLanesAmount - 1; i >= 0; --i)
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

// check whether *vehicle* from road with *roadId* and laned identified
// by *laneType* and *laneIndex* can pass throug the onramp
Onramp.prototype.canPassThrough( vehicle, roadId, laneType, laneIndex )
{
	assert( roadId != this.source || roadId == this.outflow,
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

		case VehicleState.MOVING:
			return lastVehicle.farFrom( vehicle.getMinimalGap() );

		default:
			printError( arguments.callee.name, "Wrong vehicle state " + state);
			return false;
	}
}

Onramp.prototype.startTurn = function( laneIndex, vehicle )
{

}

Onramp.prototype.startPassThrough = function( roadId, laneType,
											  laneIndex, vehicle)
{

}

Onramp.prototype.turnCompeleted = function( laneIndex )
{

}

Onramp.prototype.passCompleted = function( roadId, laneType, laneIndex )
{

}

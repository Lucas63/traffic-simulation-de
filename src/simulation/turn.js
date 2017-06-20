// \param _source - object of road vehicle moves from
// \param _destination - object of road vehicle moves to
// \param _pathCalcFunction - function for calculating moved distance on turn
// \note source and destination roads must have the same lanes quantity!
function Turn( _id, _source, _destination, _pathCalcFunction )
{
	this.id = _id;
	this.source = _source;
	this.destination = _destination;
	this.pathCalcFunction = _pathCalcFunction;

	this.type = RoadObject.TURN;

	// time elapsed from last update
	this.delta = 0;

	let lanesAmount = _source.getForwardLanesAmount() +
					  _source.getBackwardLanesAmount();

	this.lanes = new Array( lanesAmount );
	initJunctionLanes(this.lanes);
	addVehiclesArray(this.lanes);

	// roads connected to turn has only forward lanes, but it is a tradeoff
	setTurnData(this.lanes, _source, _source.forwardLanes,
				_destination.forwardLanes);

	let sourceBases = _source.forwardBases;
	let destBases = _destination.forwardBases;

	this.dx = sourceBases.move_dx == 0 ?
		destBases.move_dx : sourceBases.move_dx;

	this.dy = sourceBases.move_dy == 0 ?
		destBases.move_dy : sourceBases.move_dy;

	this.turnDuration = new Array( lanesAmount );
	for (let i = 0; i < lanesAmount; ++i)
		this.turnDuration[i] = TURN_DURATION_BASE + i * TURN_DURATION_FOR_LANE;
}

Turn.prototype.canTurn = function( laneIndex, vehicle )
{
	// let isValidIndex = laneIndex < 0 || this.lanes.length < laneIndex;
	// assert( isValidIndex, "Wrong index " + laneIndex + "; " +
	// 		"lanes amount is " + this.lanes.length);

	if (this.lanes[laneIndex].vehicles.empty())
		return true;

	// get the last vehicle from selected lane
	let lastVehicle = this.lanes[laneIndex].vehicles.last();

	// if last vehicle on selected turn lane not far from source road
	// and there is not enough space for new vehicle,
	// then vehicle on source road cannot start turning
	if (lastVehicle.farFrom( vehicle.getMinimalGap() ) == false)
		return false;

	let destinationLane = null;

	if (this.destination.getForwardLanesAmount() > 0)
		destinationLane = this.destination.forwardLanes[laneIndex];
	else
		destinationLane = this.destination.backwardLanes[laneIndex];

	// check whether lane on destination road has enough space for new vehicle
	// if does, everything is OK, otherwise reject turn request
	return destinationLane.hasEnoughSpace( vehicle.getMinimalGap() );
};

// add vehicle to turn's lane with index *laneIndex*
Turn.prototype.startTurn = function( laneIndex, vehicle )
{
	// TODO now turn connected only to forward lanes, but real check must be
	// done whether used backward or forward lanes
	vehicle.prepareForTurn(this.turnDuration[laneIndex],
						   this.lanes[laneIndex]);

	let lane = this.lanes[laneIndex];
	if (lane.vehicles.empty())
		vehicle.leader = lane.virtualVehicle;

	vehicle.dx = this.dx;
	vehicle.dy = this.dy;

	lane.vehicles.push( vehicle );
};

Turn.prototype.calculateTurnDistance = function( vehicle )
{
	return calculateTurnDistance(vehicle, this.pathCalcFunction);
};

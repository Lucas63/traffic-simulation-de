/*
 * RoadEngine is a main computational unit initializing and performing
 * traffic simulation.
 */


/*
 * \param _map - *Map* object containing already created map objects
 */
function RoadEngine( _map )
{
	this.map = _map;
}

RoadEngine.prototype.update = function( dt )
{
	this.updateTrafficLights( dt );

	/// check vehicles after previous update, it is an analysis of last update
	/// and it is done before actual current update.
	///
	// check vehicles on roads whether they have reached specific zones
	// on road. After that check all first vehicles at any map object and
	// decide to start passing through or turn.
	//
	this.preUpdate();


	// now update situation on map

	// change lane if it is preferable for vehicle
	this.checkLaneChange();

	// calculate new acceleration, speed and position
	// for each vehicle on the map
	// update velocity with respect to acceleration and
	// position on map object with respect to another vehicles
	this.updateVehicles( dt );
};

RoadEngine.prototype.updateTrafficLights = function( dt )
{
	let junctions = this.map.junctions;
	for (let i = 0;i < junctions.length; ++i)
	{
		junctions[i].updateTrafficLights(dt);
	}
};

// all internal functions work on roads and vehicles on them,
// to prevent iteration over the same arrays several times, all computations
// done for each array only once instead of separate functions
// Yes, I know that "premature optimization is the root of all evil".
RoadEngine.prototype.preUpdate = function()
{
	let roads = this.map.roads;

	// check whether vehicles on upstream, downstream or jam
	for (let i = 0;i < roads.length;++i)
	{
		// check the first vehicle on each lane or map object
		// for completing move on current object, namely vehicle
		// reached lane's or turn's end and ready to go on
		// at next object on route

		// check vehicles that have moved to the end of current map object,
		// i.e. reached finish or start of road/onramp/offramp/turn/junction
		checkArrivedVehiclesOnRoad( road );

		// check whether spawn points ready
		checkSpawnPoints( roads[i] );
	}

	// vehicle's traffic state can be changed after previous functions,
	// so check and update models if required

	for (let i = 0; i < roads.length; ++i)
	{
		// update separately, because after updating road with index i, new vehicles
		// can be added to this road by checkArrivedVehiclesOnRoad(), i.e. vehicle
		// move to the i-th road from another road when neighbours already updated
		// on i-th road

		// update following and leading vehicles on each lane
		updateNeighbours( roads[i] );


		// check upstream/downstream condtion
		checkTrafficState( roads[i] );

		// Vehicles on another map objects don't change own models, thus only
		// vehicles on road are updated
		checkVehiclesPositionOnRoad( roads[i] );

		// and this updates models
		updateModels( roads[i] );
	}

	this.map.turns.forEach(checkArrivedVehiclesOnTurn);
	this.map.onramps.forEach(checkArrivedVehiclesOnOnramp);
	this.map.offramps.forEach(checkArrivedVehiclesOnOfframp);
	this.map.junctions.forEach(checkArrivedVehiclesOnJunction)
};

/*
 * \brief to check if vehicle can move to new road, appropriate lanes must
 * be found, i.e., forward or backward. *next* is a road and if next road
 * connected with *current* at start, then destination lane within forward
 * lanes, otherwise destination lane is backward one.
 *
 * \param current - map object where vehicle stands now
 * \param next - map object where vehicle wants to move
 * \param laneIndex - index of lane in lanes array
 */
function getDestinationLane( current, next, laneIndex )
{
	if (next.startConnection == current)
	{
		return next.forwardLanes[laneIndex];
	}
	else
	{
		return next.backwardLanes[laneIndex];
	}
}

///////////////////////////////////////////////////////////////////////////////
/// Here is code for current update
///////////////////////////////////////////////////////////////////////////////

RoadEngine.prototype.checkLaneChange = function()
{
	let roads = this.map.roads;

	for (let i = 0; i < roads.length; ++i)
	{
		checkLaneChangeOnLanes( roads[i].forwardLanes );
		checkLaneChangeOnLanes( roads[i].backwardLanes );
	}
};

// This function updates acceleration, speed and position of each vehicle
// on each map object
RoadEngine.prototype.updateVehicles = function( dt )
{
	let roads = this.map.roads;
	for (let i = 0; i < roads.length; ++i)
		updateVehiclesOnRoad( roads[i], dt );

	let turns = this.map.turns;
	for (let i = 0; i < turns.length; ++i)
		updateVehiclesOnTurn( turns[i], dt );

	let onramps = this.map.onramps;
	for (let i = 0; i < onramps.length; ++i)
		updateVehiclesOnOnrampOrOfframp( onramps[i], dt );

	let offramps = this.map.offramps;
	for (let i = 0; i < offramps.length; ++i)
		updateVehiclesOnOnrampOrOfframp( offramps[i], dt );

	let junctions = this.map.junctions;
	for (let i = 0; i < junctions.length; ++i)
		updateVehiclesOnJunction( junctions[i], dt );
};

function updateVehiclesOnRoad( road, dt )
{
	let lanes = null;

	lanes = road.forwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		updateVehiclesOnLane(lanes[i], road, dt)

	lanes = road.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		updateVehiclesOnLane(lanes[i], road, dt)
}

function updateVehiclesOnTurn( turn, dt )
{
	let lanes = turn.lanes;
	for (let i = 0; i < lanes.length; ++i)
		updateVehiclesOnLane(lanes[i], turn, dt)
}

// Update is the same for onramp and offramp
function updateVehiclesOnOnrampOrOfframp( mapObject, dt )
{
	let lanes = mapObject.turnLanes;
	for (let i = 0; i < lanes.length; ++i)
		updateVehiclesOnLane(lanes[i], mapObject, dt)

	lanes = mapObject.forwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		updateVehiclesOnLane(lanes[i], mapObject, dt)

	lanes = mapObject.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		updateVehiclesOnLane(lanes[i], mapObject, dt)
}

function updateVehiclesOnJunction( junction, dt )
{
	updateAccelerationsOnJunctionRoad( junciton, junction.topRoad, dt );
	updateAccelerationsOnJunctionRoad( junction, junction.rightRoad, dt );
	updateAccelerationsOnJunctionRoad( junction, junction.bottomRoad, dt );
	updateAccelerationsOnJunctionRoad( junction, junction.leftRoad, dt );
}

function updateVehiclesOnJunctionRoad( junction, junctionRoad, dt )
{
	let lanes = junctionRoad.turnRightLanes;
	for (let i = 0; i < lanes.length; ++i)
		updateVehiclesOnLane(lanes[i], junction, dt)

	lanes = junctionRoad.passLanes;
	for (let i = 0; i < lanes.length; ++i)
		updateVehiclesOnLane(lanes[i], junction, dt)

	lanes = junctionRoad.turnLeftLanes;
	for (let i = 0; i < lanes.length; ++i)
		updateVehiclesOnLane(lanes[i], junction, dt)
}

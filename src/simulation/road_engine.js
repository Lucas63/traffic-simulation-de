/*
 * RoadEngine is a main computational unit initializing and performing
 * traffic simulation.
 */


/*
 * \param _roads - roads data from map configuration file
 * \param _roadObjects - road objects data from map configuration file
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
}

RoadEngine.prototype.updateTrafficLights = function( dt )
{
	let junctions = this.map.junctions;
	for (let i = 0;i < junctions.length; ++i)
	{
		junctions[i].updateTrafficLights(dt);
	}
}

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
}



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
}

function checkLaneChangeOnLanes( lanes )
{
	let vehicles = null;
	let vehicle = null;

	// check the very first lane
	checkLaneChangeForNeighbourLanes(null, lanes[0], lanes[1]);

	for (let i = 1; i < lanes.length - 1; ++i)
		checkLaneChangeForNeighbourLanes(lanes[i - 1], lanes[i], lanes[i + 1]);

	// check the last lane
	checkLaneChangeForNeighbourLanes(lanes[lanes.length - 1],
									 lanes.last(), null);
}

// left - lane at left
// current - lane under processing
// right - lane at right
function checkLaneChangeForNeighbourLanes( left, current, right)
{
	let resultAtLeft = {
		currentAcceleration: 0,
		followerAcceleration: 0
	};

	let resultAtRight = {
		currentAcceleration: 0,
		followerAcceleration: 0
	};

	let turnLeft = false;
	let turnRight = false;

	let vehicles = current.vehicles;
	let vehicle = null;

	for (let i = 0; i < vehicles.length; ++i)
	{
		vehicle = vehicles[i];

		// if lane at left exists
		if (null != left)
			turnLeft = assesLaneChange(vehicle, true, resultAtLeft);

		// if lane at right exists
		if (null != right)
			turnRight = assesLaneChange(vehicle, false, resultAtRight);

		// if vehicle can change lane at left or right
		if (turnLeft && turnRight)
		{
			if (resultAtLeft.currentAcceleration >
				resultAtRight.currentAcceleration)
			{
				doLaneChange( current,left, vehicle, true );
			}
			else
			{
				doLaneChange( current, right, vehicle, false );
			}
		}

		if (turnLeft)
			doLaneChange( left, vehicle, true );

		if (turnRight)
			doLaneChange( right, vehicle, false );
	}
}


// currentVehicle - vehicle considering to change laneIndex
// atLeft - if true, than consider lane change at left, otherwise at right
// result [output] - contains results of calculations.
// result.currentAcceleration - prospective acceleration of current vehicle
// in case of lane change
// result.followerAcceleration - acceleration of prospective follower in case
// of lane change
function assesLaneChange(currentVehicle, atLeft, result)
{
	// vehicle must complete previous lane change
	if (currentVehicle.vehicleState == VehicleState.CHANGE_LANE)
		return false;

	let adjacentLeader = null;
	let adjacentFollower = null;

	// get observed leader and follower
	if (atLeft)
	{
		adjacentLeader = currentVehicle.leaderAtLeft;
		adjacentFollower = currentVehicle.followerAtLeft;
	}
	else
	{
		adjacentLeader = currentVehicle.leaderAtRight;
		adjacentLeader = currentVehicle.followerAtRight;
	}

	// actual gap between prospective leader and current vehicle
	let gapBeforeLeader =
		adjacentLeader.getSafeDistance() - currentVehicle.uCoord;

	// there is not enough space before neighbour leader to change lane
	if (gapBeforeLeader < 0)
		return false;

	// actual gap between current vehicle and prospective follower
	gapAfterFollower =
		currentVehicle.getSafeDistance() - adjacentFollower.uCoord;

	// there is not enough space after neighbour follower to change lane
	if (gapAfterFollower < 0)
		return false;

	// acceleration of current vehicle after prospective lane change
	let currentAccAfterChange = currentVehicle.longModel.
		calculateAcceleration(gapBeforeLeader, currentVehicle.speed,
							  adjacentLeader.speed);

	result.currentAcceleration = currentAccAfterChange;

	// acceleration of follower after prospective lane change
	let followerAccAfterChange = adjacentFollower.longModel.
		calculateAcceleration(gapAfterFollower, adjacentFollower.speed,
							  currentVehicle.speed);

	result.followerAccAfterChange = followerAccAfterChange;

	let velocitiesRatio =
		currentVehicle.speed / currentVehicle.longModel.desiredSpeed;

	// decide whether it be better to change lane or not
	return currentVehicle.laneChangeModel.
		analyzeLaneChange(velocitiesRatio, currentVehicle.acceleration,
						  currentAccAfterChange, followerAccAfterChange);
}

function doLaneChange( currentLane, newLane, vehicle, atLeft )
{
	let adjacentFollower = null;

	if (atLeft)
		adjacentFollower = vehicle.followerAtLeft;
	else
		adjacentFollower = vehicle.followerAtRight;

	vehicle.vehicleState = VehicleState.CHANGE_LANE;
	vehicle.trafficState = TrafficState.FREE_ROAD;
	vehicle.sourceLane = currentLane;

	let adjacentFollowerIndex = lane.vehicles.indexOf(adjacentFollower);
	newLane.vehicles.splice(adjacentFollowerIndex, 0, vehicle);
}


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
}

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

function updateVehiclesOnLane( lane, mapObject, dt )
{
	let vehicles = lane.vehicles;
	let vehicle = vehicles[0];

	vehicle.acceleration =
		updateAccelerationForVehicle(vehicle, vehicle.leader);

	updateSpeedAndPosition(vehicle, mapObject, dt);

	for (let i = 1; i < vehicles.length; ++i)
	{
		vehicle = vehicles[i];
		vehicle.acceleration =
			updateAccelerationForVehicle(vehicle, vehicles[i - 1]);

		updateSpeedAndPosition(vehicle, mapObject, dt);
	}
}


function updateAccelerationForVehicle( currentVehicle, leaderVehicle )
{
	let gap = 0;
	let leaderSpeed = 0;

	let gap = leaderVehicle.uCoord - leaderVehicle.length -
			  currentVehicle.uCoord;

	let currentSpeed = currentVehicle.speed;
	let leaderSpeed = leaderVehicle.speed;

	return currentVehicle.longModel.
		calculateAcceleration(gap, currentSpeed, leaderSpeed);
}

function updateSpeedAndPosition( vehicle, mapObject, dt )
{
	switch (vehicle.vehicleState)
	{
		case VehicleState.MOVING:
			updateStraightMove( vehicle, mapObject, dt );
			break;

		case VehicleState.TURNING:
			updateTurn( vehicle, mapObject, dt );
			break;

		case VehicleState.CHANGE_LANE:
			this.updateLaneChange( dt );
			break;

		case VehicleState.IDLE:
			// do nothing
			break;

		default:

	}
}

// dt - delta of time
// length - length of map object vehicle moves at
function updateStraightMove( vehicle, mapObject, dt )
{
	// update velocity
	let newPosition = vehicle.speed * dt + 0.5 * vehicle.acceleration * dt * dt;
	vehicle.uCoord += Math.Max(0, newPosition);

	let safeDistance = mapObject.length - MINIMAL_GAP;
	if (vehicle.uCoord >= safeDistance)
	{
		vehicle.stop(safeDistance);
		vehicle.arrived = true;

		return;
	}

	vehicle.speed += vehicle.acceleration * dt;
	vehicle.speed = Math.max( 0, vehicle.speed);
}


function updateTurn( vehicle, mapObject, dt )
{
	// no need to compute position
	if (vehicle.arrived)
		return;

	this.turnElapsedTime += dt;
	this.turnCompletion = Math.max(this.turnElapsedTime / this.turnFullTime, 1);

	let newPosition = mapObject.calculateTurnDistance( vehicle );

	// it possible that vehicle waits on turn to move on destination road
	// if destination road is congested and no space for new vehicle
	if (turnCompletion == 1)
	{
		// turn has been completed
		vehicle.stop( newPosition );
		this.arrived = true;
	}

	this.uCoord = newPosition;
}

function updateLaneChange( vehicle, dt )
{
	// TODO <Artem> implement me!
}

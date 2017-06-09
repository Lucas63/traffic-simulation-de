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
	this.checkLaneChange( dt );

	// calculate new acceleration for this step and check whether vehicle in
	// upstream/downstream zone. Update models if required.
	this.updateAccelerations();

	// update velocity with respect to acceleration and position on map object
	// with respect to another vehicles
	this.updatePositionsAndVelocities();
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

function checkSpawnPoints(road)
{
    checkSpawnPointsForLanes(road.forwardLanes);
    checkSpawnPointsForLanes(road.backwardLanes);
}

function checkSpawnPointsForLanes( lanes )
{
    let point = null;

    for (let i = 0;i < lanes.length; ++i)
    {
        point  = lanes[i].spawnPoint;
        if (null == point)
            continue;

        if (point.ready())
        {
            // hack! I want prevent sitation when spawn point generates vehicle
            // and only after Road Engine checks whether enough space for it.
            // Spawn point can generate car or truck and length of each vehicle
            // is different, thus it's possible that lane has enough space for
            // car, but not for truck.
            if (lanes[i].hasEnoughSpace( TRUCK_LENGTH ))
            {
                let vehicle = point.spawn();
                lanes[i].addVehicle();
            }
        }
    }
}

function checkVehiclesPositionOnRoad( road )
{
	let lanes = road.forwardLanes;
	for (let i = 0; i < lanes.length; ++i)
	{
		checkVehiclesOnLane( lanes[i], road );
	}

	lanes = road.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
	{
		checkVehiclesOnLane( lanes[i], road );
	}
}

// check vehicles at safe distance and update model or stop them
function checkVehiclesOnLane( lane, road )
{
	for (let i = 0; i < lane.vehicles.length; ++i)
	{
		vehicle = lane.vehicles[i];

		// to close to road's end, stop it!
		if (vehicle.uCoord >= road.borderDistance)
		{
			vehicle.uCoord = road.borderDistance;
			vehicle.arrived = true;
			vehicle.stop( roadLength );
			continue;
		}

		// let vehicle complete lane change without changing longitudinal
		// and lane change models
		if (vehicle.vehicleState == VehicleState.CHANGE_LANE)
			continue;

		if ( road.length - vehicle.uCoord < vehicle.safeDistance )
		{
			vehicle.longModel = UPSTREAM_IDM;
			vehicle.laneChangeModel = UPSTREAM_MOBIL;
			continue;
		}
	}
}

// check upstream/downstream state for vehicle on each road
function checkTrafficState( road )
{
	let lanes = road.forwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkTrafficStateForVehicles(lanes[i].vehicles);

	lanes = road.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkTrafficStateForVehicles(lanes[i].vehicles);
}

function checkTrafficStateForVehicles(vehicles)
{
	let vehicle = null;
	for (let i = 0; i < vehicles.length; ++i)
	{
		vehicle = vehicles[i];

		if (onUpstream(vehicle, vehicle.leader))
		{
			vehicle.trafficState = TrafficState.UPSTREAM;
			continue;
		}

		if (onDownstream(vehicle, vehicle.leader))
		{
			continue;
		}

		if (onJam(vehicle))
		{
			vehicle.trafficState = TrafficState.JAM;
			continue;
		}
	}
}

// update longitudinal and lane change models for vehicles on roads
// vehicles on junction/onramp/offramp/turn are not affected
function updateModels( road )
{
	let lanes = road.forwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		setLongitudinalModel(lanes[i].vehicles);

	lanes = road.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		setLongitudinalModel(lanes[i].vehicles);
}

function setLongitudinalModel(vehicles)
{
	let vehicle = null;
	for (let i = 0; i < vehicles.length; ++i)
	{
		vehicle = vehicles[i];

		switch( vehicle.trafficState )
		{
			case TrafficState.FREE_ROAD:
				vehicle.longitudinalModel = freeRoadIDM;
				vehicle.laneChangeModel = freeRoadMOBIL;
				break;

			case TrafficState.UPSTREAM:
				vehicle.longitudinalModel = upstreamIDM;
				vehicle.laneChangeModel = upstreamMOBIL;
				break;

			case  TrafficState.DOWNSTREAM:
				vehicle.longitudinalModel = downstreamIDM;
				vehicle.laneChangeModel = downstreamMOBIL;
				break;

			case  TrafficState.JAM:
				vehicle.longitudinalModel = jamIDM;
				vehicle.laneChangeModel = jamMOBIL;
				break;
		}
	}
}

function checkArrivedVehiclesOnRoad( road )
{
	let lanes = road.forwardLanes;

	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle( road, lanes[i], i)

	lanes = road.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle( road, lanes[i], i)
}

function checkArrivedVehiclesOnTurn( turn )
{
	for (let i = 0; i < turn.lanes.length; ++i)
		checkArrivedVehicle(turn, turn.lanes[i], i)
}

function checkArrivedVehiclesOnOnramp( onramp )
{
	let lanes = onramp.forwardLanes;

	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle(onramp, lanes[i], i);

	lanes = onramp.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle(onramp, lanes[i], i);

	lanes = onramp.turnLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle(onramp, lanes[i], i);
}

function checkArrivedVehiclesOnOfframp( offramp )
{
	let lanes = offramp.forwardLanes;

	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle(offramp, lanes[i], i);

	lanes = offramp.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle(offramp, lanes[i], i);

	lanes = offramp.turnLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle(offramp, lanes[i], i);
}

/*
 * \param currentObject - map object where vehicle stands now
 * \param lane - Lane object where vehicle stands now
 * \param laneIndex - index of lane in lanes array
 */
function checkArrivedVehiclesOnJunction( junction )
{
    let lanes = null;

    // check vehicles
    let road = junction.getJunctionRoadForSide( JunctionSides["top"]);
    checkArrivedVehiclesOnJunctionRoad(road);

    road = junction.getRoadForSide( JunctionSides["right"] );
    checkArrivedVehiclesOnJunctionRoad(road);

    road = junction.getRoadForSide( JunctionSides["bottom"] );
    checkArrivedVehiclesOnJunctionRoad(road);

    road = junction.getRoadForSide( JunctionSides["left"] );
    checkArrivedVehiclesOnJunctionRoad(road);
}

function checkArrivedVehiclesOnJunctionRoad( road )
{
    let lanes = junctionRoad.passLanes;
    for (let i = 0; i < lanes.length; ++i)
    {
        checkArrivedVehicle(junction, lanes[i], i);
    }

    lanes = junctionRoad.turnRightLanes;
    for (let i = 0; i < lanes.length; ++i)
    {
        checkArrivedVehicle(junction, lanes[i], i);
    }

    lanes = road.turnLeftLanes;
    for (let i = 0; i < lanes.length; ++i)
    {
        checkArrivedVehicle(junction, lanes[i], i);
    }
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

/*
 * \param currentObject - map object where vehicle stands now
 * \param lane - Lane object where vehicle stands now
 * \param laneIndex - index of lane in lanes array
 */
function checkArrivedVehicle( currentObject, lane, laneIndex )
{
	let vehicle = lane.vehicles.first();

	if ( vehicle.arrived == false)
		return;

	let nextObject = getNextObjectOnRoute( vehicle );
	if ( nextObject == RoadObject.VOID )
	{
		// vehicle finished route and will be destroyed
		lane.vehicles.splice(0, 1);
		return;
	}

    let moved = false;

	switch ( nextObject )
	{
		case RoadObject.ROAD:
            let lanes = nextObject.getLanesConnectedWith( currentObject );

            if (lanes[laneIndex].hasEnoughSpace(vehicle.getMinimalGap())
            {
                lanes[laneIndex].addVehicle(vehicle);
                moved = true;
            }
    		break;

		case RoadObject.TURN:
			if (nextObject.canTurn( vehicle ))
			{
				nextObject.startTurn( vehicle );
                moved = true;
			}
    		break;

		case RoadObject.ONRAMP:
		case RoadObject.OFFRAMP:
			let movement = getNextMovement( vehicle );
			switch (movement)
			{
				case MovementType["pass"]:
					if (nextObject.canPassThrough( vehicle, road.getId(),
													lane.type, laneIndex))
					{
						nextObject.startPassThrough()
                        moved = true;
					}
				break;

				case MovementType["turnLeft"]:
				case MovementType["turnRight"]:
					if (nextObject.canTurn( ))
					{
						nextObject.startTurn(laneIndex, vehicle);
                        moved = true;
					}

				break;
			}
    		break;

        case RoadObject.JUNCTION:
            let movement = getNextMovement( vehicle );

            let id = currentObject.getId();
            let space = vehicle.getMinimalGap();

            switch (movement)
            {
                case MovementType["pass"]:
                    if ( junction.canPassThrough(id, laneIndex, space) )
                    {
                        junction.startPassThrough(id, laneIndex, vehicle)
                        moved = true;
                    }
                    break;

                case MovementType["turnRight"]:
                    if ( junction.canTurnRight(id, laneIndex, space))
                    {
                        junction.startTurnRight(id, laneIndex, vehicle);
                        moved = true;
                    }
                    break;

                case MovementType["turnLeft"]:
                    if ( junction.canTurnLeft(id, laneIndex, space) )
                    {
                        junction.startTurnLeft(id, laneIndex, vehicle);
                        moved = true;
                    }
                    break;
            }
            break;
	}

    if (moved)
    {
    	++vehicle.routeItemIndex;
    	// reference to vehicle already saved in appropriate object
    	lane.vehicles.splice(0,1);
    }
}

// get movement to the next map object: pass through, turn left or right
function getNextMovement( vehicle )
{
	let route = this.map.routes[ vehicle.routeId ];

	if ( vehicle.routeItemIndex == route.items.length - 1)
		return null;

	let item = this.map.routes[ vehicle.routeItemIndex + 1 ];
	return item.movement;
}

function getNextObjectOnRoute( vehicle )
{
	let route = this.map.routes[ vehicle.routeId ];

	if ( vehicle.routeItemIndex == route.items.length - 1)
	{
		return RoadObject.VOID;
	}

	let item = this.map.routes[ vehicle.routeItemIndex + 1 ];

	// maybe item.id must be subtracted by 1, because id in configuration
	// json files start from 1
	let id = item.id;

	switch( item.type )
	{
		case RouteItemType.ROAD:
			return this.map.roads[id];

		case RouteItemType.ONRAMP:
			return this.map.onramps[id];

		case RouteItemType.OFFRAMP:
			return this.map.offramps[id];

		case RouteItemType.TURN:
			return this.map.turns[id];

		case RouteItemType.JUNCTION:
			return this.map.junctions[id];
	}
}


function updateNeighboursOnRoad( road )
{
    updateNeighboursOnLanes(road.forwardLanes);
    updateNeighboursOnLanes(road.backwardLanes);
}

function updateNeighboursOnLanes( lanes )
{
    updateNeighbours(lanes[0], null, false);

    // actually not executed:) because each road has only 2 lanes
    // with the same direction
    for (let i = 1; i < lanes.length - 1; ++i)
    {
        updateNeighbours(lanes[i], lanes[i - 1], true);
        updateNeighbours(lanes[i], lanes[i + 1], false);
    }

    updateNeighbours(lanes.last(), lanes[lanes.length - 1], true);
}

<<<<<<< HEAD
// this function chechs whether vehicle change lane or not
// current - lane where vehicles can start lane change from
// prospective - lane where they can move
function assesLaneChange( current, prospective, isLeft )
=======

// current - lane which vehicles updated for
// adjacent - adjacent lane for current one
// atLeft - adjacent lane at left or right
// \note *current* and *adjacent* can be not Lane object, but lanes from
// junctions where lane is just an object holding *vehicles* array
function updateNeighbours(current, adjacent, atLeft)
>>>>>>> dce29801c620ff6de12a64529e8c3ec4062b36bb
{
    let currentVehicles = current.vehicles;
    let adjacentVehicles = adjacent.vehicles;

    let currentCoord = 0;

    // place on lane vehicle takes plus required minimal gap between vehicles
    let currentSpace = 0;

    let adjacentCoord = 0;
    let adjacentSpace = 0;

    let leader = null;
    let follower = null;


    // always start from the first vehicle on lane, it has the biggest
    // u coordinate value
    for (let i = 0; i < currentVehicles.length; ++i)
    {
        currentCoord = currentVehicles[i].uCoord;
        currentLength = currentVehicles[i].length;

        // vehicle moves on lane in direction of increasing u coordinate,
        // thus decrease length and minimal gap between vehicles.
        // Resulted value is the highest u coordinate when vehicle on adjacent
        // lane can change lane
        currentSpace = currentCoord - currentVehicles[i].getMinimalGap();

        if (atLeft)
        {
            leader = currentVehicles[i].leaderAtLeft;
            follower = currentVehicles[i].followerAtLeft;
        }
        else
        {
            leader = currentVehicles[i].leaderAtRight;
            follower = currentVehicles[i].followerAtRight;
        }

        // there are no vehicles on adjacent lane, set null
        if (adjacentVehicles.empty())
        {
            leader = null;
            follower = null;
            continue;
        }

        for (let j = 0; j < adjacentVehicles.length; ++j)
        {
            adjacentCoord = adjacentVehicles[j].uCoord;
            adjacentSpace = adjacentCoord - adjacentVehicles[j].getMinimalGap();

            // adjacent vehicle far than vehicle on current lane
            // go on inspect adjacent vehicles until find that no far than
            // current one
            if (adjacentSpace > currentCoord)
                continue;

            // current vehicle is far than adjacent one
            if (currentSpace > adjacentCoord)
            {
                // no vehicle far than this one
                leader = null;
                follower = adjacentVehicles[j];

<<<<<<< HEAD
// this function updates leading and following vehicles for each vehicles
// it's required for lane change. information about leading and following
// vehicles must be actual on each simulation step.
RoadEngine.prototype.updateNeighbours = function()
{
	let roads = this.map.roads;
	for (let i = 0;i < roads.length; ++i)
	{
		updateNeighboursForRoadLanes(roads[i].forwardLanes);
		updateNeighboursForRoadLanes(roads[i].backwardLanes);
	}
}
=======
                // break from outer for loop
                break;
            }
>>>>>>> dce29801c620ff6de12a64529e8c3ec4062b36bb

            leader = adjacentVehicles[j];

            follower = null;

            // if j is not last valid index
            if (j + 1 != adjacentVehicles.length)
            {
                follower = adjacentVehicles[j + 1];
            }

            break;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
/// Here is code for current update
///////////////////////////////////////////////////////////////////////////////

RoadEngine.prototype.checkLaneChange = function( road )
{
    let roads = this.map.roads;

    for (let i = 0; i < roads.length; ++i)
    {
        checkLaneChangeOnLanes( roads[i].forwardLanes );
        checkLaneChangeOnLanes( roads[i].backwardLanes );
    }
}

function checkLaneChangeOnLanes( lane )
{
    let vehicles = lane.vehicles;
    let vehicle = null;

    for (let i = 0; i < vehicles.length; ++i)
    {
        // TODO complete me
    }
}

function check

RoadEngine.prototype.updateAccelerations = function( dt )
{

}

RoadEngine.prototype.updatePositionsAndVelocities = function( dt )
{

}

RoadEngine.prototype.updatePositionsAndVelocitiesOnRoads = function( dt )
{

}

RoadEngine.prototype.updatePositionsAndVelocitiesOnJunctions = function( dt )
{
	let junctions = this.map.junctions;
	for (let i = 0; i < junctions.length; ++i)
		junctions[i].update(dt);
}

RoadEngine.prototype.updatePositionsAndVelocitiesOnTurns = function( dt )
{
	let turns = this.map.turns;
	for (let i = 0; i < turns.length; ++i)
		turns[i].update( dt );
}

RoadEngine.prototype.updatePositionsAndVelocitiesOnOnramps = function( dt )
{
	let onramps = this.map.onramps;
	for (let i = 0; i < onramps.length; ++i)
		onramps[i].update( dt );
}

RoadEngine.prototype.updatePositionsAndVelocitiesOnOfframps = function( dt )
{
	let offramps = this.map.offramps;
	for (let i = 0; i < offramps.length; ++i)
		offramps[i].update( dt );
}

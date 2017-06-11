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
		checkArrivedVehicle(junction, lanes[i], i);

	lanes = junctionRoad.turnRightLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle(junction, lanes[i], i);

	lanes = road.turnLeftLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkArrivedVehicle(junction, lanes[i], i);
}

/*
 * \param currentObject - map object where vehicle stands now
 * \param lane - Lane object where vehicle stands now
 * \param laneIndex - index of lane in lanes array
 */
function checkArrivedVehicle( currentObject, lane, laneIndex )
{
	if (lane.vehicles.empty())
		return;

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

			if (lanes[laneIndex].hasEnoughSpace(vehicle.getMinimalGap()))
			{
				lanes[laneIndex].addVehicleAsLast(vehicle);
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

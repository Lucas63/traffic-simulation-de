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
		removeVehicle(lane, 0);
		return;
	}

	let moved = false;

	switch ( nextObject.type )
	{
		case RoadObject.ROAD:
			if (canMoveToRoad(currentObject, nextObject, laneIndex, vehicle))
			{
				moveToRoad(currentObject, nextObject, laneIndex, vehicle);
				moved = true;
			}
			break;

		case RoadObject.TURN:
			if (canMoveToTurn( nextObject, laneIndex, vehicle))
			{
				moveToTurn(nextObject, laneIndex, vehicle);
				moved = true;
			}
			break;

		case RoadObject.ONRAMP:
			// currentObject is road, because onramp connected only to roads
			let roadId = currentObject.getId();

			if (canMoveToOnramp(nextObject, roadId, lane, laneIndex, vehicle))
			{
				moveToOnramp(nextObject, roadId, lane, laneIndex, vehicle);
				moved = true;
			}
			break;

		case RoadObject.OFFRAMP:
			// currentObject is road, because offramp connected only to roads
			let roadId = currentObject.getId();

			if (canMoveToOfframp(nextObject, roadId, lane, laneIndex, vehicle))
			{
				moveToOfframp(nextObject, roadId, lane, laneIndex, vehicle);
				moved = true;
			}
			break;

		case RoadObject.JUNCTION:
			let movement = getNextMovement( vehicle );
			let id = currentObject.getId();

			if (canMoveToJunction(movement, nextObject, id, laneIndex, vehicle))
			{
				moveToJunction(movement, nextObject, id, laneIndex, vehicle);
				moved = true;
			}
			break;
	}

	if (moved)
	{
		++vehicle.routeItemIndex;
		// reference to vehicle already saved in appropriate object
		removeVehicle(lane, 0);
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
		return RoadObject.VOID;

	let item = route.items[ vehicle.routeItemIndex + 1 ];

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

function canMoveToRoad( currentObject, road, laneIndex, vehicle )
{
	let lanes = road.getLanesConnectedWith( currentObject );

	if ( lanes[laneIndex].hasEnoughSpace( vehicle.getMinimalGap() ) )
		return true;

	return false;
}

function canMoveToTurn( turn, laneIndex, vehicle )
{
	return turn.canTurn( laneIndex, vehicle );
}

function canMoveToOnramp( onramp, roadId, lane, laneIndex, vehicle )
{
	let movement = getNextMovement( vehicle );
	switch (movement)
	{
		case MovementType["pass"]:
			if (onramp.canPassThrough( vehicle, roadId, lane.type, laneIndex))
				return true;
		break;

		case MovementType["turnLeft"]:
		case MovementType["turnRight"]:
			if (onramp.canTurn(laneIndex, vehicle.getMinimalGap()))
				return true;
		break;
	}

	return false;
}

function canMoveToOfframp( offramp, roadId, lane, laneIndex, vehicle )
{
	let movement = getNextMovement( vehicle );
	switch (movement)
	{
		case MovementType["pass"]:
			if (offramp.canPassThrough( vehicle, roadId, lane.type, laneIndex))
				return true;

		break;

		case MovementType["turnLeft"]:
		case MovementType["turnRight"]:
			if ( offramp.canTurn(vehicle.getMinimalGap()) != INVALID )
				return true;

		break;
	}

	return false;
}

function canMoveToJunction( movement, junction, roadId, laneIndex, vehicle)
{
	let space = vehicle.getMinimalGap();

	switch (movement)
	{
		case MovementType["pass"]:
			if ( junction.canPassThrough(roadId, laneIndex, space) )
				return true;

			break;

		case MovementType["turnRight"]:
			if ( junction.canTurnRight(roadId, laneIndex, space) )
				return true;

			break;

		case MovementType["turnLeft"]:
			if ( junction.canTurnLeft(roadId, laneIndex, space) )
				return true;

			break;
	}
}

function moveToRoad( currentObject, road, laneIndex, vehicle )
{
	let lanes = road.getLanesConnectedWith( currentObject );
	lanes[laneIndex].pushVehicle(vehicle);
}

function moveToTurn( turn, laneIndex, vehicle )
{
	turn.startTurn( laneIndex, vehicle );
}

function moveToOnramp( onramp, roadId, lane, laneIndex, vehicle )
{
	let movement = getNextMovement( vehicle );
	switch (movement)
	{
		case MovementType["pass"]:
			onramp.startPassThrough(vehicle, roadId, lane.type, laneIndex);
		break;

		case MovementType["turnLeft"]:
		case MovementType["turnRight"]:
			onramp.startTurn(laneIndex, vehicle);
		break;
	}
}

function moveToOfframp( offramp, roadId, lane, laneIndex, vehicle )
{
	let movement = getNextMovement( vehicle );
	switch (movement)
	{
		case MovementType["pass"]:
				offramp.startPassThrough(vehicle, roadId, lane.type, laneIndex);
		break;

		case MovementType["turnLeft"]:
		case MovementType["turnRight"]:
				// here must be used value returned from canTurn()
				// issues can appear due to usage of laneIndex here
				offramp.startTurn(laneIndex, vehicle);
		break;
	}
}

function moveToJunction( movement, junction, roadId, laneIndex, vehicle )
{
	switch (movement)
	{
		case MovementType["pass"]:
			junction.startPassThrough(roadId, laneIndex, vehicle);
			break;

		case MovementType["turnRight"]:
			junction.startTurnRight(roadId, laneIndex, vehicle);
			break;

		case MovementType["turnLeft"]:
			junction.startTurnLeft(roadId, laneIndex, vehicle);
			break;
	}
}

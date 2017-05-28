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

	/// check vehicles after previous update, it is an analysis of last update
	/// and done before actual current update
	///
	// check vehicles on roads whether they have reached specific zones
	// on road. After that check all first vehicles at any map object and
	// decide to start passing through or turn.
	this.updateRoads();

	// vehicle's traffic state can be changed after previous function,
	// so check and update models if required
	this.updateModels();

	// check the first vehicle on each lane or map object for completing move
	// on current object, namely vehicle reached lane's or turn's end
	// and ready to go on at next object on route
	this.checkArrivedVehicles();

	// change lane if it is preferable for vehicle
	this.checkLaneChange( dt );

	// calculate new acceleration for this step and check whether vehicle in
	// upstream/downstream zone. Update models if required.
	this.updateAccelerations();

	// update velocity with respect to acceleration and position on map object
	// with respect to another vehicles
	this.updatePositionsAndVelocities();
}


// check whether vehicles on upstream, downstream or jam
RoadEngine.prototype.updateRoads = function()
{
	this.map.roads.forEach( checkVehiclesOnRoad );
}

function checkVehiclesOnRoad( road )
{
	let lanes = road.forwardLanes;
	for (let i = 0; i < lanes.length; ++i)
	{
		checkVehiclesOnLane( lanes[i], road.length );
	}

	lanes = road.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
	{
		checkVehiclesOnLane( lanes[i], road.length );
	}
}

// check vehicles at safe distance and update model or stop them
function checkVehiclesOnLane( lane, roadLength )
{
	for (let i = 0; i < lane.vehicles.length; ++i)
	{
		vehicle = lane.vehicles[i];

		// to close to road's end, stop it!
		if (vehicle.uCoord >= roadLength)
		{
			vehicle.uCoord = roadLength;
			vehicle.arrived = true;
			vehicle.stop( roadLength );
			continue;
		}

		// let vehicle complete lane change without changing longitudinal
		// and lane change models
		if (vehicle.vehicleState == VehicleState.CHANGE_LANE)
			continue;

		if ( roadLength - vehiclse.uCoord < vehicle.safeDistance )
		{
			vehicle.longModel = UPSTREAM_IDM;
			vehicle.laneChangeModel = UPSTREAM_MOBIL;
			continue;
		}
	}
}

// update longitudinal and lane change models for vehicles on roads
// vehicles on junction/onramp/offramp/turn are not affected
RoadEngine.prototype.updateModels = function()
{
	let roads = this.map.roads;

	for (let i = 0; i < roads.length; ++i)
	{
		let road = roads[i];

		let lanes = road.forwardLanes;
		for (let j = 0; j < lanes.length; ++j)
		{
			lanes[j].vehicles.forEach(this.prototype.setLongitudinalModel);
		}

		let lanes = road.backwardLanes;
		for (let j = 0; j < lanes.length; ++j)
		{
			lanes[j].vehicles.forEach(this.prototype.setLongitudinalModel);
		}
	}
}

RoadEngine.prototype.setLongitudinalModel = function(vehicle)
{
	switch( vehicle.trafficState )
	{
		case TrafficState.FREE_ROAD:
			vehicle.longitudinalModel = freeRoadIDM;
			vehicle.laneChangeModel = freeRoadMOBIL;
			break;

		case  TrafficState.UPSTREAM:
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

RoadEngine.prototype.updateJunctions = function( dt )
{
	let junctions = this.map.junctions;
	for (let i = 0;i < junctions.length; ++i)
	{
		junctions[i].update(dt);
	}
}

RoadEngine.prototype.updateTurns = function( dt )
{
	let turns = this.map.turns;
	for (let i = 0;i < turns.length; ++i)
	{
		turns[i].update( dt );
	}
}

RoadEngine.prototype.updateOnramps = function( dt )
{
	let onramps = this.map.onramps;
	for (let i = 0;i < onramps.length; ++i)
	{
		onramps[i].update( dt );
	}
}

RoadEngine.prototype.updateOfframps = function( dt )
{
	let offramps = this.map.offramps;
	for (let i = 0;i < offramps.length; ++i)
	{
		offramps[i].update( dt );
	}
}

// check vehicles that have moved to the end of current map object, i.e.
// reached finish or start of road/onramp/offramp/turn/junction
RoadEngine.prototype.checkArrivedVehicles = function(  )
{

	let lane;
	let vehicle = lane.vehicles.first();

	if ( vehicle.arrived == false)
		return;

	let nextObject = this.getNextObjectOnRoute( vehicle );
	if ( nextObject == RoadObject.VOID )
	{
		// vehicle finished route and will be destroyed
		lane.vehicles.splice(0, 1);
		return;
	}
}

RoadEngine.prototype.getNextObjectOnRoute = function( vehicle )
{
	let route = this.map.routes[ vehicle.routeId ];

	if ( vehicle.routeItemIndex == route.items.length - 1)
	{
		return RoadObject.VOID;
	}

	++vehicle.routeItemIndex;
	let item = this.map.routes[ vehicle.routeItemIndex ];
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


RoadEngine.prototype.checkLaneChange = function( dt )
{

}

RoadEngine.prototype.updateAccelerations = function()
{

}

RoadEngine.prototype.updatePositionsAndVelocities = function()
{

}

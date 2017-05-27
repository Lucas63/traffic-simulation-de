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
	this.updateLongitudinalModels( dt );
	this.checkLaneChange( dt );

	this.updateVelocities( dt );

}

RoadEngine.prototype.updateLongitudinalModels = function( dt )
{

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
		checkVehiclesOnLane( lanes[i], this.borderDistance, road.length );
	}

	lanes = road.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
	{
		checkVehiclesOnLane( lanes[i], this.borderDistance, road.length );
	}
}

function checkVehiclesOnLane( lane, borderDistance, roadLength )
{
	for (let i = 0; i < lane.vehicles.length; ++i)
	{
		vehicle = lane.vehicles[i];

		// to close to road's end, stop it!
		if (vehicle.uCoord < borderDistance)
		{
			vehicle.arrived = true;
			vehicle.stop( borderDistance );
			continue;
		}

		if ( roadLength - vehiclse.uCoord < vehicle.safeDistance )
		{
			vehicle.longModel = UPSTREAM_IDM;
			vehicle.laneChangeModel = UPSTREAM_MOBIL;
			continue;
		}
	}
}

RoadEngine.prototype.updateJunctions = function( dt )
{
	let junctions = this.map.junctions;
	for (let i = 0;i < junctions.length; ++i)
	{
		junctions[i].updateTrafficLights(dt);
		junctions[i].updateAllVehicles(dt);
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

}

RoadEngine.prototype.updateOfframps = function( dt )
{

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

function checkUpstream( follower, leader )
{

}

function checkDownstream( follower, leader )
{

}

RoadEngine.prototype.checkLaneChange = function( dt )
{

}

RoadEngine.prototype.updateVelocities = function( dt )
{

}
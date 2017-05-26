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

	// check vehicles on roads whether they have reached specific zones
	// on road. After that check all first vehicles at any map object and
	// decide to start passing through or turn.
	this.checkTrafficState();
	this.updateLongitudinalModels( dt );
	this.checkLaneChange( dt );
	this.updateVelocities( dt );

}

RoadEngine.prototype.updateLongitudinalModels = function( dt )
{

}

// check whether vehicles on upstream, downstream or jam
RoadEngine.prototype.checkTrafficState = function()
{
	let map = this.map;

	let road = null;
	let lanes = null;
	let lane = null;
	let vehicle = null;

	for (let i = 0;i < map.roads.length; ++i)
	{
		road = map.roads[i];
		let borderDistance = road.length - MINIMAL_GAP;

		lanes = road.forwardLanes;
		for (let j = 0; j < lanes.length; ++j)
		{
			checkVehiclesOnRoad( lanes[j], borderDistance, road.length );
			checkArrivedVehicles( lanes[j].vehicle.first() );
		}

		lanes = road.backwardLanes;
		for (let j = 0; j < lanes.length; ++j)
		{
			checkVehiclesOnRoad( lanes[j], borderDistance, road.length );
			checkArrivedVehicles( lanes[j] );
		}

	}


}

function checkVehiclesOnRoad( lane, borderDistance, roadLength )
{
	for (let k = 0; k < lane.vehicles.length; ++k)
	{
		vehicle = lane.vehicles[k];

		// to close to road's end, stop it!
		if (vehicle.uCoord < borderDistance)
		{
			vehicle.arrived = true;
			vehicle.stop( borderDistance );
			continue;
		}

		if ( roadLength - vehicle.uCoord < vehicle.safeDistance )
		{
			vehicle.longModel = UPSTREAM_IDM;
			vehicle.laneChangeModel = UPSTREAM_MOBIL;
		}
	}
}

// check vehicles that have moved to the end of current map object, i.e.
// reached finish or start of road/onramp/offramp/turn/junction
function checkArrivedVehicles( lane )
{
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

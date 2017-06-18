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
				lanes[i].pushVehicle(vehicle);
			}
		}
	}
}

function checkVehiclesPositionOnRoad( road )
{
	let lanes = road.forwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkVehiclesOnLane( lanes[i], road );

	lanes = road.backwardLanes;
	for (let i = 0; i < lanes.length; ++i)
		checkVehiclesOnLane( lanes[i], road );
}

// check vehicles at safe distance and update model or stop them
function checkVehiclesOnLane( lane, road )
{
	for (let i = 0; i < lane.vehicles.length; ++i)
	{
		vehicle = lane.vehicles[i];

		// vehicle can move after road's border
		if (vehicle.uCoord >= road.length)
		{
			vehicle.uCoord = road.length;
			vehicle.arrived = true;
			continue;
		}

		// let vehicle complete lane change without changing longitudinal
		// and lane change models
		if (vehicle.vehicleState == VehicleState.CHANGE_LANE)
			continue;

		if ( road.length - vehicle.uCoord < vehicle.safeDistance )
		{
			vehicle.trafficState = TrafficState.UPSTREAM;
			// add here LC model update if required
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
	// the very first vehicle has virtual leader
	let vehicle = vehicles[0];
	checkTrafficStateForAdjacentVehicles(vehicle, vehicle.leader);

	for (let i = 1; i < vehicles.length; ++i)
	{
		vehicle = vehicles[i];
		checkTrafficStateForAdjacentVehicles(vehicle, vehicles[i - 1]);
	}
}

function checkTrafficStateForAdjacentVehicles(follower, leader)
{
	if (onUpstream(vehicle, vehicle.leader))
		vehicle.trafficState = TrafficState.UPSTREAM;

	if (onDownstream(vehicle, vehicle.leader))
		vehicle.trafficState = TrafficState.DOWNSTREAM;

	if (onJam(vehicle))
		vehicle.trafficState = TrafficState.JAM;
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
				vehicle.longModel = vehicle.freeRoadLongModel;
				break;

			case TrafficState.UPSTREAM:
				vehicle.longModel = vehicle.upstreamLongModel;
				break;

			case  TrafficState.DOWNSTREAM:
				vehicle.longModel = vehicle.downstreamLongModel;
				break;

			case  TrafficState.JAM:
				vehicle.longModel = vehicle.jamLongModel;
				break;
		}
	}
}

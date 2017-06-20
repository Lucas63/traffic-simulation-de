function checkLaneChangeOnLanes( lanes )
{
	// check the very first lane
	checkLaneChangeForNeighbourLanes(null, lanes[0], lanes[1]);

	for (let i = 1; i < lanes.length - 1; ++i)
		checkLaneChangeForNeighbourLanes(lanes[i - 1], lanes[i], lanes[i + 1]);

	// check the last lane
	checkLaneChangeForNeighbourLanes(lanes[lanes.length - 2],
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

	/* TODO : commented + new code start
	let vehicles = current.vehicles;
	let vehicle = null;
	*/
	if(current == null)
		return;

	let vehicles = current.vehicles;
	/*
	TODO : new code finish
	 */

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
				doLaneChange( current, left, vehicle, true );
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
	let gapBeforeLeader = currentVehicle.getSafeSpace();
    if (adjacentLeader != null)
		gapBeforeLeader = adjacentLeader.getSafeDistance() - currentVehicle.uCoord;

	// there is not enough space before neighbour leader to change lane
	if (gapBeforeLeader < 0)
		return false;

	// actual gap between current vehicle and prospective follower
	let gapAfterFollower = currentVehicle.uCoord - currentVehicle.getSafeSpace();
    if (adjacentFollower != null)
    {
		gapAfterFollower =
            currentVehicle.getSafeDistance() - adjacentFollower.uCoord;
    }

	// there is not enough space after neighbour follower to change lane
	if (gapAfterFollower <= 0)
		return false;

	// acceleration of current vehicle after prospective lane change

	let currentAccAfterChange = currentVehicle.acceleration;
    if (adjacentLeader)
    {
        currentAccAfterChange = currentVehicle.longModel.
            calculateAcceleration( gapBeforeLeader, currentVehicle.speed,
                                   adjacentLeader.speed);
    }

	result.currentAcceleration = currentAccAfterChange;

	// acceleration of follower after prospective lane change
	let followerAccAfterChange = 0;
    if (adjacentFollower)
    {
        adjacentFollower.longModel.
    		calculateAcceleration(gapAfterFollower, adjacentFollower.speed,
    							  currentVehicle.speed);
    }

	result.followerAccAfterChange = followerAccAfterChange;

	let velocitiesRatio =
		currentVehicle.speed / currentVehicle.longModel.desiredSpeed;

	// decide whether it be better to change lane or not
    console.log(currentVehicle);
	return currentVehicle.laneChangeModel.
		analyzeLaneChange(velocitiesRatio, currentVehicle.acceleration,
						  currentAccAfterChange, followerAccAfterChange);
}

function doLaneChange( currentLane, newLane, vehicle, atLeft )
{
	let adjacentFollower = null;

	// think about situation for the very first vehicle!
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

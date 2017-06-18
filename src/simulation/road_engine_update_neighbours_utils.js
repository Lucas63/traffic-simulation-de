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

// current - lane which vehicles updated for
// adjacent - adjacent lane for current one
// atLeft - adjacent lane at left or right
// \note *current* and *adjacent* can be not Lane object, but lanes from
// junctions where lane is just an object holding *vehicles* array
function updateNeighbours(current, adjacent, atLeft)
{
	let currentVehicles = current.vehicles;
	let adjacentVehicles = adjacent.vehicles;

	let currentCoord = 0;

	// place on lane that vehicle takes plus
	// required minimal gap between vehicles
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
		currentSpace = currentVehicles[i].getSafeDistance();

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
			adjacentSpace = adjacentVehicles[j].getSafeDistance();

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

				// break from inner *for* loop
				break;
			}

			leader = adjacentVehicles[j];
			follower = null;

			// if j is not last valid index
			if (j + 1 != adjacentVehicles.length)
				follower = adjacentVehicles[j + 1];

			break;
		}
	}
}

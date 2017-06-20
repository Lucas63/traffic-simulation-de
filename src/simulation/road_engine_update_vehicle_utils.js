function updateVehiclesOnLane( lane, mapObject, dt )
{
	let vehicles = lane.vehicles;
	if(vehicles.empty())
		return;

	let vehicle = vehicles[0];

	// console.log(">>>>>> leading vehicle before update");
	// console.log(">>>>>> u coord " + vehicle.uCoord);
	// console.log(">>>>>> speed " + vehicle.speed);
	// console.log(">>>>>> acceleration " + vehicle.acceleration);

	vehicle.acceleration =
		updateAccelerationForVehicle(vehicle, vehicle.leader);

	updateSpeedAndPosition(vehicle, lane, mapObject, dt);

	// console.log(">>>>>> leading vehicle after update");
	// console.log(">>>>>> u coord " + vehicle.uCoord);
	// console.log(">>>>>> speed " + vehicle.speed);
	// console.log(">>>>>> acceleration " + vehicle.acceleration);

	for (let i = 1; i < vehicles.length; ++i)
	{
		vehicle = vehicles[i];

		// console.log(">>>>>> vehicle before update");
		// console.log(">>>>>> u coord " + vehicle.uCoord);
		// console.log(">>>>>> speed " + vehicle.speed);
		// console.log(">>>>>> acceleration " + vehicle.acceleration);

		vehicle.acceleration =
			updateAccelerationForVehicle(vehicle, vehicles[i - 1]);

		updateSpeedAndPosition(vehicle, lane, mapObject, dt);

		// console.log(">>>>>> vehicle after update");
		// console.log(">>>>>> u coord " + vehicle.uCoord);
		// console.log(">>>>>> speed " + vehicle.speed);
		// console.log(">>>>>> acceleration " + vehicle.acceleration);
	}
}

function updateAccelerationForVehicle( currentVehicle, leaderVehicle )
{
	let gap = leaderVehicle.uCoord - leaderVehicle.length -
			  currentVehicle.uCoord;

	let currentSpeed = currentVehicle.speed;
	let leaderSpeed = leaderVehicle.speed;

	return currentVehicle.longModel.
		calculateAcceleration(gap, currentSpeed, leaderSpeed);
}

function updateSpeedAndPosition( vehicle, lane, mapObject, dt )
{
	switch (vehicle.vehicleState)
	{
		case VehicleState.MOVING:
			updateStraightMove( vehicle, mapObject, dt );
			break;

		case VehicleState.TURNING:
			updateTurn( vehicle, lane, mapObject, dt );
			break;

		case VehicleState.CHANGE_LANE:
			this.updateLaneChange( vehicle, dt );
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
	if (vehicle.arrived)
		return;

	// update velocity
	let newPosition = vehicle.speed * dt + 0.5 * vehicle.acceleration * dt * dt;
	vehicle.uCoord += Math.max(0, newPosition);

	let safeDistance = mapObject.length;
	if (vehicle.uCoord >= safeDistance)
	{
		vehicle.uCoord = safeDistance;
		vehicle.arrived = true;
	}

	vehicle.speed += vehicle.acceleration * dt;
	vehicle.speed = Math.max( 0, vehicle.speed);
}


function updateTurn( vehicle, lane, mapObject, dt )
{
	// no need to compute position
	if (vehicle.arrived)
		return;

	let vehicleIndex = lane.vehicles.indexOf(vehicle);
	let leader = null;

	if (vehicleIndex == 0)
		leader = vehicle.leader;
	else
		leader = lane.vehicles[vehicleIndex - 1];

	let newPosition = mapObject.calculateTurnDistance( vehicle );

	vehicle.turnElapsedTime += dt;
	vehicle.turnCompletion =
		Math.min(vehicle.turnElapsedTime / vehicle.turnFullTime, 1);

	// vehicle cannot move further due to leading vehicle
	// rollback elapsed time and re-calculate turn completion
	// it's done to prevent situation when vehicle doesn't consider position
	// of vehicle in front
	if (vehicleCanMoveOnTurn(newPosition, leader) == false)
	{
		vehicle.turnElapsedTime -= dt;
		vehicle.turnCompletion = vehicle.turnElapsedTime / vehicle.turnFullTime;

		return;
	}

	// turn has been completed
	if (vehicle.turnCompletion == 1)
		vehicle.arrived = true;

	vehicle.uCoord = newPosition;
}

function vehicleCanMoveOnTurn(newPosition, leader)
{
	return leader.getSafeDistance() >= newPosition;
}

function updateLaneChange( vehicle, dt )
{
	// TODO <Artem> implement me!
}

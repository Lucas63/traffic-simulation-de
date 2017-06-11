function updateVehiclesOnLane( lane, mapObject, dt )
{
	let vehicles = lane.vehicles;
	let vehicle = vehicles[0];

	vehicle.acceleration =
		updateAccelerationForVehicle(vehicle, vehicle.leader);

	updateSpeedAndPosition(vehicle, mapObject, dt);

	for (let i = 1; i < vehicles.length; ++i)
	{
		vehicle = vehicles[i];
		vehicle.acceleration =
			updateAccelerationForVehicle(vehicle, vehicles[i - 1]);

		updateSpeedAndPosition(vehicle, mapObject, dt);
	}
}

function updateAccelerationForVehicle( currentVehicle, leaderVehicle )
{
	let gap = 0;
	let leaderSpeed = 0;

	let gap = leaderVehicle.uCoord - leaderVehicle.length -
			  currentVehicle.uCoord;

	let currentSpeed = currentVehicle.speed;
	let leaderSpeed = leaderVehicle.speed;

	return currentVehicle.longModel.
		calculateAcceleration(gap, currentSpeed, leaderSpeed);
}

function updateSpeedAndPosition( vehicle, mapObject, dt )
{
	switch (vehicle.vehicleState)
	{
		case VehicleState.MOVING:
			updateStraightMove( vehicle, mapObject, dt );
			break;

		case VehicleState.TURNING:
			updateTurn( vehicle, mapObject, dt );
			break;

		case VehicleState.CHANGE_LANE:
			this.updateLaneChange( dt );
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
	// update velocity
	let newPosition = vehicle.speed * dt + 0.5 * vehicle.acceleration * dt * dt;
	vehicle.uCoord += Math.Max(0, newPosition);

	let safeDistance = mapObject.length - MINIMAL_GAP;
	if (vehicle.uCoord >= safeDistance)
	{
		vehicle.stop(safeDistance);
		vehicle.arrived = true;

		return;
	}

	vehicle.speed += vehicle.acceleration * dt;
	vehicle.speed = Math.max( 0, vehicle.speed);
}


function updateTurn( vehicle, mapObject, dt )
{
	// no need to compute position
	if (vehicle.arrived)
		return;

	this.turnElapsedTime += dt;
	this.turnCompletion = Math.max(this.turnElapsedTime / this.turnFullTime, 1);

	let newPosition = mapObject.calculateTurnDistance( vehicle );

	// it possible that vehicle waits on turn to move on destination road
	// if destination road is congested and no space for new vehicle
	if (turnCompletion == 1)
	{
		// turn has been completed
		vehicle.stop( newPosition );
		this.arrived = true;
	}

	this.uCoord = newPosition;
}

function updateLaneChange( vehicle, dt )
{
	// TODO <Artem> implement me!
}

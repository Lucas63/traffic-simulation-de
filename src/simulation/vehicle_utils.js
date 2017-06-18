function addVehiclesArray(lanes) {
	for (let i = 0; i < lanes.length; ++i) {
		console.log(lanes[i]);
		lanes[i].vehicles = new Array();

	}
}

function addVirtualVehicle(lanes, length) {
	// multiplier 1.5 was selected just to make free movement coordindate
	// not so big, but it's a random choise
	for (let i = 0; i < lanes.length; ++i) {
		// used models for car, but must be created virtual vehicle
		// for each type of real vehicle: car, truck, etc.
		lanes[i].virtualVehicle =
			new VirtualVehicle(length, 1.5 * length,
				carUpstreamIDM.desiredSpeed,
				carFreeRoadIDM.desiredSpeed);
	}
}

function setupPassLanes(lanes, laneLength) {
	addVehiclesArray(lanes);
	addVirtualVehicle(lanes, length);
}

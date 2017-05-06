
var LaneDirection =
{
	FORWARD : { value: 0, name: "forward" },
	BACKWARD : { value: 1, name: "backward" }
}


function Lane( _length, _spawnPoint )
{
	this.length = _length;

	this.onramps = [];
	this.offramps = [];

	// each lane can have only one spawn point!
	this.spawnPoint = _spawnPoint;
}

// true if lane has no vehicles
Lane.prototype.isEmpty = function()
{
	return this.vehicles.length == 0;
}

Lane.prototype.addVehicle = function( vehicle, index )
{
	this.vehicles.splice( index, 0, vehicle );
}

Lane.prototype.removeVehicle = function( index )
{
	this.vehicles.splice( index, 1 );
}

// check if lane has enough space to place new vehicle
// requiredSpace is the least distance between the last vehicle on the lane
// and the beginning of the lane
Lane.prototype.hasEnoughSpace = function( requiredSpace )
{
	if (requiredSpace > this.length)
	{
		// the lane too small
		return false;
	}

	if (this.isEmpty())
	{
		return true;
	}

	let no_vehicles = this.vehicles.length;
	let lastVehicle = this.vehicles[no_vehicles - 1];

	// u_coord is a coordinate of vehicle's bumper
	return (lastVehicle.u_coord - lastVehicle.length) >= requiredSpace;
}

Lane.prototype.updateNeighbours = function()
{
	console.log("Lane.updateNeighbours()");
}

Lane.prototype.updateNeighboursForAdjacentLane = function( anotherLane )
{
	console.log("Lane.updateNeighboursForAdjacentLane()");
}

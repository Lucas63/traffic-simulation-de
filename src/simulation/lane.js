const LANE_WIDTH = 5;

var LaneType =
{
	"forward": 0,
	"backward": 1
}

function Lane( _length, _type, _startCenterX, _startCenterY,
			   _finishCenterX, _finishCenterY, _spawnPoint )
{
	this.length = _length;
	this.type = _type;

	this.startX = _startCenterX;
	this.startY = _startCenterY;

	this.finishX = _finishCenterX;
	this.finishY = _finishCenterY;

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

Lane.prototype.addVehicleAsLast = function( vehicle )
{
	this.vehicles.push( vehicle );
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

	let lastVehicle = this.vehicles.slice(-1)[0];

	// u_coord is a coordinate of vehicle's bumper
	// check whether there is enough space between vehicle and road's finish
	return (lastVehicle.u_coord - lastVehicle.length) >= requiredSpace;
}

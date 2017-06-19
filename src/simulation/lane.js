const LANE_WIDTH = 5;

var LaneType =
{
	"forward": 0,
	"backward": 1
};

function LaneBases(_move_dx, _move_dy, _leftLC_dx, _leftLC_dy,
                   _rightLC_dx, _rightLC_dy)
{
    this.move_dx = _move_dx;
    this.move_dy = _move_dy;

    this.leftLC_dx = _leftLC_dx;
    this.leftLC_dy = _leftLC_dy;

    this.rightLC_dx = _rightLC_dx;
    this.rightLC_dy = _rightLC_dy;
}

function Lane( _length, _type, _spawnPoint, startX, startY, finishX, finishY )
{
	this.length = _length;
	this.type = _type;

	this.virtualVehicle = null;

	// each lane can have only one spawn point!
	this.spawnPoint = _spawnPoint;

	this.startX = startX;
	this.startY = startY;

	this.finishX = finishX;
	this.finishY = finishY;

    // TODO actual *LaneBases* object must be passed
    this.bases = new LaneBases(0,0,0,0,0,0);
}

// true if lane has no vehicles
Lane.prototype.isEmpty = function()
{
	return this.vehicles.length == 0;
};

Lane.prototype.pushVehicle = function( vehicle )
{
	this.vehicles.push( vehicle );

	// set virtaul vehicle as leader
	if (this.vehicles.length == 1)
		vehicle.leader = this.virtualVehicle;
};

function removeVehicle( lane, index )
{
	lane.vehicles.splice( index, 1 );

	// update new leading vehicle on lane
	if (index == 0 && lane.vehicles.empty() == false)
		lane.vehicles[0].leader = lane.virtualVehicle;
};

// check if lane has enough space to place new vehicle
// requiredSpace is the least distance between the last vehicle on the lane
// and the beginning of the lane
Lane.prototype.hasEnoughSpace = function( requiredSpace )
{
	// the lane too small
	if (requiredSpace > this.length)
		return false;

	if (this.isEmpty())
		return true;

	let lastVehicle = this.vehicles.slice(-1)[0];

	// check whether there is enough space between vehicle and road's finish
	return lastVehicle.farFrom(requiredSpace);
};

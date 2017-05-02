
var LANE_DIRECTION =
{
    forward : { value: 0, name: "forward" },
    backward : { value: 1, name: "backward" }
}


function Lane( _vehicles, _direction )
{
    this.vehicles = _vehicles;
    this.direction = _direction;
}

Lane.prototype.addVehicle = function( vehicle )
{
    this.vehicle.push( vehicle );
}

Lane.prototype.sortVehicles()
{
    console.log("sortVehicles()")
}

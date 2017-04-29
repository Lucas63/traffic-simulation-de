
var LANE_DIRECTION =
{
    forward : { value: 0, name: "forward" },
    backward : { value: 1, name: "backward" }
}


function Lane( _cars, _direction )
{
    this.cars = cars;
    this.direction = _direction;
}

Lane.prototype.addCar = function( car )
{
    this.cars.push( car );
}

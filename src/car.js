var VehicleTypeEnum =
{
    CAR : 0,
    TRUCK : 1
}

// Used length units independent from actual visualization scale
const CAR_LENGTH = 4;
const CAR_WIDTH = 2;

const TRUCK_LENGTH = 12;
const TRUCK_WIDTH = 5;

const CAR_DESIRED_SPEED = 80;
const TRUCK_DESIRED_SPEED = 50;

const CAR_INITIAL_SPEED = 25;
const TRUCK_INITIAL_SPEED = 15;

function Car( _type, _position )
{
    this.type = _type;

    this.currentSpeed = 0;
    this.currentPosition = _position;

    if ( _type == VehicleTypeEnum.CAR )
    {
        this.length = CAR_LENGTH;
        this.desiredSpeed = CAR_DESIRED_SPEED;
    }
    else
    {
        this.length = TRUCK_LENGTH;
        this.desiredSpeed = TRUCK_DESIRED_SPEED;
    }
}

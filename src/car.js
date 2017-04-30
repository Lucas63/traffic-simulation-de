var VehicleTypeEnum =
{
    CAR : 0,
    TRUCK : 1
}

// Used length units independent from actual visualization scale
const CAR_LENGTH = 3;
const TRUCK_LENGTH = 7;

const CAR_DESIRED_SPEED = 80;
const TRUCK_DESIRED_SPEED = 50;

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

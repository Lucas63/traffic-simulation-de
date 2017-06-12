function VirtualVehicle( _defaultCoord, _freeMovementCoord,
                         _defaultSpeed, _freeMovementSpeed )
{
    this.defaultCoord = _defaultCoord;
    this.freeMovementCoord = _freeMovementCoord;

    this.defaultSpeed = _defaultSpeed;
    this.freeMovementSpeed = _freeMovementSpeed;

    this.actualCoord = _defaultCoord;
    this.actualSpeed = _defaultSpeed;
}

VirtualVehicle.prototype.setDefaultValues()
{
    this.actualCoord = this.defaultCoord;
};

VirtualVehicle.prototype.setFreeMovementValues()
{
    this.actualCoord = this.freeMovementCoord;
}

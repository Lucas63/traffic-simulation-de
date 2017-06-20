function VirtualVehicle( _defaultCoord, _freeMovementCoord,
						 _defaultSpeed, _freeMovementSpeed )
{
	this.defaultCoord = _defaultCoord;
	this.freeMovementCoord = _freeMovementCoord;

	this.defaultSpeed = _defaultSpeed;
	this.freeMovementSpeed = _freeMovementSpeed;

	this.uCoord = _defaultCoord;
	this.speed = _defaultSpeed;

	this.length = 0;
}

VirtualVehicle.prototype.setDefaultValues = function()
{
	this.uCoord = this.defaultCoord;
	this.speed = this.defaultSpeed;
};

VirtualVehicle.prototype.setFreeMovementValues = function()
{
	this.uCoord = this.freeMovementCoord;
	this.speed = this.freeMovementSpeed;
};

VirtualVehicle.prototype.getSafeDistance = function()
{
	return this.uCoord - MINIMAL_GAP;
}

function SpawnPoint(_id, _minPeriod, _maxPeriod, _truckFraction,
					_routeId, _laneId, _lane_type, _startX, _startY)
{
	this.id = _id;
	this.minPeriod = _minPeriod;
	this.maxPeriod = _maxPeriod;

	this.truckFraction = _truckFraction;
	this.routeId = _routeId;
	this.laneId = _laneId;
	this.lane_type = _lane_type;

	this.difference = _maxPeriod - _minPeriod;
	this.elapsedTime = 0;

	this.startX = _startX;
	this.startY = _startY;

}

SpawnPoint.prototype.update = function( dt )
{
	// console.log("elapsed time in update " + this.elapsedTime);
	this.elapsedTime += dt;
};

// is this spawn point ready to create vehicle
SpawnPoint.prototype.ready = function()
{
	if (this.elapsedTime < this.minPeriod)
		return false;

	if (this.elapsedTime >= this.maxPeriod)
		return true;

	let probability = (this.elapsedTime - this.minPeriod) / this.difference;
	let random =  Math.random();

	return probability >= random;
};

SpawnPoint.prototype.spawn = function()
{
	let truckCreationProbability = Math.random();

	// create empty config
	let vehicleConfig = new VehicleConfig( VehicleType.CAR, this.routeId,
										   0, CAR_INITIAL_SPEED,
										   this.startX,this.startY);

	if (truckCreationProbability <= this.truckFraction )
	{
		vehicleConfig.type = VehicleType.TRUCK;
		vehicleConfig.speed = TRUCK_INITIAL_SPEED;
	}

	this.elapsedTime = 0;
	return new Vehicle( vehicleConfig );
};

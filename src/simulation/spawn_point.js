function SpawnPoint( _minPeriod, _maxPeriod, _truckFraction, _routeId )
{
	this.minPeriod = _minPeriod;
	this.maxPeriod = _maxPeriod;
	this.truckFraction = _truckFraction;
	this.routeId = _routeId;

	this.difference = _maxPeriod - _minPeriod;
	this.elapsedTime = 0;
}

SpawnPoint.prototype.update = function( dt )
{
	this.elapsedTime += dt;
};

// is this spawn point ready to create vehicle
SpawnPoint.prototype.ready = function()
{
	if (this.elapsedTime < this.minPeriod)
	{
		return false;
	}

	if (this.elapsedTime >= this.maxPeriod)
	{
		return true;
	}

	let probability = (this.elapsedTime - this.minPeriod) / this.difference;
	let random =  Math.random();

	if (probability < random)
	{
		return false;
	}

	return true;
};

SpawnPoint.prototype.spawn = function()
{
	let truckCreationProbability = Math.random();

	// create empty config
	var vehicleConfig = new VehicleConfig( VehicleType.CAR, this.routeId,
										   0, CAR_INITIAL_SPEED );

	if (truckCreationProbability <= this.truckFraction )
	{
		vehicleConfig.type = VehicleType.TRUCK;
		vehicleConfig.speed = TRUCK_INITIAL_SPEED;
	}

	return new Vehicle( vehicleConfig );
};

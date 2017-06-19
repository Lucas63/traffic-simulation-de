function SpawnPoint(_id, _minPeriod, _maxPeriod, _truckFraction, _routeId )
{
	this.id = _id;
	this.minPeriod = _minPeriod;
	this.maxPeriod = _maxPeriod;

	this.truckFraction = _truckFraction;
	this.routeId = _routeId;

	this.difference = _maxPeriod - _minPeriod;
	this.elapsedTime = 0;
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
    {
        // console.log("this.elapsedTime < this.minPeriod " + this.elapsedTime + " " + this.minPeriod);
		return false;
    }

	if (this.elapsedTime >= this.maxPeriod)
    {
        // console.log("this.elapsedTime >= this.minPeriod " + this.elapsedTime + " " + this.minPeriod);
		return true;
    }

	let probability = (this.elapsedTime - this.minPeriod) / this.difference;
	let random =  Math.random();

	if (probability < random)
		return false;

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

    this.elapsedTime = 0;
    console.log("elapsed time after spawn " + this.elapsedTime);
	return new Vehicle( vehicleConfig );
};

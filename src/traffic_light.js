var TrafficLights =
{
	GREEN : 0,
	YELLOW : 1,
	RED : 2
}

// time in seconds
const DEFAULT_RED_COLOR_DURATION = 20;
const DEFAULT_YELLOW_COLOR_DURAION = 3;
const DEFAULT_GREEN_COLOR_DURATION = 15;

function TrafficLight( _id, _x_coord, _y_coord, _connectedRoads, _initialLight )
{
	this.id = _id;
	this.x_coord = _x_coord;
	this.y_coord = _y_coord;

	this.connectedRoads = _connectedRoads;
	this.light = _initialLight;
	this.elapsedTime = 0;

	this.greenLightPeriod = DEFAULT_GREEN_COLOR_DURATION;
	this.yellowLightPeriod = DEFAULT_YELLOW_COLOR_DURAION;
	this.redLightPeriod = DEFAULT_RED_COLOR_DURATION;

	this.allPeriodsTime = this.greenLightPeriod +
						  this.yellowLightPeriod +
						  this.redLightPeriod;
}

TrafficLight.prototype.update( dt )
{
	elapsed = this.elapsedTime + dt;

	// wrap up time from the last update
	elapsed = elapsed % this.allPeriodsTime;

	switch (this.light)
	{
	case TrafficLights.GREEN:
		if (elapsed > this.greenLightPeriod)
		{
			this.light = TrafficLights.YELLOW;
			this.elapsedTime = elapsed - this.greenLightPeriod;
		}
		break;

	case TrafficLights.YELLOW:
		if (elapsed > this.yellowLightPeriod)
		{
			this.light = TrafficLights.RED;
			this.elapsedTime = elapsed - this.yellowLightPeriod;
		}
		break;

	case TrafficLights.RED:
		if (elapsed > this.redLightPeriod)
		{
			this.light = TrafficLights.GREEN;
			this.elapsedTime = elapsed - this.redLightPeriod;
		}
		break;

	default:
		console.log("Unknown traffic light color!!!");
	}
}

TrafficLight.prototype.getLight = function()
{
	return this.light;
}

var TrafficLightColor =
{
	GREEN : 0,
	YELLOW : 1,
	RED : 2
}

const TrafficLightState =
{
	GREEN: 0,
	YELLOW_AFTER_GREEN: 1,
	RED: 2,
	YELLOW_AFTER_RED: 3
}

// time in seconds
const DEFAULT_RED_COLOR_DURATION = 12;
const DEFAULT_YELLOW_COLOR_DURAION = 3;
const DEFAULT_GREEN_COLOR_DURATION = 15;

function TrafficLight( _x_coord, _y_coord, _initialColor )
{
	this.x_coord = _x_coord;
	this.y_coord = _y_coord;

	this.color = _initialColor;

	if (this.color == TrafficLightColor.GREEN)
		this.state = TrafficLightState.GREEN;
	else
		this.state = TrafficLightState.RED;


	this.elapsedTime = 0;

	this.greenLightPeriod = DEFAULT_GREEN_COLOR_DURATION;
	this.yellowLightPeriod = DEFAULT_YELLOW_COLOR_DURAION;
	this.redLightPeriod = DEFAULT_RED_COLOR_DURATION;

	this.allPeriodsTime = this.greenLightPeriod +
						  this.yellowLightPeriod +
						  this.redLightPeriod +
						  this.yellowLightPeriod;
}

TrafficLight.prototype.update =function( dt )
{
	this.elapsedTime += dt;


	// wrap up time from the last update
	this.elapsed %= this.allPeriodsTime;

	switch (this.state)
	{
		case TrafficLightState.GREEN:
			if (this.elapsedTime > this.greenLightPeriod)
			{
				this.color = TrafficLightColor.YELLOW;
				// this.elapsedTime = elapsed - this.greenLightPeriod;
				this.elapsedTime = 0;
				this.state = TrafficLightState.YELLOW_AFTER_GREEN;
			}
			break;

		case TrafficLightState.YELLOW_AFTER_GREEN:
			if (this.elapsedTime > this.yellowLightPeriod)
			{
				this.color = TrafficLightColor.RED;
				//this.elapsedTime = elapsed - this.yellowLightPeriod;
                this.elapsedTime = 0;
				this.state = TrafficLightState.RED;
			}
			break;

		case TrafficLightState.RED:
			if (this.elapsedTime > this.redLightPeriod)
			{
				this.color = TrafficLightColor.YELLOW;
				//this.elapsedTime = elapsed - this.redLightPeriod;
                this.elapsedTime = 0;
				this.state = TrafficLightState.YELLOW_AFTER_RED;
			}
			break;

		case TrafficLightState.YELLOW_AFTER_RED:
			if (this.elapsedTime > this.yellowLightPeriod)
			{
				this.color = TrafficLightColor.GREEN;
				//this.elapsedTime = elapsed - this.yellowLightPeriod;
                this.elapsedTime = 0;
				this.state = TrafficLightState.GREEN;
			}
			break;

		default:
			printError(arguments.callee.name, "Unknown traffic light state!!!");
	}
};

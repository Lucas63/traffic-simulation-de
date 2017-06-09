IDM_MAX_DECELERATION = -16;


// if calculated acceleration < -upstreamDelta (actually it is deceleration),
// then vehicle is located within upstream
const upstreamDelta = 4;

// if calculated acceleration > downstreamDelta,
// then vehicle is located within upstream
const downstreamDelta = 3;

const congestedTrafficSpeed = 3;

var freeRoadIDM = null;
var freeRoadMOBIL = null;

var upstreamIDM = null;
var upstreamMOBIL = null;

var downstreamIDM = null;
var downstreamMOBIL = null;

var jamIDM = null;
var jamMOBIL = null;

var carIDMConfig = null;
var truckIDMConfig = null;

function VehicleConfig( _desiredSpeed, _timeHeadway, _minimumGap,
						_acceleration, _deceleration)
{
	this.desiredSpeed = _desiredSpeed; // v0

	this.timeHeadway = _timeHeadway; // T
	this.minimumGap = _minimumGap; // s0

	this.acceleration = _acceleration; // a
	this.deceleration = _deceleration; // b
}

function IDM( lambda_T, lambda_a, lambda_b, vehicleConfig )
{
	this.desiredSpeed = vehicleConfig.desiredSpeed;
	this.timeHeadway = lambda_T * vehicleConfig.timeHeadway;
	this.minimumGap = vehicleConfig.minimumGap;

	this.acceleration = lambda_a * vehicleConfig.acceleration;
	this.deceleration = lambda_b * vehicleConfig.deceleration;

	this.maximumDeceleration = IDM_MAX_DECELERATION;

	// calculate once to avoid reduntant multiplications
	this.square_root_of_ab = Math.sqrt( this.acceleration * this.deceleration );
}

function createIDMModels( vehicleConfig, freeRoadConfig, upstreamConfig,
						  downstreamConfig, jamConfig)
{
	freeRoadIDM = new IDM( vehicleConfig, freeRoadConfig );
	upstreamIDM = new IDM( vehicleConfig, upstreamConfig );
	downstreamIDM = new IDM( vehicleConfig, downstreamConfig );
	jamIDM = new IDM( vehicleConfig, jamConfig );
}

// gap (s in formula) - actual gap between vehicles
// speed - velocity of current vehicle
// leadSpeed - velocity of the vehicle in front of current one
// leadAcceleration - acceleration of the leading vehicle


// This function calculates acceleration for current vehicle according to
// speed and acceleration of leading one.
// \param gap - bumper-to-bumper distance between vehicles
// \param currentSpeed - speed of current vehicle
// \param leaderSpeed - leading vehicle speed
IDM.prototype.calculateAcceleration( gap, currentSpeed, leaderSpeed )
{
	let speed = currentSpeed;

	// determine valid local desired speed
	let desiredSpeed = this.desiredSpeed

	// actual acceleration model
	// 4 is an acceleration exponent
	let freeRoadAcceleration = (speed < desiredSpeed) ?
	this.acceleration * ( 1 - Math.pow( speed/desiredSpeed, 4 ) ) :
	this.acceleration * ( 1 - speed/desiredSpeed );

	let delta_v = speed - leaderSpeed;

	// calculate desired dynamical distance s*
	let dynamicDistance = speed * this.timeHeadway;
	dynamicDistance += (0.5 * delta_v) / this.square_root_of_ab;

	dynamicDistance = Math.max( 0, dynamicDistance );
	dynamicDistance += this.minimumGap;

	let actualGap = Math.max( gap, this.minimumGap );
	let deceleration =
		this.acceleration *
		Math.pow( dynamicDistance / actualGap, 2);

	// prevent deceleration lower than maximum
	return Math.max(this.maximumDeceleration,
					freeRoadAcceleration - deceleration);
}

// compare current (that vehicle has now) and
// calculated (for next step of simulation) accelerations
// true if vehicle on upstream zone, otherwise false
function onUpstream(current, calculated)
{
	return calculated - current < -upstreamDelta;
}

// true if vehicle on downstream zone, otherwise false
function onDownstream(current, calculated)
{
	return calculated - current > downstreamDelta;
}

function onJam(vehicle)
{
	return vehicle.speed < congestedTrafficSpeed;
}


function ACC( modelConfig )
{
	this.desiredSpeed = modelConfig.desiredSpeed;
	this.timeHeadway = modelConfig.timeHeadway;
	this.minimumGap = modelConfig.minimumGap;
	this.comfortAcceleration = modelConfig.comfortAcceleration;
	this.comfortDeceleration = modelConfig.comfortDeceleration;

	this.cool = 0.99;

	this.speedLimit = 1000; // if effective speed limits, speedlimit < v0

	// if vehicle restricts speed, speedmax < speedlimit, v0
	this.speedMax = 1000;
	this.bMax = 18; // Maximum possible deceleration
}


IDM.prototype.isUpstream = function( vehicle )
{
	console.log("isUpstream()");
}

IDM.prototype.isJam = function( vehicle )
{
	console.log("isJam()");
}

IDM.prototype.isUpstream = function( vehicle )
{
	console.log("isDownstream()");
}


/**
 * ACC acceleration function
 *
 * \param s:  actual gap [m]
 * \param v:  actual speed [m/s]
 * \param vl: leading speed [m/s]
 * \param al: leading acceleration [m/s^2] (optional; al=0 if 3 args)
 *
 * \return:  acceleration [m/s^2]
*/
ACC.prototype.calculateAcceleration = function( gap, speed,
												leadSpeed, leadAcceleration )
{
	if ( gap < 0.0001 )
	{
		return -this.bMax;
	}

	// determine valid local v0
	let valid_v0 = Math.min(this.desiredSpeed, this.speedlimit, this.speedMax);

	if (valid_v0 < 0.001)
	{
		return 0;
	}

	// actual acceleration model
	// 4 is an acceleration exponent
	   let freeRoadAcceleration = (speed < valid_v0) ?
	this.a * ( 1 - Math.pow( speed/valid_v0, 4 ) ) :
	this.a * ( 1 - speed/valid_v0 );

	let delta_v = speed - leadSpeed;

	// calculate desired dynamical distance s*
	let dynamicDistance = speed * this.timeHeadway;
	dynamicDistance += (0.5 * delta_v) / this.sqrt_of_AB;

	dynamicDistance = Math.max( 0, dynamicDistance );
	dynamicDistance += this.minimumGap;

	let actualGap = Math.max( gap, this.minimumGap );
	let deceleration =
		this.comfortAcceleration *
		Math.pow( dynamicDistance / actualGap, 2)

	// return original IDM
	return Math.max(-this.bMax, freeRoadAcceleration - deceleration);
}

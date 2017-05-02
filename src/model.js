
function ModelConfig( _desiredSpeed, _timeHeadway, _minimumGap,
                      _comfortAcceleration, _comfortDeceleration)
{
    this.desiredSpeed = _desiredSpeed; // v0

    this.timeHeadway = _timeHeadway; // T
    this.minimumGap = _minimumGap; // s0

    this.comfortAcceleration = _comfortAcceleration; // a
    this.comfortDeceleration = _comfortDeceleration; // b

    // calculate once to avoid reduntant multiplications
    this.A_times_B = Math.sqrt( _comfortAcceleration * _comfortDeceleration );
}

function IDM( modelConfig )
{
    this.desiredSpeed = modelConfig.desiredSpeed;
    this.timeHeadway = modelConfig.timeHeadway;
    this.minimumGap = modelConfig.minimumGap;
    this.comfortAcceleration = modelConfig.comfortAcceleration;
    this.comfortDeceleration = modelConfig.comfortDeceleration;

    this.speedLimit = 1000;
    this.speedMax = 1000;
    this.bMax = 16;
}

// gap (s in formula) - actual gap between vehicles
// speed - velocity of current vehicle
// leadSpeed - velocity of the vehicle in front of current one
// leadAcceleration - acceleration of the leading vehicle
IDM.prototype.calculateAcceleration( gap, speed, leadSpeed, leadAcceleration )
{
    // determine valid local v0
	let valid_v0 = Math.min(this.desiredSpeed, this.speedlimit, this.speedMax);

    // actual acceleration model
    // 4 is an acceleration exponent
   	let freeRoadAcceleration = (speed < valid_v0) ?
    this.a * ( 1 - Math.pow( speed/valid_v0, 4 ) ) :
    this.a * ( 1 - speed/valid_v0 );

    let delta_v = leadSpeed - speed;

    // calculate desired dynamical distance s*
    let dynamicDistance = speed * this.timeHeadway;
    dynamicDistance += (0.5 * delta_v) / this.A_times_B;

    dynamicDistance = Math.max( 0, dynamicDistance );
    dynamicDistance += this.minimumGap;

    let actualGap = Math.max( gap, this.minimumGap );
    let deceleration =
        this.comfortAcceleration *
        Math.pow( dynamicDistance / actualGap, 2)

    // return original IDM
	return (valid_v0 < 0.00001) ?
        0 : Math.max(-this.bMax, freeRoadAcceleration - deceleration);
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

    // actual acceleration model
    // 4 is an acceleration exponent
   	let freeRoadAcceleration = (speed < valid_v0) ?
    this.a * ( 1 - Math.pow( speed/valid_v0, 4 ) ) :
    this.a * ( 1 - speed/valid_v0 );

    let delta_v = speed - leadSpeed;

    // calculate desired dynamical distance s*
    let dynamicDistance = speed * this.timeHeadway;
    dynamicDistance += (0.5 * delta_v) / this.A_times_B;

    dynamicDistance = Math.max( 0, dynamicDistance );
    dynamicDistance += this.minimumGap;

    let actualGap = Math.max( gap, this.minimumGap );
    let deceleration =
        this.comfortAcceleration *
        Math.pow( dynamicDistance / actualGap, 2)

    // return original IDM
	return (valid_v0 < 0.00001) ?
        0 : Math.max(-this.bMax, freeRoadAcceleration - deceleration);
}
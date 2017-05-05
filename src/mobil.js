/*
 * Lane change model MOBIL
 * Main parameters are:
 * b_safe - safe deceleration at maximum speed
 * bSafeMax - safe deceleration at speed zero
 * bThreshold - minimal required difference between actual and prospective acceleration
 * after changing lane, if difference less than threshold, car doesn't
 * change lane
 */

const safeDeceleration = 4; // bSafe
const bSafeMax = 17; // bSafeMax
const bThreshold = 0.2; // bThreshold


function MOBIL( _safeDeceleration, _bSafeMax, _bThreshold, _bBias )
{
	this.safeDeceleration = _safeDeceleration;
	this.bSafeMax = _bSafeMax;
	this.bThreshold = _bThreshold;
	this.bBias = _bBias;
}

/*
 * \param velocity_rate - v/v0; increase bSave with decreasing velocity_rate
 * \param cur_acc - own acceleration on the present lane
 * \param new_acc - prospective acceleration on the new laneEnd
 * \param follower_acc -
 */
MOBIL.prototype.doLaneChange = function( velocityRate, curAcceleration,
										 newAcceleration,
										 newFollowerAcceleration )
{
	let bSafeActual = velocityRate * this.safeDeceleration;
	bSafeActual += (1 - velocityRate) * this.bSafeMax;

	if (newFollowerAcceleration < -bSafeActual)
	{
		return false;
	}

	let delta_a = newAcceleration - curAcceleration;
	delta_a += this.bBias - this.bThreshold;

	return (delta_a > 0);
}

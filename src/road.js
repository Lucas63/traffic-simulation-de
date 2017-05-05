// Layout of road, orientation used in calculation of car positions
// also used by map for rendering
var RoadDirectionEnum =
{
	LEFT_TO_RIGTH : 0,
	RIGHT_TO_LEFT : 1,
	BOTTOM_TO_UP : 2,
	UP_TO_BOTTOM : 3
};


/*
 * \brief Object with all information for road setup
 *
 * \param _roadLength - length in distance units
 * \param _laneWidth - width of the single lane
 * \param _lanes - array with all lanes related to current road
 * \param _orientation - value from RoadDirectionEnum
 */
function RoadConfig( _id, _roadLength, _laneWidth,
					 _forwardLanesAmount, _backwardLanesAmount,
					 _direction, _cars )
{
	this.id = _id;
	this.direction = _direction;

	// Lane length is equal to road length
	this.roadLength = _roadLength;

	this.forwardLanesAmount = _forwardLanesAmount;
	this.backwardLanesAmount = _backwardLanesAmount;

	this.laneWidth = _laneWidth;
}

/*
 * \brief This function setup road and make all initialization
 */
function Road( roadConfig )
{
	this.id = roadConfig.id;
	this.direction = roadConfig.direction;

	this.roadLength = roadConfig.laneWidth;

	this.forwardLanes = new Array(roadConfig.forwardLanesAmount);
	this.backwardLanes = new Array(roadConfig.backwardLanesAmount);

	let lanesAmount = roadConfig.forwardLanesAmount +
					  roadConfig.backwardLanesAmount;

	this.roadWidth = roadConfig.laneWidth * lanesAmount;
}

// lane - object of Lane class
// laneDirection - forward or backward
// laneIndex - index within forwardLanes or backwardLanes array
// return true if added, otherwise false
Road.prototype.addLane = function( lane, laneDirection, laneIndex)
{
	if (lane == null || laneIndex < 0)
	{
		console.log("addLane(): Input parameters are wrong!");
		return false;
	}

	if (laneDirection == LaneDirection.FORWARD)
	{
		if ( this.forwardLanes.length < laneIndex)
		{
			return false;
		}

		this.forwardLanes.splice(laneIndex, 0, lane);
	}
	else
	{
		if ( this.backwardLanes.length < laneIndex )
		{
			return false;
		}

		this.backwardLanes.splice(laneIndex, 0, lane);
	}

	return true;
}

Road.prototype.addVehicleToLane( vehicle, laneIndex )
{
	if (laneIndex < 0 || laneIndex >= this.lanes.length)
	{
		return false;
	}

	this.lanes[laneIndex].addVehicle( vehicle );
	return true;
}

// Update leading and following vehicles for all vehicles on the lane *laneIndex*
Road.prototype.updateNeighbours = function( lane, laneIndex, lanesArray )
{
	console.log("updateNeighbours() for " + laneIndex + " lane");
}


Road.prototype.updateNeighboursForAdjacentLane =
	function( lane, laneIndex, lanesArray)
{
	console.log("updateNeighboursForAdjacentLane for " + laneIndex + " lane ");
}

Road.prototype.updateVehicles = function( vehicle, vehicleIndex, vehiclesArray)
{
	vehicle.longitudinalModel.calculateAcceleration();
}

// update positions of all cars on all lanes
Road.prototype.updateLanes = function()
{
	lane = null;

	this.forwardLanes.forEach( updateNeighbours );
	this.forwardLanes.forEach( updateNeighboursForAdjacentLane );
	this.forwardLanes.forEach( updateVehicles );

	this.backwardLanes.forEach( updateNeighbours );
	this.backwardLanes.forEach( updateNeighboursForAdjacentLane );
	this.backwardLanes.forEach( updateVehicles );
}

// Traverse over each car and decide whether it moves to the right lane
Road.prototype.checkChangeToRightLane = function()
{
	console.log("checkRightLane()")
}

// Traverse over each car and decide whether it moves to the left lane
Road.prototype.checkChangeToLeftLane = function()
{
	console.log("checkLeftLane()")
}

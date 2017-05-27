
// Each junction has 4 sides identified by numbers
// and 2 traffic lights: vertical and horizontal.

/*
Number represents each side of the junction
		 0
	 ――――――――――
	|          |
	|          |
  3 |          | 1
	|          |
	|          |
	 ――――――――――
		 2
*/

var JunctionSides =
{
	"top"   : 0,
	"right" : 1,
	"bottom": 2,
	"left"  : 3
}

// _id - junction's identifier
// _pos - coordinates of center (TBD)
// _side - length of one side
// _verticalTrafficLight - traffic light controlling traffic
// on roads "top" and "bottom"
// _horizontalTrafficLight - the same for road "right" and "left"
function Junction( _id,_pos, _side,
				   _topRoad, _rightRoad, _bottomRoad, _leftRoad,
				   _verticalTrafficLight, _horizontalTrafficLight)
{
	this.id = _id;
	this.centralPosition = _pos;
	this.side = _side;

	this.verticalTrafficLight = _verticalTrafficLight;
	this.horizontalTrafficLight = _horizontalTrafficLight;


	// initialize data for "top" road
	this.topRoad.road = _topRoad;

	this.topRoad.turnRightLanes = new Array(_leftRoad.getForwardLanesAmount());
	// TODO find out lanes on destination road and take their amount
	// this code works only because all roads has the same number of
	// forward and backward lanes
	this.topRoad.passLanes = new Array(_bottomRoad.getForwardLanesAmount());
	this.topRoad.turnLeftLanes = new Array(_rightRoad.getForwardLanesAmount());

	addVehiclesArray(this.topRoad);

	// initialize data for "right" road
	this.rightRoad.road = _rightRoad;

	this.rightRoad.turnRightLanes = new Array(_topRoad.getForwardLanesAmount());
	this.rightRoad.passLanes = new Array(_leftRoad.getForwardLanesAmount());
	this.rightRoad.turnLeftLanes =
			new Array(_bottomRoad.getForwardLanesAmount());

	addVehiclesArray(this.rightRoad);

	// initialize data for "bottom" road
	this.bottomRoad.road = _bottomRoad;

	this.bottomRoad.turnRightLanes =
			new Array(_rightRoad.getForwardLanesAmount());

	this.passLanes = new Array(_topRoad.getForwardLanesAmount());

	this.bottomRoad.turnLeftLanes =
			new Array(_leftRoad.getForwardLanesAmount());

	addVehiclesArray(this.bottomRoad);


	// initialize data for "bottom" road
	this.leftRoad.road = _leftRoad;

	this.leftRoad.turnRightLanes =
			new Array(_bottomRoad.getForwardLanesAmount());

	this.leftRoad.passLanes = new Array(_rightRoad.getForwardLanesAmount());
	this.leftRoad.turnLeftLanes = new Array(_topRoad.getForwardLanesAmount());

	addVehiclesArray(this.leftRoad);

	// select lanes on destination road for each turn
	////////////////////////////////////////////////////////////////////////
	//                                  source        destination
	this.getDestinationLanesAtRight( this.topRoad, this.leftRoad );
	this.getDestinationLanesForPass( this.topRoad, this.bottomRoad );
	this.getDestinationLanesAtLeft( this.topRoad, this.leftRoad );

	//                                  source        destination
	this.getDestinationLanesAtRight( this.rightRoad, this.topRoad );
	this.getDestinationLanesForPass( this.rightRoad, this.leftRoad );
	this.getDestinationLanesAtLeft( this.rightRoad, this.bottomRoad );

	//                                  source        destination
	this.getDestinationLanesAtRight( this.bottomRoad, this.rightRoad );
	this.getDestinationLanesForPass( this.bottomRoad, this.topRoad );
	this.getDestinationLanesAtLeft( this.bottomRoad, this.leftRoad );

	//                                  source        destination
	this.getDestinationLanesAtRight( this.leftRoad, this.bottomRoad );
	this.getDestinationLanesForPass( this.leftRoad, this.rightRoad );
	this.getDestinationLanesAtLeft( this.leftRoad, this.topRoad );
	////////////////////////////////////////////////////////////////////////


	// all roads on junction have the same quantity of lanes
	let lanesAmount = this.topRoad.getForwardLanesAmount();

	this.turnRightDuration = new Array(lanesAmount);
	for (let i = 0; i < lanesAmount; ++i)
	{
		this.turnRightDuration[i] = TURN_DURATION_BASE +
									i * TURN_DURATION_FOR_LANE;
	}

	this.turnLeftDuration = new Array(lanesAmount);

	// when vehicle is turning at left it also passes space for backward lanes
	// it takes some time, so base value is bigger than for turn left
	for (let i = 0; i < lanesAmount; ++i)
	{
		this.turnLeftDuration[i] = 2 * TURN_DURATION_BASE +
								   i * TURN_DURATION_FOR_LANE;
	}
}

function addVehiclesArray( road )
{
	let initArray = function(lane) {
		lane.vehicles = [];
	};

	road.turnRightLanes.forEach(initArray);
	road.passLanes.forEach(initArray);
	road.turnLeftLanes.forEach(initArray);
}

Junction.prototype.getTrafficLight( _roadId )
{
	let side = this.getSideForRoad( _roadId );
	if (null == side )
		return null;

	switch( side )
	{
		case JunctionSides["top"]:
		case JunctionSides["bottom"]:
			return this.verticalTrafficLight.light;

		case JunctionSides["left"]:
		case JunctionSides["right"]:
			return this.horizontalTrafficLight.light;
	}
}

Junction.prototype.getJunctionRoadFromSide( _side )
{
	switch(_side)
	{
	case JunctionSides["top"]:
		return this.topRoad;

	case JunctionSides["right"]:
		return this.rightRoad;

	case JunctionSides["bottom"]:
		return this.bottomRoad;

	case JunctionSides["left"]:
		return this.leftRoad;
	}
}

Junction.prototype.getSideForRoad = function( roadID )
{
	switch ( roadID ) {
	case this.topRoad.road.getId():
		return JunctionSides["top"];

	case this.rightRoad.road.getId():
		return JunctionSides["right"];

	case this.bottomRoad.road.getId():
		return JunctionSides["bottom"];

	case this.leftRoad.road.getId():
		return JunctionSides["left"];

	default:
		printError( arguments.callee.name, "Road with id " + roadID +
					"is not connected to junction");
		return null;
	}
}

// Road connected to junction with *start* or *finish* end and it affects
// which lanes use on destination road
// _source - source road
// _destination - destination road
Junction.prototype.getDestinationLanesAtRight = function(_source, _destination)
{
	let destRoad = _destination.road;

	// if *finish* end of road connected to this junction
	if (destRoad.finishConnection == RoadObject.JUNCTION)
	{
		_source.turnRightDestLanes = destRoad.backwardLanes;
	}
	else
	{
		_source.turnRightDestLanes = destRoad.forwardLanes;
	}
}

Junction.prototype.getDestinationLanesAtLeft = function( _source, _destination )
{
	let destRoad = _destination.road;

	if (destRoad.finishConnection == RoadObject.JUNCTION)
	{
		_source.turnLeftDestLanes = destRoad.backwardLanes;
	}
	else
	{
		_source.turnLeftDestLanes = destRoad.forwardLanes;
	}
}

Junction.prototype.getDestinationLanesForPass( _source, _destination )
{
	let sourceRoad = _source.road;
	let destRoad = _destination.road;

	if ( destRoad.startConnection == RoadObject.JUNCTION)
	{
		_source.passDestLanes = destRoad.forwardLanes;
	}
	else
	{
		_source.passDestLanes = destRoad.backwardLanes;
	}
}

function getRightSide( _side )
{
	switch(_side)
	{
	case JunctionSides["top"]:
		return JunctionSides["left"];

	case JunctionSides["right"]:
		return JunctionSides["top"];

	case JunctionSides["bottom"]:
		return JunctionSides["right"];

	case JunctionSides["left"]:
		return JunctionSides["bottom"];
	}
}

function getOppositeSide( _side )
{
	switch(_side)
	{
	case JunctionSides["top"]:
		return JunctionSides["bottom"];

	case JunctionSides["right"]:
		return JunctionSides["left"];

	case JunctionSides["bottom"]:
		return JunctionSides["top"];

	case JunctionSides["left"]:
		return JunctionSides["right"];
	}
}

function getLeftSide( _side )
{
	switch(_side)
	{
	case JunctionSides["top"]:
		return JunctionSides["right"];

	case JunctionSides["right"]:
		return JunctionSides["bottom"];

	case JunctionSides["bottom"]:
		return JunctionSides["left"];

	case JunctionSides["left"]:
		return JunctionSides["top"];
	}
}

// roadId - id of road where vehicle is about to turn right from (source road)
// laneIndex - index of lane on source road
// vehicleRequiredSpace - minimal space for vehicle on destination road
Junction.prototype.canTurnRight = function( roadId, laneIndex,
											vehicleRequiredSpace )
{
	let sourceSide = this.getSideForRoad( roadId );
	if (sourceSide == null)
	{
		printError(arguments.callee.name, "Wrong road id!");
		return false;
	}

	let sourceRoad = this.getJunctionRoadFromSide( sourceSide );

	let turnLanes = sourceRoad.turnRightLanes;
	let vehicles = turnLanes[laneIndex].vehicles;
	var vehicle = null;

	if ( vehicles.empty() == false )
	{
		vehicle = vehicles.last();
		if (vehicle.turnCompletion < 0.5)
		{
			return false;
		}
	}

	let passLanes = sourceRoad.passLanes;

	// check vehicles passing through the junction from the same road
	// on lanes at right
	for (let i = laneIndex; i < passLanes.length; ++i)
	{
		vehicles = passLanes[i].vehicles;
		if (vehicles.empty())
			continue;

		vehicle = vehicles.last();

		// the very last passing vehicle is not moved for a half of junction's
		// side distance and conflict is possible
		if ( vehicle.farFrom(this.side / 2) == false )
		{
			return false;
		}
	}


	let oppositeSide = this.getOppositeSide( sourceSide );
	let oppositeRoad = this.getJunctionRoadFromSide( oppositeSide );

	let turnLeftLanes = oppositeRoad.turnLeftLanes;
	let turnLeftLanesAmount = turnLeftLanes.length;

	// iterate starting from the same lane as on source road
	// if vehicle turnes left to lane on destination road that left than
	// lane with *laneIndex*, turn is possible and no conflicts
	for (let i = laneIndex;i < turnLeftLanesAmount; ++i)
	{
		vehicles = turnLeftLanes[i];
		if (vehicles.empty())
			continue;

		vehicle = vehicles.first();
		// if the very first vehicle hasn't completed turn for 50%,
		// vehicle on source lane have time to turn
		if (vehicle.turnCompletion < 0.5)
			continue;

		vehicle = vehicles.last();
		if (vehicle.turnCompletion < 0.5)
		{
			return false;
		}
	}

	let destSide = this.getRightSide( sourceSide );
	let destRoad = this.getJunctionRoadFromSide( destSide );

	// points to appropriate lanes array of destination road
	turnLanes = sourceRoad.turnRightDestLanes;

	// and after all these calculations check
	// if enough space on destination road
	return turnLanes[laneIndex].hasEnoughSpace( vehicleRequiredSpace );
}

Junction.prototype.canPassThrough = function( roadId, laneIndex,
											  vehicleRequiredSpace )
{
	let sourceSide = this.getSideForRoad( roadId );
	if (sourceSide == null)
	{
		printError(arguments.callee.name, "Wrong road id!");
		return null;
	}

	let sourceRoad = this.getJunctionRoadFromSide( sourceSide );

	let passLanes = sourceRoad.passLanes;
	var lastVehicle = passLanes[laneIndex].vehicles.last();

	// there is no enough space before last vehicle
	if( lastVehicle.farFrom(vehicleRequiredSpace) == false)
	{
		return false;
	}

	// check vehicles turning right
	//////////////////////////////////////////////////////////////////////
	let turnRightLanes = sourceRoad.turnRightLanes;

	// check vehicles turning right from lanes at left
	for (let i = 0;i <= laneIndex; ++i)
	{
		vehicles = turnRightLanes[i].vehicles;
		if (vehicles.empty())
			continue;

		lastVehicle = vehicles.last();
		if (lastVehicle.turnCompletion < 0.5)
		{
			return false;
		}
	}
	//////////////////////////////////////////////////////////////////////

	// check vehicles turning left
	//////////////////////////////////////////////////////////////////////
	let turnLeftLanes = sourceRoad.turnLeftLanes;

	// check vehicles turning left from lanes at right
	for (let i = laneIndex;i < turnLeftLanes.length; ++i)
	{
		vehicles = turnRightLanes[i].vehicles;
		if (vehicles.empty())
			continue;

		lastVehicle = vehicles.last();
		if (lastVehicle.turnCompletion < 0.5)
		{
			return false;
		}
	}
	//////////////////////////////////////////////////////////////////////

	// check vehicles on opposite road
	//////////////////////////////////////////////////////////////////////
	let oppositeSide = this.getOppositeSide( sourceSide );
	let oppositeRoad = this.getJunctionRoadFromSide( oppositeSide );

	let turnLeftLanes = oppositeRoad.turnLeftLanes;
	let turnLeftLanesAmount = turnLeftLanes.length;

	for (let i = 0;i < turnLeftLanesAmount; ++i)
	{
		vehicles = turnLeftLanes[i];
		if (vehicles.empty())
			continue;

		// vehicle cannot pass through if there are ones turning left
		return false;
	}
	//////////////////////////////////////////////////////////////////////


	// check whether lane on destination road has enough space for vehicle
	//////////////////////////////////////////////////////////////////////
	passLanes = sourceRoad.passDestLanes;

	return passLanes[laneIndex].hasEnoughSpace( vehicleRequiredSpace );
}

Junction.prototype.canTurlLeft = function( roadId, laneIndex,
										   vehicleRequiredSpace )
{
	let sourceSide = this.getSideForRoad( roadId );
	if (sourceSide == null)
	{
		printError(arguments.callee.name, "Wrong road id!");
		return false;
	}

	let sourceRoad = this.getJunctionRoadFromSide( sourceSide );

	let turnLanes = sourceRoad.turnLeftLanes;
	let vehicles = turnLanes[laneIndex].vehicles;
	var vehicle = null;

	if ( vehicles.empty() == false )
	{
		vehicle = vehicles.last();
		if (vehicle.turnCompletion < 0.5)
		{
			return false;
		}
	}

	let passLanes = sourceRoad.passLanes;

	// check vehicles passing through the junction from the same road
	// on lanes at left
	for (let i = 0; i <= laneIndex; ++i)
	{
		vehicles = passLanes[i].vehicles;
		if (vehicles.empty())
			continue;

		vehicle = vehicles.last();

		// the very last passing vehicle is not moved for a half of junction's
		// side distance and conflict is possible
		if ( vehicle.farFrom(this.side / 2) == false )
		{
			return false;
		}
	}

	let oppositeSide = this.getOppositeSide( sourceSide );
	let oppositeRoad = this.getJunctionRoadFromSide( oppositeSide );

	passLanes = oppositeRoad.passLanes;

	for (let i = 0;i < passLanes.length; ++i)
	{
		vehicles = passLanes[i].vehicles;
		if (vehicles.empty())
			continue;

		vehicle = vehicles.last();

		if ( vehicle.farFrom(this.side / 2) == false )
		{
			return false;
		}

		// Possible solution:if there are vehicles passing through the junction,
		// vehicle cannot turn left
		// return false;
	}

	// check whether lane on destination road has enough space for vehicle
	//////////////////////////////////////////////////////////////////////
	let destSide = this.getLeftSide( sourceSide );
	let destRoad = this.getJunctionRoadFromSide( destSide );

	turnLanes = sourceRoad.turnLeftDestLanes;

	// check if enough space on destination road
	return turnLanes[laneIndex].hasEnoughSpace( vehicleRequiredSpace );
}

Junction.prototype.startTurnRight = function( roadId, laneIndex, vehicle )
{
	let sourceSide = this.getSideForRoad( roadId );
	if (sourceSide == null)
	{
		printError(arguments.callee.name, "Wrong road id!");
		return false;
	}

	let sourceRoad = this.getJunctionRoadFromSide( sourceSide );

	vehicle.trafficState = TrafficState.FREE_ROAD;
	vehicle.movementState = MovementState.ON_JUNCTION;

	vehicle.prepareForTurn(this.turnRightDuration[laneIndex]);
	vehicle.turnDestinationLane = laneIndex;

	sourceRoad.turnRightLanes[laneIndex].vehicles.push(vehicle);
}

Junction.prototype.startPassThrough = function( roadId, laneIndex, vehicle)
{
	let sourceSide = this.getSideForRoad( roadId );
	if (sourceSide == null)
	{
		printError(arguments.callee.name, "Wrong road id!");
		return false;
	}

	let sourceRoad = this.getJunctionRoadFromSide( sourceSide );

	vehicle.trafficState = TrafficState.FREE_ROAD;
	vehicle.vehicleState = VehicleState.MOVING;
	vehicle.movementState = MovementState.ON_JUNCTION;

	vehicle.uCoord = 0;

	sourceRoad.passLanes[laneIndex].vehicles.push( vehicle );
}

Junction.prototype.startTurnLeft = function( roadId, laneIndex, vehicle )
{
	let sourceSide = this.getSideForRoad( roadId );
	if (sourceSide == null)
	{
		printError(arguments.callee.name, "Wrong road id!");
		return false;
	}

	let sourceRoad = this.getJunctionRoadFromSide( sourceSide );

	vehicle.trafficState = TrafficState.FREE_ROAD;
	vehicle.movementState = MovementState.ON_JUNCTION;

	vehicle.prepareForTurn(this.turnRightDuration[laneIndex]);

	vehicle.turnDestinationLane = laneIndex;

	sourceRoad.turnLeftLanes[laneIndex].vehicles.push(vehicle);
}

Junction.prototype.turnRightCompleted = function( roadId, laneIndex )
{
	let sourceSide = this.getSideForRoad( roadId );
	if (sourceSide == null)
	{
		printError(arguments.callee.name, "Wrong road id!");
		return null;
	}

	let sourceRoad = this.getJunctionRoadFromSide( sourceSide );

	let turnLanes = sourceRoad.turnRightLanes;
	let vehicles = turnLanes[laneIndex].vehicles;

	if (vehicles.empty())
		return null;

	let firstVehicle = vehicles.first();
	if ( firstVehicle.arrived )
		return firstVehicle;

	return null;
}

Junction.prototype.passCompleted = function( roadId, laneIndex )
{
	let sourceSide = this.getSideForRoad( roadId );
	if (sourceSide == null)
	{
		printError(arguments.callee.name, "Wrong road id!");
		return null;
	}

	let sourceRoad = this.getJunctionRoadFromSide( sourceSide );
	let passLanes = sourceRoad.passLanes;
	let lastVehicle = passLanes[laneIndex].vehicles.first();

	return lastVehicle.uCoord == this.side;
}

Junction.prototype.turnLeftCompleted = function( roadId, laneIndex )
{
	let sourceSide = this.getSideForRoad( roadId );
	if (sourceSide == null)
	{
		printError(arguments.callee.name, "Wrong road id!");
		return null;
	}

	let sourceRoad = this.getJunctionRoadFromSide( sourceSide );

	let turnLanes = sourceRoad.turnLeftLanes;
	let vehicles = turnLanes[laneIndex].vehicles;

	if (vehicles.empty())
		return null;

	let firstVehicle = vehicles.first();
	if (firstVehicle.arrived)
		return firstVehicle;

	return null;
}

Junction.prototype.updateTrafficLights = function(dt)
{
	if (null != this.horizontalTrafficLight)
		this.horizontalTrafficLight.update(dt);

	if (null != this.verticalTrafficLight)
		this.verticalTrafficLight.update(dt);
}

function updateVehiclesForJunctionRoad( _road, dt )
{
	let update = function(lane) {
		updateVehicles(lane.vehicles, dt)
	};

	_road.turnRightLanes.forEach(update);
	_road.passLanes.forEach(update);
	_road.turnLeftLanes.forEach(update);
}

Junction.prototype.update = function( dt )
{
	this.updateTrafficLights( dt );

	updateVehiclesForJunctionRoad(this.topRoad, dt);
	updateVehiclesForJunctionRoad(this.rightRoad, dt);
	updateVehiclesForJunctionRoad(this.bottomRoad, dt);
	updateVehiclesForJunctionRoad(this.leftRoad, dt);
}

// Layout of road, orientation used in calculation of car positions
    lanes = road.forwardLanes;
    for (let i = 0; i < lanes.length; ++i)
    {
        checkArrivedVehicle(junction, lanes[i], i);
    }

    lanes = road.backwardLanes;
    for (let i = 0; i < lanes.length; ++i)
    {
        checkArrivedVehicle(junction, lanes[i], i);
    }

// also used by map for rendering
var RoadDirection =
{
	BOTTOM_TO_UP  : { value: 0, name: "BOTTOM_TO_UP"  },
	LEFT_TO_RIGHT : { value: 1, name: "LEFT_TO_RIGHT" },
	UP_TO_BOTTOM  : { value: 2, name: "UP_TO_BOTTOM"  },
	RIGHT_TO_LEFT : { value: 3, name: "RIGHT_TO_LEFT" }
};

var RoadObject =
{
	// denotes edge of map, used if road starts from or ends with map's edge
	VOID : { value: 0, name: "void"},

	// two roads connected with turn
	TURN : { value: 1, name: "turn"},

	// onramp connected to the road
	ONRAMP : { value: 2, name: "onramp"},

	// offramp connected to the road
	OFFRAMP : { value: 3, name: "offramp"},

	// junction connects 3 or 4 roads to appropriate side
	// see junction.js for more details
	JUNCTION : { value: 4, name: "junction"}
}

/*
 * Each road is a straight one defined by *start* and *finish* points.
 * Direction field is a direction from the *start* to the *finish*.
 *
 * Road defined by unique id and each point connected to some road object
 * from the *RoadObject*. This information used to define vehicles behaviour
 * on the road:
 * If distance between vehicle and the *finish* point more than specified
 * *upstreamDistance*, then vehicle tries to get desired speed.
 *
 * If distance less or equal to *upstreamDistance*, then RoadEngine get road
 * Object *finish* point connected to. There are next options:
 *
 * - road's *finish* connected to TURN, vehicle's model changed to 'upstream'
 *   model; TODO think about another LC model
 *
 * - road's *finish* connected to JUNCTION, get light of the appropriate
 *   traffic light and do next:
 * -- Green light: set 'upstream' model to vehicle;
 * -- Yellow light: set model more safe than 'upstream';
 * -- Red light: set the same model as for yellow light, if distance to
 *    *finish* point or before the leading vehicle less than "safeDistance",
 *     then set vehicle equal to 0, otherwise move to the *finish* point
 *     or leading vehicle.
 *
 * - road's *finish* connected to VOID, then vehicle doesn't change model,
 *   after vehicle's u coordinate become equal or more then road's length,
 *   it disappeared.
 *
 * Next situation when road contains onramps and offramps.
 * If vehicle switch lane to onramp according to the route, it changes own
 * longitudinal model to 'upstream' model and LC model to aggresive LC model
 * with purpose to switch to the lane onramp connects to. Because vehicle
 * must be on the same lane that connected to onramp.
 *
 * From offramp vehicle can only move to connected road and here is Situation
 * when bottleneck can appear. Bottleneck is a situation when vehicle waits
 * to possibility to move to the road while another vehicles moving on the road.
 */

/*
 * \brief Object with all information for road setup
 *
 * \param _id - unique identifier of the road
 * \param _type - value from RoadDirection
 * \param _roadLength - length in distance units
 * \param _laneWidth - width of the single lane
 *
 * \param _startX - x cooridinate of the road's start on the map
 * \param _startY - y cooridinate of the road's start on the map
 * \param _finishX - x cooridinate of the road's finish on the map
 * \param _finishY - y cooridinate of the road's finish on the map
 *
 * \param _forwardLanes - list with forward lanes
 * \param _backwardLanes - list with backward lanes
 */
function RoadConfig( _id, _type, _roadLength, _laneWidth,
					 _startX, _startY, _finishX, _finishY,
					 _startConnection, _finishConnection,
					 _forwardLanes, _backwardLanes, _spawnPoints)
{
	this.id = _id;
	this.type = _type;

	// Lane length is equal to road length
	this.roadLength = _roadLength;
	this.laneWidth = _laneWidth;

	this.startX = _startX;
	this.startY = _startY;

	this.finishX = _finishX;
	this.finishY = _finishY;

	this.startConnection = _startConnection;
	this.finishConnection = _finishConnection;

	this.forwardLanes = _forwardLanes;
	this.backwardLanes = _backwardLanes;
}

/*
 * \brief This function setup road and make all initialization
 */
function Road( roadConfig )
{
	this.id = roadConfig.id;
	this.type = roadConfig.type;

	this.length = roadConfig.laneWidth;

	this.borderDistance = this.length - MINIMAL_GAP;

	this.forwardLanes = roadConfig.forwardLanes;
	this.backwardLanes = roadConfig.backwardLanes;

	let lanesAmount = this.forwardLanes.length +
					  roadConfig.backwardLanes.length;
	this.roadWidth = roadConfig.laneWidth * lanesAmount;

	this.startX = roadConfig.startX;
	this.startY = roadConfig.startY;

	this.finishX = roadConfig.finishX;
	this.finishY = roadConfig.finishY;

	this.startConnection = roadConfig.startConnection;
	this.finishConnection = roadConfig.finishConnection;

	this.forwardLanesAmount = roadConfig.forwardLanesAmount;
	this.backwardLanesAmount = roadConfig.backwardLanesAmount;
}

Road.prototype.getId = function()
{
	return this.id;
}

Road.prototype.getLanesAmount = function()
{
	return this.forwardLanes.length + this.backwardLanes.length;
}

Road.prototype.getForwardLanesAmount = function()
{
	return this.forwardLanes.length;
}

Road.prototype.getBackwardLanesAmount = function()
{
	return this.backwardLanes.length;
}

// \param object - object connected to the road
// lanes where vehicle is going to move on road depend on which road's side
// object connected to
Road.prototype.getLanesConnectedWith( object )
{
    switch (object) {
        case this.startConnection:
            return this.forwardLanes;
            break;

        case this.finishConnection:
            return this.backwardLanes;
            break;

        default:
            printDebug(this.arguments.callee, "Unknown object " + object);
            return null;

    }
}

// lane - object of Lane class
// laneDirection - forward or backward
// laneIndex - index within forwardLanes or backwardLanes array
// return true if added, otherwise false
Road.prototype.pushLane = function( lane, laneDirection )
{
	assert( lane, "pushLane(): lane object is null!")

	switch(laneDirection)
	{
	case LaneType["forward"]:
		this.forwardLanes.push( lane );
		break;

	case LaneDirection["backward"]:
		this.backwardLanes.push( lane );
		break;

	default:
		console.log("Unknown lane direction + " + laneDirection + "!");
		return false;
	}

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

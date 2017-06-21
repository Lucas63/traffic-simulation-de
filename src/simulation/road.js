// also used by map for rendering
var RoadDirection =
{
	BOTTOM_TO_UP  : 0,
	LEFT_TO_RIGHT : 1,
	UP_TO_BOTTOM  : 2,
	RIGHT_TO_LEFT : 3
};

var RoadObject =
{
	// denotes edge of map, used if road starts from or ends with map's edge
	VOID: 0,

	// two roads connected with turn
	TURN: 1,

	// onramp connected to the road
	ONRAMP: 2,

	// offramp connected to the road
	OFFRAMP: 3,

	// junction connects 3 or 4 roads to appropriate side
	// see junction.js for more details
	JUNCTION: 4,

	ROAD: 6
};

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
 * \param _direction - value from RoadDirection
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
function RoadConfig( _id, _direction, _forwardbases, _backwardBases,
					 _roadLength, _laneWidth,
					 _startX, _startY, _finishX, _finishY,
					 _startConnection, _finishConnection,
					 _forwardLanes, _backwardLanes)
{
	this.id = _id;
	this.direction = _direction;

	this.forwardBases = _forwardbases;
	this.backwardBases = _backwardBases;

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
	setupPassLanes(this.forwardLanes, _roadLength);

	this.backwardLanes = _backwardLanes;
	if(this.backwardLanes)
		setupPassLanes(this.backwardLanes, _roadLength);
}

function RoadBases(_move_dx, _move_dy)
{
	this.move_dx = _move_dx;
	this.move_dy = _move_dy;
}

// reprents map object connected to the road
// \param [RoadObject] type - type of map object
// \param id - id of connected object
function RoadConnection (type, id)
{
	this.type = type;
	this.id = id;
	this.object = null;
}

/*
 * \brief This function setup road and make all initialization
 */
function Road( roadConfig )
{
	this.id = roadConfig.id;
	this.direction = roadConfig.direction;

	this.type = RoadObject.ROAD;

	this.length = roadConfig.roadLength;

	this.forwardLanes = roadConfig.forwardLanes;
	this.backwardLanes = roadConfig.backwardLanes;


	this.startX = roadConfig.startX;
	this.startY = roadConfig.startY;

	this.finishX = roadConfig.finishX;
	this.finishY = roadConfig.finishY;

	this.startConnection = roadConfig.startConnection;
	this.finishConnection = roadConfig.finishConnection;


	this.forwardLanesAmount = (roadConfig.forwardLanes) ?
		roadConfig.forwardLanes.length : 0;

	this.backwardLanesAmount = (roadConfig.backwardLanes) ?
		roadConfig.backwardLanes.length : 0;


	this.lanesAmount = this.forwardLanesAmount + this.backwardLanesAmount;
	this.roadWidth = logic_lane_width * this.lanesAmount;

	this.forwardBases = roadConfig.forwardBases;
	this.backwardBases = roadConfig.backwardBases;
}

Road.prototype.getLength = function()
{
	return this.length;
};

Road.prototype.getId = function()
{
	return this.id;
};

Road.prototype.getLanesAmount = function()
{
	return this.lanesAmount;
};

Road.prototype.getForwardLanesAmount = function()
{
	if(this.forwardLanes){
		return this.forwardLanes.length;
	}
	return 0;
};

Road.prototype.getBackwardLanesAmount = function()
{
	if(this.backwardLanes){
		return this.backwardLanes.length;
	}
	return 0;

};

// \param object - object connected to the road
// lanes where vehicle is going to move on road depend on which road's side
// object connected to
Road.prototype.getLanesConnectedWith = function( object )
{
	switch (object) {
		case this.startConnection.object:
			return this.forwardLanes;
			break;

		case this.finishConnection.object:
			return this.backwardLanes;
			break;

		default:
			printDebug(this.arguments.callee, "Unknown object " + object);
			return null;
	}
};

// lane - object of Lane class
// laneDirection - forward or backward
// laneIndex - index within forwardLanes or backwardLanes array
// return true if added, otherwise false
Road.prototype.pushLane = function( lane, laneDirection )
{
	// assert( lane, "pushLane(): lane object is null!")

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
};

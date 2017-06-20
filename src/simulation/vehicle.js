// type affects length, max and desired speed, etc.
VehicleType =
	{
		CAR: 0,
		TRUCK: 1
	};

VehicleState =
	{
		MOVING: 0, // drive on straight road or passing through the junction
		TURNING: 1, // turning on Turn/Onramp/Offramp/Junction
		IDLE: 2, // vehicle stopped
		CHANGE_LANE: 3
	};

// Situation on road for the vehicle
// Given from "The Intelligent Driver Model: Analysis and
// Application to Adaptive Cruise Control"
TrafficState =
	{
		FREE_ROAD: 0, // drive freely, leading vehicle can be present
		UPSTREAM: 1, // arriving to congested traffic area
		JAM: 2, // vehicle move inside congested area
		DOWNSTREAM: 3, // vehicle is leaving congested area (hooray!)
		BOTTLENECK: 4 // vehicle before physical obstacle or on-ramp,
					  // it means driver has stop and wait when he/she can go on
	};

// State of moving, used for simulation and rendering
MovementState =
	{
		ON_TURN: 0,
		ON_ONRAMP: 1, // turn to another road
		ON_OFFRAMP: 2, // keep the same road, but changing lane
		ON_JUNCTION: 3, // stop and wait, velocity is 0
		FREE_MOVEMENT: 4
	};

const MINIMAL_GAP = 0.25;

// if vehicle has no leader or follower
const VIRTUAL_VEHICLE = -1;

// Used length units independent from actual visualization scale
// Updated after reading and parsing config files

const INVALID = -1;

var CAR_LENGTH = INVALID;
var CAR_WIDTH = INVALID;

var TRUCK_LENGTH = INVALID;
var TRUCK_WIDTH = INVALID;

var CAR_INITIAL_SPEED = 0.1;
var TRUCK_INITIAL_SPEED = 0.1;

// Safe distance it's a distance before road's end where vehicle moves slower
// before new map object ahead: junction/turn/etc.
// When vehicle has reached own safe distance on road, its traffic state become
// upstream.

// car has bigger safe distance, because usually has higher speed, than truck
var CAR_ROAD_SAFE_DISTANCE = 3 * CAR_LENGTH;
var TRUCK_ROAD_SAFE_DISTANCE = 2 * TRUCK_LENGTH;


function VehicleConfig(_type, _routeId, _uCoord, _initialSpeed, _laneId, _lane_type, _startX, _startY) {
	this.type = _type;
	this.routeId = _routeId;
	this.uCoord = _uCoord;
	this.speed = _initialSpeed;
	this.lane_id = _laneId;
	this.lane_type = _lane_type;

	let angle = 0;
	if (!is_vertical_road(roads[_routeId]))
		angle = 89;

	if (_lane_type == LaneType.forward)
		this.canvas_object = get_canvas_object(this.type,
			roads[_routeId].forwardLanes[_laneId].startX,
			roads[_routeId].forwardLanes[_laneId].startY,
			angle);
	else
		this.canvas_object = get_canvas_object(this.type,
			roads[_routeId].backwardLanes[_laneId].startX,
			roads[_routeId].backwardLanes[_laneId].startY,
			angle);

    draw_car(this.canvas_object);
}


function Vehicle(config) {
	// value from VehicleType
	this.type = config.type;
	this.lane_id = config.lane_id;
	this.lane_type = config.lane_type;
	this.canvas_object = config.canvas_object;

	this.speed = config.speed;
	this.acceleration = 0;

	// position along lane and it is independent of lane orientation
	// each vehicle just move alone lane and only renderer know how to present
	// this moving
	this.uCoord = 0; // u in UV coordinates

	// true if vehicle has reached end of map object it's moving on
	this.arrived = false;

	// coordinate used for turnes and lane change
	// this is position when vehicle moves not in a straight, but diagonally
	// by default, vehicle moves in the straight direction
	this.vCoord = 0; // v in UV coordinates


	this.turn_dx = 0;
	this.turn_dy = 0;

	this.hitBox = {
		leftBottom: new Point(0, 0),
		leftTop: new Point(0, 0),
		rigthBottom: new Point(0, 0),
		rightTop: new Point(0, 0)
	};

	// id of route this vehicle keeps to
	this.routeId = config.routeId;
	this.routeItemIndex = 0;

	this.freeRoadLongModel = null;
	this.upstreamLongModel = null;
	this.downstreamLongModel = null;
	this.jamLongModel = null;

	if (config.type == VehicleType.CAR) {
		this.length = CAR_LENGTH;
		this.safeDistance = CAR_ROAD_SAFE_DISTANCE;

		this.freeRoadLongModel = carFreeRoadIDM;
		this.upstreamLongModel = carUpstreamIDM;
		this.downstreamLongModel = carDownstreamIDM;
		this.jamLongModel = carJamIDM;
	}
	else {
		this.length = TRUCK_LENGTH;
		this.safeDistance = TRUCK_ROAD_SAFE_DISTANCE;

		this.freeRoadLongModel = truckFreeRoadIDM;
		this.upstreamLongModel = truckUpstreamIDM;
		this.downstreamLongModel = truckDownstreamIDM;
		this.jamLongModel = truckJamIDM;
	}

	// Default values
	this.vehicleState = VehicleState.MOVING;
	this.trafficState = TrafficState.FREE_ROAD;
	this.movementState = MovementState.FREE_MOVEMENT;

	// model used to simulate vehicle's behaviour on the road
	this.longModel = this.freeRoadLongModel;


	// model to define lane change decisions
	this.laneChangeModel = null;

	// vehicle before this one
	this.leader = null;

	// vehicle after this one
	this.follower = null;

	// calculated after vehicle will be added to the lane

	// leader on the lane from the left
	// if vehicle on the leftmost lane, these variables are not used
	this.leaderAtLeft = null;
	this.followerAtLeft = null;

	this.leaderAtRight = null;
	this.followerAtRight = null;

	// bases for vehicle's movement
	this.dx = 0;
	this.dy = 0;

	// calculated as turnElapsedTime / turnFullTime and used to get vehicle
	// coordinate on Bezier curve for rendering during turn
	this.turnCompletion = 0;

	this.turnElapsedTime = 0;
	this.turnFullTime = 0;

	this.turnX = 0;
	this.turnY = 0;
	this.turnAngle = 0;

	// lane where vehicle is turninng now
	this.turnLane = null;

	// lane where vehicle is moving on during lane change
	this.sourceLane = null;
}


Vehicle.prototype.stop = function (_uCoord) {
	this.uCoord = _uCoord;
	this.speed = this.acceleration = 0;
	this.vehicleState = VehicleState.IDLE;
};

Vehicle.prototype.prepareForTurn = function (turnFullTime, _turnLane) {
	vehicle.arrived = false;

	vehicle.uCoord = 0;

	this.trafficState = TrafficState.FREE_ROAD;
	this.vehicleState = VehicleState.TURNING;
	this.turnElapsedTime = 0;
	this.turnCompletion = 0;

	this.turnLane = _turnLane;
	this.turnFullTime = turnFullTime;
};

Vehicle.prototype.prepareForMove = function () {
	// TODO think about is free road state actual one?
	this.trafficState = trafficState.FREE_ROAD;
	this.vehicleState = VehicleState.MOVING;

	this.uCoord = 0;
	this.arrived = false;
};

// the minimal distance between bamper of current vehicle and the following one
Vehicle.prototype.getMinimalGap = function () {
	return this.length + MINIMAL_GAP;
};

Vehicle.prototype.farFrom = function (distance) {
	return (this.uCoord - this.length) > distance;
};

Vehicle.prototype.getSafeDistance = function () {
	return this.uCoord - this.length - MINIMAL_GAP;
};

Vehicle.prototype.getSafeSpace = function () {
	return this.uCoord + this.safeDistance;
};

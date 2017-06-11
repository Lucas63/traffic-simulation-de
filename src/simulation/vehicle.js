// type affects length, max and desired speed, etc.
var VehicleType =
{
	CAR : 0,
	TRUCK : 1
};

var VehicleState =
{
	MOVING: 0, // drive on straight road or passing through the junction
	TURNING: 1, // turning on Turn/Onramp/Offramp/Junction
	IDLE: 2, // vehicle stopped
	CHANGE_LANE : 3
};

// Situation on road for the vehicle
// Given from "The Intelligent Driver Model: Analysis and
// Application to Adaptive Cruise Control"
var TrafficState =
{
	FREE_ROAD : 0, // drive freely, leading vehicle can be present
	UPSTREAM : 1, // arriving to congested traffic area
	JAM : 2, // vehicle move inside congested area
	DOWNSTREAM : 3, // vehicle is leaving congested area (hooray!)
	BOTTLENECK : 4 // vehicle before physical obstacle or on-ramp,
				   // it means driver has stop and wait when he/she can go on
};

// State of moving, used for simulation and rendering
var MovementState =
{
	ON_TURN:       0,
	ON_ONRAMP:     1, // turn to another road
	ON_OFFRAMP:    2, // keep the same road, but changing lane
	ON_JUNCTION:   3, // stop and wait, velocity is 0
	FREE_MOVEMENT: 4
}

const MINIMAL_GAP = 2;

// if vehicle has no leader or follower
const VIRTUAL_VEHICLE = -1;


var virtualFreeRoadVehicle = null;
var virtualUpstreamVehicle = null;
var virtualDownstreamVehicle = null;
var virtualJamVehicle = null;


// Used length units independent from actual visualization scale
// Updated after reading and parsing config files

const INVALID = -1;

var CAR_LENGTH = INVALID;
var CAR_WIDTH  = 2;

var TRUCK_LENGTH = INVALID;
var TRUCK_WIDTH  = 3;

var CAR_DESIRED_SPEED   = INVALID;
var TRUCK_DESIRED_SPEED = INVALID;

var CAR_INITIAL_SPEED   = INVALID;
var TRUCK_INITIAL_SPEED = INVALID;

// Safe distance it's a distance before road's end where vehicle moves slower
// before new map object ahead: junction/turn/etc.
// When vehicle has reached own safe distance on road, its traffic state become
// upstream.

// car has bigger safe distance, because usually has higher speed, than truck
var CAR_ROAD_SAFE_DISTANCE = 3 * CAR_LENGTH;
var TRUCK_ROAD_SAFE_DISTANCE = 2 * TRUCK_LENGTH;


/*
 * Constructor-time function
 */
// virtual vehicles with different road_elements used for leading vehicle,
// namely the very first vehicle on each map object
function createVirtualVehicles()
{
	// TODO implement me!
}


function VehicleConfig( _type, _routeId, _uCoord, _initialSpeed )
{
	this.type     = _type;
	this.routeId  = _routeId;
	this.uCoord   = _uCoord;
	this.speed    = _initialSpeed;
}

function Vehicle( config )
{
	// value from VehicleType
	this.type = config.type;

	this.speed = config.speed;
	this.acceleration = 0;

	// position along lane and it is independent of lane orientation
	// each vehicle just move alone lane and only renderer know how to present
	// this moving
	this.uCoord = config.uCoord; // u in UV coordinates

	// true if vehicle has reached end of map object it's moving on
	this.arrived = false;

	// coordinate used for turnes and lane change
	// this is position when vehicle moves not in a straight, but diagonally
	// by default, vehicle moves in the straight direction
	this.vCoord = 0; // v in UV coordinates

	// Data for Renderer
	this.turnData = {
		"startX": 0, "startY": 0,
		"controlX": 0, "controlY": 0,
		"endX": 0, "endY": 0
	};

	// id of route this vehicle keeps to
	this.routeId = config.routeId;
	this.routeItemIndex = 0;

	if ( config.type == VehicleType.CAR )
	{
		this.length       = CAR_LENGTH;
		this.desiredSpeed = CAR_DESIRED_SPEED;
		this.safeDistance = CAR_ROAD_SAFE_DISTANCE;
	}
	else
	{
		this.length       = TRUCK_LENGTH;
		this.desiredSpeed = TRUCK_DESIRED_SPEED;
		this.safeDistance = TRUCK_ROAD_SAFE_DISTANCE;
	}

	// Default values
	this.vehicleState = VehicleState.MOVING;
	this.trafficState = TrafficState.FREE_ROAD;
	this.movementState = MovementState.FREE_MOVEMENT;

	// model used to simulate vehicle's behaviour on the road
	this.longitudinalModel = null;

	// model to define lane change decisions
	this.laneChangeModel = null;

	// vehicle before this one
	this.leader = null;

	// vehicle after this one
	this.follower = null;

	// calculated after vehicle will be added to the lane

	// leader on the lane from the left
	// if vehicle on the leftmost lane, these variables are not used
	this.leaderAtLeft   = null;
	this.followerAtLeft = null;

	this.leaderAtRight   = null;
	this.followerAtRight = null;

	// calculated as turnElapsedTime / turnFullTime and used to get vehicle
	// coordinate on Bezier curve for rendering during turn
	this.turnCompletion = 0;

	this.turnElapsedTime = 0;
	this.turnFullTime = 0;

	// lane on destination road where vehicle appeared after turn
	this.destinationLane = null;

	// lane where vehicle is moving on during lane change
	this.sourceLane = null;

	// information used for updating vehicle position
	this.laneIndex = -1;
}


Vehicle.prototype.stop = function( _uCoord )
{
	this.uCoord = _uCoord;
	this.speed = this.acceleration = 0;
	this.vehicleState = VehicleState.IDLE;
}

Vehicle.prototype.prepareForTurn = function(turnFullTime, _destinationLane)
{
	vehicle.arrived = false;

	vehicle.uCoord = 0;

	this.trafficState = TrafficState.FREE_ROAD;
	this.vehicleState = VehicleState.TURNING;
	this.turnElapsedTime = 0;
	this.turnCompletion = 0;

	this.destinationLane = _destinationLane;
	this.turnFullTime = turnFullTime;
}

Vehicle.prototype.prepareForMove = function()
{
	// TODO think about is free road state actual one?
	this.trafficState = trafficState.FREE_ROAD;
	this.vehicleState = VehicleState.MOVING;

	this.uCoord = 0;
	this.arrived = false;
}

// the minimal distance between bamper of current vehicle and the following one
Vehicle.prototype.getMinimalGap = function()
{
	return this.length + MINIMAL_GAP;
}

Vehicle.prototype.farFrom = function( distance )
{
	return (this.uCoord - this.length) > distance;
}

Vehicle.prototype.getSafeDistance = function()
{
	return this.uCoord - this.length - MINIMAL_GAP;
}

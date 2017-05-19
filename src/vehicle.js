// type affects length, max and desired speed, etc.
var VehicleType =
{
	CAR : 0,
	TRUCK : 1
}

var VehicleState =
{
	MOVING: 0, // drive on straight road or passing through the junction
	TURNING: 1, // turning on Turn/Onramp/Offramp/Junction
	IDLE: 2, // vehicle stopped
	CHANGE_LANE
}

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
}

// State of moving, used for simulation and rendering
var MovementState =
{
	ON_TURN:       0,
	ON_ONRAMP:     1, // turn to another road
	ON_OFFRAMP:    2, // keep the same road, but changing lane
	ON_JUNCTION:   3 // stop and wait, velocity is 0
	FREE_MOVEMENT: 4
}

// if vehicle has no leader or follower
const VIRTUAL_VEHICLE = -1;

// Used length units independent from actual visualization scale
// Updated after reading and parsing config files

const var INVALID = -1;

var CAR_LENGTH = INVALID;
var CAR_WIDTH  = INVALID;

var TRUCK_LENGTH = INVALID;
var TRUCK_WIDTH  = INVALID;

var CAR_DESIRED_SPEED   = INVALID;
var TRUCK_DESIRED_SPEED = INVALID;

var CAR_INITIAL_SPEED   = INVALID;
var TRUCK_INITIAL_SPEED = INVALID;

function VehicleConfig( _type, _routeId, _uCoord, _initialSpeed,
						_leader, _follower )
{
	this.type     = _type;
	this.routeId  = _routeId;
	this.uCoord   = _uCoord;
	this.speed    = _initialSpeed;
	this.leader   = _leader;
	this.follower = _follower;
}

function Vehicle( config )
{
	// value from VehicleType
	this.type = config.type;

	this.speed = config.speed;
	this.acceleration = 0;

	// index within array of vehicles, maybe not used yet
	this.position = _position;

	// position along lane and it is independent of lane orientation
	// each vehicle just move alone lane and only renderer know how to present
	// this moving
	this.uCoord = config.uCoord; // u in UV coordinates
// coordinate used for turnes and lane change
	// this is position when vehicle moves not in a straight, but diagonally
	// by default, vehicle moves in the straight direction
	this.vCoord = 0; // v in UV coordinates

	// id of route this vehicle keeps to
	this.routeId = config.routeId;
	this.routeItemIndex = 0;

	if ( config.type == VehicleType.CAR )
	{
	this.length       = CAR_LENGTH;
	this.desiredSpeed = CAR_DESIRED_SPEED;
	}
	else
	{
	this.length       = TRUCK_LENGTH;
	this.desiredSpeed = TRUCK_DESIRED_SPEED;
	}

	// Default values
	this.vehicleState = VehicleState.MOVING;
	this.trafficState = TrafficState.FREE_ROAD;
	this.movementState = MovementState.FREE_MOVEMENT;

	// model used to simulate vehicle's behaviour on the road
	this.longitudinalModel = null;

	// model to define lane change decisions
	this.laneChangeModel = null;

	// index of vehicle before this one
	this.leader = config.leader;

	// index of vehicle after this one
	this.follower = config.follower;

	// calculated after vehicle will be added to the lane

	// leader on the lane from the left
	// if vehicle on the leftmost lane, these variables are not used
	this.leaderAtLeft   = VIRTUAL_VEHICLE;
	this.followerAtLeft = VIRTUAL_VEHICLE;

	this.leaderAtRight   = VIRTUAL_VEHICLE;
	this.followerAtRight = VIRTUAL_VEHICLE;


	this.TargetLane = null;

	// calculated as turnElapsedTime / turnFullTime and used to get vehicle
	// coordinate on Bezier curve
	this.turnCompletion = 0;
	this.turnElapsedTime = 0;
	this.turnFullTime = 0;

	// lane on destination road where vehicle appeared after turn
	this.turnDestinationLane = 0;
}

Vehicle.prototype.update = function( dt )
{
	switch (this.vehicleState)
	{
		case VehicleState.MOVING:
			this.updateStraightMove( dt );
			break;

		case VehicleState.TURNING:
			this.updateTurn( dt );
			break;

		case VehicleState.CHANGE_LANE:
			this.updateLaneChange( dt );
			break;
	}
}

Vehicle.prototype.updateStraightMove = function( dt )
{
	// TODO implement me!
}

Vehicle.prototype.updateTurn = function( dt )
{
	this.turnElapsedTime += dt;
	this.turnCompletion = Math.max(this.turnElapsedTime / this.turnFullTime, 1);
}

Vehicle.prototype.updateLaneChange = function( dt )
{
	// TODO implement me!
}

function updateVehicles( vehicles, dt )
{
	vehicles.forEach( function(vehicle) {
		vehicle.update( dt );
	})
}

Vehicle.prototype.getMinimalGap()
{
	return this.length + MINIMAL_GAP;
}

Vehicle.prototype.farFrom( distance )
{
	return (this.uCoord - this.length) > distance;
}

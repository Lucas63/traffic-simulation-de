// type affects length, max and desired speed, etc.
var VehicleType =
{
	CAR : 0,
	TRUCK : 1
}

// Situation on road for the vehicle
// Given from "The Intelligent Driver Model: Analysis and
// Application to Adaptive Cruise Control"
var VehicleTrafficState =
{
	FREE_ROAD : 0, // drive freely, leading vehicle can be present
	UPSTREAM : 1, // arriving to congested traffic area
	JAM : 2, // vehicle move inside congested area
	DOWNSTREAM : 3, // vehicle is leaving congested area (hooray!)
	BOTTLENECK : 4 // vehicle before physical obstacle or on-ramp,
				   // it means driver has stop and wait when he/she can go on
}

// State of moving, used for simulation and rendering
var VehicleMoveState =
{
	MOVING : 0, // drive on straight road
	TURNING : 1, // turn to another road
	CHANGE_LANE : 2, // keep the same road, but changing lane
	STOPPING : 3 // stop and wait, velocity is 0
}

const NO_LEADER = -1;

// Used length units independent from actual visualization scale
const CAR_LENGTH = 4;
const CAR_WIDTH = 2;

const TRUCK_LENGTH = 12;
const TRUCK_WIDTH = 5;

const CAR_DESIRED_SPEED = 80;
const TRUCK_DESIRED_SPEED = 50;

const CAR_INITIAL_SPEED = 25;
const TRUCK_INITIAL_SPEED = 15;

function Car( _type, _position, _u_coord, _route_id,  _leader, _follower )
{
	// value from VehicleType
	this.type = _type;

	this.speed = 0;
	this.acceleration = 0;
	this.position = _position;

	// position along lane and it is independent of lane orientation
	// each vehicle just move alone lane and only renderer know how to present
	// this moving
	this.u_coord = _u_coord; // u in UV coordinates

	// coordinate used for turnes and lane change
	// this is position when vehicle moves not in a straight, but diagonally
	// by default, vehicle moves in the straight direction
	this.v_coord = 0; // v in UV coordinates

	// id of route this vehicle keeps to
	this.routeId = _route_id;

	if ( _type == VehicleType.CAR )
	{
		this.length = CAR_LENGTH;
		this.desiredSpeed = CAR_DESIRED_SPEED;
		this.initialSpeed = CAR_INITIAL_SPEED;
	}
	else
	{
		this.length = TRUCK_LENGTH;
		this.desiredSpeed = TRUCK_DESIRED_SPEED;
		this.initialSpeed = TRUCK_INITIAL_SPEED;
	}

	// Default values
	this.trafficState = VehicleTrafficState.FREE_ROAD;
	this.moveState = VehicleMoveState.MOVING;

	// model used to simulate vehicle's behaviour on the road
	this.longitudinalModel = null;

	// model to define lane change decisions
	this.laneChangeModel = null;

	// index of vehicle before this one
	this.leader = _leader;

	// index of vehicle after this one
	this.follower = _follower;

	// calculated after vehicle will be added to the lane

	// the same as leader, but for the lane from the left
	// if vehicle on the leftmost lane, these variables are not used
	this.leaderAtLeft = NO_LEADER;
	this.followerAtLeft = NO_LEADER;

	this.leaderAtRight = NO_LEADER;
	this.followerAtRight = NO_LEADER;
}

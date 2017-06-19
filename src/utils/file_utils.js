/**
 * Created by lucas63 on 25.05.17.
 */

function load_spawn_points() {
	let spawn_points = spawn_points_json.spawn_points;
	let array = [];

	for (let i = 0; i < spawn_points.length; i++) {
		let spawn_point_string = spawn_points[i];
		array.push(new SpawnPoint(
			spawn_point_string.id,
			spawn_point_string.min_period,
			spawn_point_string.max_period,
			spawn_point_string.truck_variability,
			spawn_point_string.route_id
		));
	}
	return array;
}


/*
 Function that reads road objects from src/config/roads.js and pushing them to roads array
 */
function load_road_configs() {
	//let LANE_WIDTH = 1;

	let road_configs = roads_json.roads;
	let roadConfigs = [];


	for (let i = 0; i < road_configs.length; i++) {
		let road_string = road_configs[i];

		let is_one_way = (road_string.backwardLanes == 0);

		let new_road = new RoadConfig(
			road_string.id,
			RoadDirection[road_string.direction],
			road_string.length,
			logic_lane_width,
			road_string.startX,
			road_string.startY,
			road_string.finishX,
			road_string.finishY,
			road_string.startConnection,
			road_string.finishConnection,

			get_lanes(
				i,
				road_string.startX,
				road_string.startY,
				road_string.finishX,
				road_string.finishY,
				road_string.length,
				road_string.forwardLanes,
				road_string.forwardLanesSpawnPoints,
				LaneType.forward,
				is_one_way,
				road_string.direction),

			get_lanes(
				i,
				road_string.startX,
				road_string.startY,
				road_string.finishX,
				road_string.finishY,
				road_string.length,
				road_string.backwardLanes,
				road_string.backwardLanesSpawnPoints,
				LaneType.backward,
				is_one_way,
				road_string.direction)
		);

		roadConfigs.push(new_road);
	}

	return roadConfigs;
}

function load_roads(rdCnfgs) {
	let roads = [];
	for (let i = 0; i < rdCnfgs.length; i++) {
		roads.push(new Road(rdCnfgs[i]));
	}
	return roads;
}

/*
 Function that reads turn objects from src/config/turns.js and pushing them to turns array
 */
function load_turns(roads) {
	let array = turn_json.turns;
	let turns = [];

	for (let i = 0; i < array.length; i++) {
		let turn_string = array[i];

		let new_turn = new Turn(
			i,
			roads[turn_string.source],
			roads[turn_string.destination],
			getBezierCurveLength
		);
		turns.push(new_turn);
	}
	return turns;
}


/*
 Function that reads turn objects from src/config/junctions.js and pushing them to turns array
 */
function load_junctions(roads) {
	let array = junctions_json.junctions;
	let junctions = [];
	let junction_side_length = 4;

	for (let i = 0; i < array.length; i++) {

		let junction_string = array[i];
		let related_roads = get_roads_connected_to_junction(junction_string.id, roads);

		let new_junction = new Junction
		(
			junction_string.id,
			get_center_coordinates(related_roads, i),
			junction_side_length,
			related_roads[0],
			related_roads[1],
			related_roads[2],
			related_roads[3],

			new TrafficLight(0, 0,
				junction_string.verticalTrafficLight.initialLight),

			new TrafficLight(0, 0,
				junction_string.horizontalTrafficLight.initialLight)
		);
		junctions.push(new_junction);
	}
	return junctions;
}

function load_onramps(roads) {
	let array = onramps_json.onramps;
	let onramps = [];

	let lanes_width = 2;
	let lanes_height = 4;

	for (let i = 0; i < array.length; i++) {

		let onramp_string = array[i];

		let new_onramp = new Onramp(
			roads[onramp_string.source],
			roads[onramp_string.destination],
			roads[onramp_string.inflow],
			logic_lane_width * lanes_height,
			logic_lane_width * lanes_width,
			LaneType.forward
		);
		onramps.push(new_onramp);
	}
	return onramps;
}


function load_offramps(roads) {
	let array = offramps_json.offramps;
	let offramps = [];

	let lanes_width = 2;
	let lanes_height = 4;

	for (let i = 0; i < array.length; i++) {

		let offramp_string = array[i];

		let new_offramp = new Offramp(
			roads[offramp_string.source],
			roads[offramp_string.destination],
			roads[offramp_string.outflow],
			logic_lane_width * lanes_height,
			logic_lane_width * lanes_width,
			LaneType.forward
		);
		offramps.push(new_offramp);
	}
	return offramps;
}


function load_vehicle_configuration() {
	let car_config = vehicles_json.car;

	CAR_LENGTH = car_config["length"];
	CAR_ROAD_SAFE_DISTANCE = 3 * CAR_LENGTH;
	CAR_WIDTH = car_config["width"];

	let carMinimumGap = car_config["minimum_gap"];

	let model = car_config["FreeMoveIDMModel"];

	let carFreeRoadConfig =
		new IDMVehicleConfig(model.desiredSpeed,
						  model.timeHeadway, carMinimumGap,
						  model.acceleration, model.deceleration);

	let carFreeRoadIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = car_config["UpstreamIDMModel"];
	let carUpstreamConfig =
		new IDMVehicleConfig(model.desiredSpeed,
						  model.timeHeadway, carMinimumGap,
						  model.acceleration, model.deceleration);

	let carUpstreamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = car_config["DownstreamIDMModel"];
	let carDownstreamConfig =
		new IDMVehicleConfig(model.desiredSpeed,
						  model.timeHeadway, carMinimumGap,
						  model.acceleration, model.deceleration);

	let carDownstreamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = car_config["JamIDMModel"];
	let carJamConfig =
		new IDMVehicleConfig(model.desiredSpeed,
			model.timeHeadway, carMinimumGap,
			model.acceleration,
			model.deceleration);

	let carJamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	createCarIDMModels(carFreeRoadConfig, carFreeRoadIdmConfig,
		carUpstreamConfig, carUpstreamIdmConfig,
		carDownstreamConfig, carDownstreamIdmConfig,
		carJamConfig, carJamIdmConfig);


	let truck_config = vehicles_json.truck;

	TRUCK_LENGTH = truck_config["length"];
	TRUCK_ROAD_SAFE_DISTANCE = 2 * TRUCK_LENGTH;
	TRUCK_WIDTH = truck_config["width"];

	let truckMinimumGap = truck_config["minimum_gap"];

	model = truck_config["FreeMoveIDMModel"];

	let truckFreeRoadConfig =
		new IDMVehicleConfig(model.desiredSpeed,
			model.timeHeadway, truckMinimumGap,
			model.acceleration,
			model.deceleration);

	let truckFreeRoadIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = truck_config["UpstreamIDMModel"];
	let truckUpstreamConfig =
		new IDMVehicleConfig(model.desiredSpeed,
			model.timeHeadway, truckMinimumGap,
			model.acceleration,
			model.deceleration);

	let truckUpstreamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = truck_config["DownstreamIDMModel"];
	let truckDownstreamConfig =
		new IDMVehicleConfig(model.desiredSpeed,
			model.timeHeadway, truckMinimumGap,
			model.acceleration,
			model.deceleration);

	let truckDownstreamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = truck_config["JamIDMModel"];
	let truckJamConfig =
		new IDMVehicleConfig(model.desiredSpeed,
			model.timeHeadway, truckMinimumGap,
			model.acceleration,
			model.deceleration);

	let truckJamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	createTruckIDMModels(truckFreeRoadConfig, truckFreeRoadIdmConfig,
		truckUpstreamConfig, truckUpstreamIdmConfig,
		truckDownstreamConfig, truckDownstreamIdmConfig,
		truckJamConfig, truckJamIdmConfig);
}

function load_routes() {
	let routes_config = routes_json.routes;
	let routes = [];

	for (let i = 0; i < routes_config.length; ++i)
		routes.push(new Route(routes_config[i].id, routes_config[i].items));

	return routes;
}

// -------------- UTILS --------------

/*
 function that finding roads related to specified junction(by its ID)

 return : @roads = { top_road, right_road, bottom_road, left_road};
 */
function get_roads_connected_to_junction(id_junction, roads) {

	let related_roads = [null, null, null, null];
	for (let i = 0; i < roads.length; i++) {

		if (roads[i].startConnection.type == "junction" &&
			roads[i].startConnection.id == id_junction) {
			switch (roads[i].direction) {
				case RoadDirection["UP_TO_BOTTOM"]:
					related_roads[2] = roads[i];
					break;
				case RoadDirection["BOTTOM_TO_UP"]:
					related_roads[0] = roads[i];
					break;
				case RoadDirection["LEFT_TO_RIGHT"]:
					related_roads[1] = roads[i];
					break;
				case RoadDirection["RIGHT_TO_LEFT"]:
					related_roads[3] = roads[i];
					break;
			}
		}
		else if (roads[i].finishConnection.type == "junction" &&
			roads[i].finishConnection.id == id_junction) {
			switch (roads[i].direction) {
				case RoadDirection["UP_TO_BOTTOM"]:
					related_roads[0] = roads[i];
					break;
				case RoadDirection["BOTTOM_TO_UP"]:
					related_roads[2] = roads[i];
					break;
				case RoadDirection["LEFT_TO_RIGHT"]:
					related_roads[3] = roads[i];
					break;
				case RoadDirection["RIGHT_TO_LEFT"]:
					related_roads[1] = roads[i];
					break;
			}
		}
	}

	return related_roads;
}

function get_center_coordinates(roads, id) {
	let X = 0;
	let Y = 0;

	for (let i = 0; i < roads.length; i++) {
		if (roads[i].startConnection.id == id) {
			X += roads[i].startX;
			Y += roads[i].startY;
		}
		else {
			X += roads[i].finishX;
			Y += roads[i].finishY;
		}
	}

	return [X / 4, Y / 4];
}

/*

 */
function get_lanes(road_id,sX, sY, fX, fY, length, lines_number,
				   spawn_points, lines_type, is_one_way, direction) {

	if (lines_number == 0)
		return [];


	let startX = sX;
	let startY = sY;
	let finishX = fX;
	let finishY = fY;
	let shift = ((is_one_way) ? -(lines_number / 2) * logic_lane_width + logic_lane_width / 2 : logic_lane_width / 2);


	if (lines_type == LaneType.backward) {
		[startX, finishX] = [finishX, startX];
		[startY, finishY] = [finishY, startY];
	}


	let is_direct = (direction == "LEFT_TO_RIGHT" || direction == "BOTTOM_TO_UP");
	let is_vertical = (direction == "UP_TO_BOTTOM" || direction == "BOTTOM_TO_UP");


	return get_specific_lanes(
		road_id,
		length,
		lines_type,
		lines_number,
		spawn_points,
		is_vertical,
		lines_type == LaneType.forward,
		is_direct,
		startX,
		startY,
		finishX,
		finishY);
}

function get_specific_lanes(road_id,
							length,
							type,
							lines_number,
							spawn_points,
							is_vertical, is_forward, is_direct,
							startX, startY, finishX, finishY) {

	/*
	 direct - for lanes placing relatevily to middle of road
	 BOTTOM_TO_UP - (1)
	 UP_TO_BOTTOM - (-1)
	 LEFT_TO_RIGHT - (1)
	 RIGHT_TO_LEFT - (-1)
	 */

	let way_multiplier = (is_direct) ? 1 : -1;
	let shift = (is_direct) ? logic_lane_width / 2 : -logic_lane_width / 2;

	let lanes = [];

	if (is_vertical) {
		if (is_forward) {
			for (let i = 0; i < lines_number; i++) {

				lanes.push(new Lane(
					length,
					type,
					get_spawn_point_by_id(spawn_points[i],road_id),
					startX + shift + way_multiplier * (  i * logic_lane_width),
					startY,
					finishX + shift + way_multiplier * ( i * logic_lane_width),
					finishY
				));
			}
		}
		else {
			for (let i = 0; i < lines_number; i++) {

				lanes.push(new Lane(
					length,
					type,
					get_spawn_point_by_id(spawn_points[i],road_id),
					startX - shift - way_multiplier * (i * logic_lane_width),
					startY,
					finishX - shift - way_multiplier * (i * logic_lane_width),
					finishY
				));
			}
		}
	}
	else {
		if (is_forward) {
			for (let i = 0; i < lines_number; i++) {
				lanes.push(new Lane(
					length,
					type,
					get_spawn_point_by_id(spawn_points[i],road_id),
					startX,
					startY + shift + way_multiplier * (  i * logic_lane_width),
					finishX,
					finishY + shift + way_multiplier * (  i * logic_lane_width)
				));
			}
		} else {
			for (let i = 0; i < lines_number; i++) {
				lanes.push(new Lane(
					length,
					type,
					get_spawn_point_by_id(spawn_points[i],road_id),
					startX,
					startY - way_multiplier * (i * logic_lane_width + logic_lane_width / 2),
					finishX,
					finishY - way_multiplier * (i * logic_lane_width + logic_lane_width / 2)
				));
			}
		}
	}

	return lanes;
}

function get_spawn_point_by_id(id, route_id) {
	if(id == null)
		return null;

	if (id < spawn_points.length) {
		if (spawn_points[id].routeId == route_id)
			return spawn_points[id];
	}

	return null;
}

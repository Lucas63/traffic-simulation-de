/**
 * Created by lucas63 on 25.05.17.
 */


/*
 Function that reads road objects from src/config/roads.js and pushing them to roads array
 */
function load_road_configs() {
	let LANE_WIDTH = 1;

	let array = roads_json.roads;
	let roadConfigs = [];


	for (let i = 0; i < array.length; i++) {
		let road_string = array[i];

		let is_one_way = (road_string.backwardLanes == 0);

		if (road_string.id == 3)
			console.log(">>>>> road id 3 <<<<<<");

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

		if (road_string.id == 3)
			console.log(">>>>> road id 3 <<<<<<");
		roadConfigs.push(new_road);
	}

	console.log(roadConfigs[0]);
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

		let new_junction = new Junction(
			junction_string.id,
			get_center_coordinates(related_roads, i),
			junction_side_length,
			related_roads[0],
			related_roads[1],
			related_roads[2],
			related_roads[3],
			junction_string.verticalTrafficLight,
			junction_string.horizontalTrafficLight
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
	CAR_WIDTH = car_config["width"];

	let carMinimumGap = car_config["minimum_gap"];

	let model = car_config["FreeMoveIDMModel"];

	let carFreeRoadConfig =
		new VehicleConfig(model.desiredSpeed,
			model.timeHeadway, carMinimumGap,
			model.acceleration,
			model.deceleration);

	let carFreeRoadIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = car_config["UpstreamIDMModel"];
	let carUpstreamConfig =
		new VehicleConfig(model.desiredSpeed,
			model.timeHeadway, carMinimumGap,
			model.acceleration,
			model.deceleration);

	let carUpstreamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = car_config["DownstreamIDMModel"];
	let carDownstreamConfig =
		new VehicleConfig(model.desiredSpeed,
			model.timeHeadway, carMinimumGap,
			model.acceleration,
			model.deceleration);

	let carDownstreamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = car_config["JamIDMModel"];
	let carJamConfig =
		new VehicleConfig(model.desiredSpeed,
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
	TRUCK_WIDTH = truck_config["width"];

	let truckMinimumGap = truck_config["minimum_gap"];

	model = truck_config["FreeMoveIDMModel"];

	let truckFreeRoadConfig =
		new VehicleConfig(model.desiredSpeed,
			model.timeHeadway, truckMinimumGap,
			model.acceleration,
			model.deceleration);

	let truckFreeRoadIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = truck_config["UpstreamIDMModel"];
	let truckUpstreamConfig =
		new VehicleConfig(model.desiredSpeed,
			model.timeHeadway, truckMinimumGap,
			model.acceleration,
			model.deceleration);

	let truckUpstreamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = truck_config["DownstreamIDMModel"];
	let truckDownstreamConfig =
		new VehicleConfig(model.desiredSpeed,
			model.timeHeadway, truckMinimumGap,
			model.acceleration,
			model.deceleration);

	let truckDownstreamIdmConfig =
		new IDMConfig(model.lambda_a, model.lambda_b, model.lambda_T);

	model = truck_config["JamIDMModel"];
	let truckJamConfig =
		new VehicleConfig(model.desiredSpeed,
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
function get_lanes(sX, sY, fX, fY, length, lines_number,
				   spawn_points, lines_type, is_one_way, direction) {

	if (lines_number == 0) {
		return null;
	}

	let startX = sX;
	let startY = sY;
	let finishX = fX;
	let finishY = fY;
	let shift = ((is_one_way) ? -(lines_number / 2) * logic_lane_width + logic_lane_width / 2 : logic_lane_width / 2);


	if (lines_type == LaneType.backward) {
		[startX, finishX] = [finishX, startX];
		[startY, finishY] = [finishY, startY];

		console.log("start X " + startX);
		console.log("start Y " + startY);
		console.log("finish X " + finishX);
		console.log("finish Y " + finishY);
	}


	let is_direct = (direction == "LEFT_TO_RIGHT" || direction == "BOTTOM_TO_UP");
	let is_vertical = (direction == "UP_TO_BOTTOM" || direction == "BOTTOM_TO_UP");


	return get_specific_lanes(
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

function get_specific_lanes(length,
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
	console.log("----------");
	console.log("type : " + type);
	console.log("lines_number : " + lines_number);
	console.log("is_vertical : " + is_vertical);
	console.log("is_forward : " + is_forward);
	console.log("is_direct : " + is_direct);

	let way_multiplier = (is_direct) ? 1 : -1;
	let shift = (is_direct) ? logic_lane_width / 2 : -logic_lane_width / 2;

	console.log("multiplier : " + way_multiplier);
	console.log("shift : " + shift);

	let lanes = [];

	if (is_vertical)
	{
		if (is_forward)
		{
			for (let i = 0; i < lines_number; i++)
			{
				console.log("vertical_forward");
				lanes.push(new Lane(
					length,
					type,
					spawn_points[i],
					startX + shift + way_multiplier * (  i * logic_lane_width),
					startY,
					finishX + shift +  way_multiplier * ( i * logic_lane_width),
					finishY
				));
			}
		}
		else
		{
			for (let i = 0; i < lines_number; i++)
			{
				console.log("vertical_backward");
				console.log("start Y " + startY + " finish Y " + finishY);
				lanes.push(new Lane(
					length,
					type,
					spawn_points[i],
					startX - shift - way_multiplier * (i * logic_lane_width),
					startY,
					finishX -shift - way_multiplier * (i * logic_lane_width),
					finishY
				));
			}
		}
	}
	else
	{
		if (is_forward)
		{
			for (let i = 0; i < lines_number; i++) {
				lanes.push(new Lane(
					length,
					type,
					spawn_points[i],
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
					spawn_points[i],
					startX,
					startY - way_multiplier * (i * logic_lane_width + logic_lane_width / 2),
					finishX,
					finishY - way_multiplier * (i * logic_lane_width + logic_lane_width / 2)
				));
			}
		}
	}

	console.log("----------");
	return lanes;
}

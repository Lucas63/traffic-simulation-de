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

        let new_road = new RoadConfig(
            road_string.id,
            road_string.direction,
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
    let array = onramps_json.junctions;
    let onramps = [];
    let junction_side_length = 4;

    for (let i = 0; i < array.length; i++) {

        let onramp_string = array[i];

        let new_junction = new Onramp(

        );
        junctions.push(new_junction);
    }
    return junctions;
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

    let model = truck_config["FreeMoveIDMModel"];

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

function load_routes()
{
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
                case "UP_TO_BOTTOM":
                    related_roads[2] = roads[i];
                    break;
                case "BOTTOM_TO_UP":
                    related_roads[0] = roads[i];
                    break;
                case "LEFT_TO_RIGHT":
                    related_roads[1] = roads[i];
                    break;
                case "RIGHT_TO_LEFT":
                    related_roads[3] = roads[i];
                    break;
            }
        }
        else if (roads[i].finishConnection.type == "junction" &&
            roads[i].finishConnection.id == id_junction) {
            switch (roads[i].direction) {
                case "UP_TO_BOTTOM":
                    related_roads[0] = roads[i];
                    break;
                case "BOTTOM_TO_UP":
                    related_roads[2] = roads[i];
                    break;
                case "LEFT_TO_RIGHT":
                    related_roads[3] = roads[i];
                    break;
                case "RIGHT_TO_LEFT":
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
    let furthest_length = logic_lane_width / 2 + ((is_one_way) ? lines_number / 2 : lines_number) - 1;


    if (lines_type == LaneType.backward) {
        [startX, finishX] = [finishX, startX];
        [startX, finishY] = [finishY, startY];
    }


    switch (direction) {
        case "UP_TO_BOTTOM":
            return get_specific_lanes(furthest_length, length, lines_type,
                lines_number, spawn_points, true, false, startX, startY, finishX, finishY);
        case "BOTTOM_TO_UP":
            return get_specific_lanes(furthest_length, length, lines_type,
                lines_number, spawn_points, true, true, startX, startY, finishX, finishY);
        case "LEFT_TO_RIGHT":
            return get_specific_lanes(furthest_length, length, lines_type,
                lines_number, spawn_points, false, true, startX, startY, finishX, finishY);
        case "RIGHT_TO_LEFT":
            return get_specific_lanes(furthest_length, length, lines_type,
                lines_number, spawn_points, false, false, startX, startY, finishX, finishY);
    }
}


function get_specific_lanes(furthest_length, length, type, lines_number, spawn_points, is_vertical, is_forward,
                            startX, startY, finishX, finishY) {
    let lanes = [];
    if (is_vertical) {
        if (is_forward) {
            for (let i = 0; i < lines_number; i++) {
                lanes.push(new Lane(
                    length,
                    type,
                    spawn_points[i],
                    startX + furthest_length - i * logic_lane_width,
                    startY,
                    finishX + furthest_length - i * logic_lane_width,
                    finishY
                ));
            }
        } else {
            for (let i = 0; i < lines_number; i++) {
                lanes.push(new Lane(
                    length,
                    type,
                    spawn_points[i],
                    startX - furthest_length + i * logic_lane_width,
                    startY,
                    finishX - furthest_length + i * logic_lane_width,
                    finishY
                ));
            }
        }
    } else {
        if (is_forward) {
            for (let i = 0; i < lines_number; i++) {
                lanes.push(new Lane(
                    length,
                    type,
                    spawn_points[i],
                    startX,
                    startY + furthest_length - i * logic_lane_width,
                    finishX,
                    finishY + furthest_length - i * logic_lane_width
                ));
            }
        } else {
            for (let i = 0; i < lines_number; i++) {
                lanes.push(new Lane(
                    length,
                    type,
                    spawn_points[i],
                    startX,
                    startY - furthest_length + i * logic_lane_width,
                    finishX,
                    finishY - furthest_length + i * logic_lane_width
                ));
            }
        }
    }
    return lanes;
}

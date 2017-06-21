/**
 * Created by lucas63 on 19.06.17.
 */

canvas = document.getElementById('canvas_map');
context = document.getElementById('canvas_map').getContext('2d');

function Renderer(_map) {
    this.map_object = _map;

    this.map_color = "";
    this.road_color = "";
    this.dotted_line_color = "";
    this.boiled_line_color = "";
    this.road_side_line_color = "";

    logger.messages.push(new Message(ActionType.CREATED,"Object renderer created",Renderer.name));
}


Renderer.prototype.draw_map = function () {
    render_map(this);

};


x = 10;
y = 10;

var x = 2;
Renderer.prototype.update_map = function () {

    context.clearRect(0, 0, canvas.width, canvas.height);

    //сontext.moveTo(0,0);
    this.draw_map();
    //context.restore();

    let lanes = null;

    let roads = this.map_object.roads;
    for (let i = 0; i < roads.length; ++i) {
        lanes = roads[i].forwardLanes;
        for (let j = 0; j < lanes.length; ++j)
            drawVehiclesOnLane(roads[i].forwardBases, lanes[j]);

        lanes = roads[i].backwardLanes;
        for (let j = 0; j < lanes.length; ++j)
            drawVehiclesOnLane(roads[i].backwardBases, lanes[j]);

    }

    let junctions = this.map_object.junctions;
    for (let i = 0; i < junctions.length; ++i){
        drawVehiclesOnJunction(junctions[i]);

        update_canvas_traffic_light(junctions[i].verticalTrafficLight.canvas_object);
        update_canvas_traffic_light(junctions[i].horizontalTrafficLight.canvas_object);

        draw_traffic_light(junctions[i].verticalTrafficLight.canvas_object);
        draw_traffic_light(junctions[i].horizontalTrafficLight.canvas_object);
    }

    let offramps = this.map_object.offramps;
    for (let i = 0; i < offramps.length; ++i) {
        drawVehiclesOnOfframp(offramps[i]);
    }

    let onramps = this.map_object.onramps;
    for (let i = 0; i < onramps.length; ++i) {
        drawVehiclesOnOnramp(onramps[i]);
    }

    let turns = this.map_object.turns;
    for (let i = 0; i < onramps.length; ++i) {
        drawVehiclesOnTurn(turns[i]);
    }
};

function drawVehiclesOnTurn(turn){
    let lanes = turn.lanes;

    for ( let i = 0; i < lanes.length; i++){
        drawTurningVehicles(lanes[i]);
    }

}

function drawVehiclesOnOnramp(onramp) {

    let lanes = onramp.forwardLanes;
    for (let i = 0; i < lanes.length; ++i)
        drawVehiclesOnLane(onramp.forwardBases, lanes[i]);

    lanes = onramp.backwardLanes;
    for (let i = 0; i < lanes.length; ++i)
        drawVehiclesOnLane(onramp.backwardBases, lanes[i]);

    lanes = onramp.turnLanes;
    for (let i = 0; i < lanes.length; ++i)
        drawTurningVehicles(lanes[i]);
}



function drawVehiclesOnOfframp(offramp) {

    let lanes = offramp.forwardLanes;
    for (let i = 0; i < lanes.length; ++i)
        drawVehiclesOnLane(offramp.forwardBases, lanes[i]);

    lanes = offramp.backwardLanes;
    for (let i = 0; i < lanes.length; ++i)
        drawVehiclesOnLane(offramp.backwardBases, lanes[i]);

    lanes = offramp.turnLanes;
    for (let i = 0; i < lanes.length; ++i)
        drawTurningVehicles(lanes[i]);
}


function drawVehiclesOnLane(bases, lane) {
    let canvas_object = null;

    let x = 0;
    let y = 0;

    let dx = bases.move_dx;
    let dy = bases.move_dy;

    for (let k = 0; k < lane.vehicles.length; k++) {
        let vehicle = lane.vehicles[k];

        x = lane.startX + dx * vehicle.uCoord;
        y = lane.startY + dy * vehicle.uCoord;

        update_canvas_car(vehicle.canvas_object, x, y, vehicle.angle);

        draw_car(vehicle.canvas_object);
    }
}

function drawTurningVehicles(lane) {
    let canvas_object = null;
    let vehicle = null;
    for (let i = 0; i < lane.vehicles.length; ++i) {
        vehicle = lane.vehicles[i];
        console.log("vehicle on junction" + vehicle);

        vehicle.canvas_object.angle = vehicle.turnAngle;
        update_canvas_car(vehicle.canvas_object,
            vehicle.turnX, vehicle.turnY);

        draw_car(vehicle.canvas_object);
    }
}

function drawVehiclesOnJunction(junction) {
    let road = junction.topRoad;
    drawVehiclesOnJunctionRoad(road);

    road = junction.rightRoad;
    drawVehiclesOnJunctionRoad(road);

    road = junction.bottomRoad;
    drawVehiclesOnJunctionRoad(road);

    road = junction.leftRoad;
    drawVehiclesOnJunctionRoad(road);
}

function drawVehiclesOnJunctionRoad(road) {
    let lanes = road.passLanes;
    for (let i = 0; i < lanes.length; ++i)
        drawVehiclesOnLane(road.bases, lanes[i]);

    lanes = road.turnRightLanes;
    for (let i = 0; i < lanes.length; ++i)
        drawTurningVehicles(lanes[i]);

    lanes = road.turnLeftLanes;
    for (let i = 0; i < lanes.length; ++i)
        drawTurningVehicles(lanes[i]);
}

// ------- UTILS

/*
 Creating canvas object for car
 */
function get_canvas_car(type, spawnX, spawnY, angle) {
    let img_string = 'sources/truck.ico';

    if (type == 0)
        img_string = 'sources/car.ico';

    let canvas_object = new Image();

    canvas_object.src = img_string;

    canvas_object.X = spawnX;
    canvas_object.Y = spawnY;

    canvas_object.width = 1;
    canvas_object.height = 1.5;
    canvas_object.angle = angle;

    return canvas_object;
}

function update_canvas_car(canvas_object, X, Y, angle) {
    canvas_object.X = X;
    canvas_object.Y = Y;
    canvas_object.angle = angle;
}


function get_canvas_traffic_light(spawnX, spawnY, angle, color,is_vertical) {
    let img_string = 'sources/';
    let canvas_object = new Image();

    canvas_object.color = color;
    canvas_object.is_vertical = is_vertical;

    switch(color){
        case TrafficLightColor.RED:
            img_string += 'red.png';

            break;
        case TrafficLightColor.YELLOW:
            img_string += 'yellow.png';
            break;
        case TrafficLightColor.GREEN:
            img_string += 'green.png';
            break;
    }

    canvas_object.src = img_string;

    canvas_object.X = spawnX;
    canvas_object.Y = spawnY;

    canvas_object.width = 1;
    canvas_object.height = 3;
    canvas_object.angle = angle;

    return canvas_object;
}


function update_canvas_traffic_light(canvas_object) {
    let img_string = 'sources/';

    switch(canvas_object.color){
        case TrafficLightColor.RED:
            img_string += 'red.png';

            break;
        case TrafficLightColor.YELLOW:
            img_string += 'yellow.png';
            break;
        case TrafficLightColor.GREEN:
            img_string += 'green.png';
            break;
    }

    canvas_object.src = img_string;
}
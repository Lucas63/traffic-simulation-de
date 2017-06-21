/**
 * Created by lucas63 on 11.06.17.
 */

logic_lane_width = 1;
logic_to_canvas_multiplier = null;
logic_junction_length = 4;

map_routes = [];

function Map(_roads, _junctions, _turns, _onramps, _offramps, _routes) {
    //print_function_start(Map.name);

    this.roads = _roads;
    this.junctions = _junctions;
    this.turns = _turns;
    this.onramps = _onramps;
    this.offramps = _offramps;
    //this.routes = _routes;
    map_routes = _routes;

    logger.messages.push(new Message(ActionType.CREATED,"Object map created",Map.name));
}


Map.prototype.get_road_lanes_with_car = function () {

    let array = [];

    for (let i = 0; i < this.roads.length; i++) {
        for( let j = 0; j < this.roads[i].forwardLanesAmount; j++){
            if(!this.roads[i].forwardLanes[j].vehicles == null){
                array.push(
                    [this.roads[i].forwardLanes[j].vehicles,
                        this.roads[i].forwardLanes[j]]);
            }
        }
    }

    for (let i = 0; i < this.roads.length; i++) {
        for( let j = 0; j < this.roads[i].backwardLanesAmount; j++){
            if(!this.roads[i].backwardLanes[j].vehicles.empty()){
                array.push(
                    [this.roads[i].backwardLanes[j].vehicles,
                        this.roads[i].backwardLanes[j]]);
            }
        }
    }

    return array;
};


Map.prototype.get_onramp_lanes_with_car = function () {

    let array = [];

    for (let i = 0; i < this.onramps.length; i++) {
        for( let j = 0; j < this.onramps[i].forwardLanesAmount; j++){
            if(!this.onramps[i].forwardLanes[j].vehicles.empty()){
                array.push(
                    [this.onramps[i].forwardLanes[j].vehicles,
                    this.onramps[i].forwardLanes[j]]);
            }
        }
    }

    for (let i = 0; i < this.onramps.length; i++) {
        for( let j = 0; j < this.onramps[i].backwardLanesAmount; j++){
            if(!this.onramps[i].backwardLanes[j].vehicles.empty()){
                array.push(
                    [this.onramps[i].backwardLanes[j].vehicles,
                    this.onramps[i].backwardLanes[j]]);
            }
        }
    }

    return array;
};



Map.prototype.get_offramp_lanes_with_car = function () {

    let array = [];

    for (let i = 0; i < this.offramps.length; i++) {
        for( let j = 0; j < this.offramps[i].forwardLanesAmount; j++){
            if(!this.offramps[i].forwardLanes[j].vehicles.empty()){
                array.push(
                    [this.offramps[i].forwardLanes[j].vehicles,
                        this.offramps[i].forwardLanes[j]]);
            }
        }
    }

    for (let i = 0; i < this.offramps.length; i++) {
        for( let j = 0; j < this.offramps[i].backwardLanesAmount; j++){
            if(!this.offramps[i].backwardLanes[j].vehicles.empty()){
                array.push(
                    [this.offramps[i].backwardLanes[j].vehicles,
                        this.offramps[i].backwardLanes[j]]);
            }
        }
    }

    for (let i = 0; i < this.offramps.length; i++) {
        for( let j = 0; j < this.offramps[i].turnLanes.length; j++){
            if(!this.offramps[i].turnLanes[j].vehicles.empty()){
                array.push(
                    [this.offramps[i].turnLanes[j].vehicles,
                        this.offramps[i].turnLanes[j]]);
            }
        }
    }

    return array;
};



Map.prototype.get_turn_lanes_with_car = function () {

    let array = [];

    for (let i = 0; i < this.turns.length; i++) {
        for( let j = 0; j < this.turns[i].lanes.length; j++){
            if(!this.turns[i].lanes[j].vehicles.empty()){
                array.push(
                    [this.turns[i].lanes[j].vehicles,
                        this.turns[i].lanes[j]]);
            }
        }
    }

    return array;
};


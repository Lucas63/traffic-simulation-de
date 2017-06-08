/**
 * Created by lucas63 on 25.05.17.
 */


/*
    Function that reads road objects from src/config/roads.js and pushing them to roads array
 */
function load_roads() {
    let LANE_WIDTH = 2;

    let array = roads_json.roads;
    let roadConfigs = [];

    for (let i = 0; i < array.length; i++) {
        let road_string = array[i];

        let new_road = new RoadConfig(
            road_string.id,
            road_string.direction,
            road_string.length,
            LANE_WIDTH,
            road_string.startX,
            road_string.startY,
            road_string.finishX,
            road_string.finishY,
            road_string.startConnection,
            road_string.finishConnection,
            road_string.forwardLanes,
            road_string.backwardLanes
        );
        roadConfigs.push(new_road);
    }
    return roadConfigs;
}


/*
 Function that reads turn objects from src/config/turns.js and pushing them to turns array
 */
function load_turns() {
    let array = turn_json.turns;
    let turns = [];
    let LINES_NUMBER = 4;

    for (let i = 0; i < array.length; i++) {
        let turn_string = array[i];

        let new_turn = new Turn(
            turn_string.id,
            turn_string.destination,
            turn_string.source,
            turn_string.type,
            LINES_NUMBER
        );
        turns.push(new_turn);
    }
    return turns;
}


/*
 Function that reads turn objects from src/config/turns.js and pushing them to turns array
 */
function load_turns() {
    let array = turn_json.turns;
    let turns = [];

    for (let i = 0; i < array.length; i++) {
        let turn_string = array[i];

        let new_turn = new Turn(
            turn_string.id,
            turn_string.destination,
            turn_string.source,
            turn_string.type,
            4
        );
        turns.push(new_turn);
    }
    return turns;
}








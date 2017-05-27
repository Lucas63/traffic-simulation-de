/**
 * Created by lucas63 on 25.05.17.
 */


/*
    Function that reads road objects from src/config/roads.js and pushing them to roads array
 */
function load_roads() {
    var array = roads_json.roads;
    var roads = [];

    for (var i = 0; i < array.length; i++) {
        var road_string = array[i];

        var new_road = new RoadConfig(
            road_string.id,
            road_string.direction,
            road_string.length,
            2,
            road_string.startX,
            road_string.startY,
            road_string.finishX,
            road_string.finishY,
            road_string.startConnection,
            road_string.finishConnection,
            road_string.forwardLanes,
            road_string.backwardLanes
        );
        roads.push(new_road);
    }
    return roads;
}


/*
 Function that reads turn objects from src/config/turns.js and pushing them to turns array
 */
function load_turns() {
    var array = turn_json.turns;
    var turns = [];

    for (var i = 0; i < array.length; i++) {
        var turn_string = array[i];

        var new_turn = new Turn(
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


/*
 Function that reads turn objects from src/config/turns.js and pushing them to turns array
 */
function load_turns() {
    var array = turn_json.turns;
    var turns = [];

    for (var i = 0; i < array.length; i++) {
        var turn_string = array[i];

        var new_turn = new Turn(
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






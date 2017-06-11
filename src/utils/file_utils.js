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

function load_roads(rdCnfgs){
    let roads  = [];
    for(let i = 0; i < rdCnfgs.length; i++){
        roads.push(new Road(rdCnfgs[i]));
    }
    console.log(roads);
    return roads;
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
 Function that reads turn objects from src/config/junctions.js and pushing them to turns array
 */
function load_junctions(rdConfigs) {
    let array = junctions_json.junctions;
    let junctions = [];
    let junction_side_length = 4;

    for (let i = 0; i < array.length; i++) {

        let junction_string = array[i];
        let roads = get_connected_to_junction_roads(junction_string.id,rdConfigs);
        console.log(junction_string);
        let new_junction = new Junction(
            junction_string.id,
            get_center_coordinates(roads,i),
            junction_side_length,
            roads[0],
            roads[1],
            roads[2],
            roads[3],
            junction_string.verticalTrafficLight,
            junction_string.horizontalTrafficLight
        );
        console.log(new_junction);
        junctions.push(new_junction);
    }
    return junctions;
}


// -------------- UTILS --------------

/*
function that finding roads related with specified junction(by its ID)

return : @roads = { top_road, right_road, bottom_road, left_road};
 */
function get_connected_to_junction_roads(id_junction,rdConfigs){
    let roads = [null,null,null,null];
    for(let i = 0; i < rdConfigs.length; i++){

        if(rdConfigs[i].startConnection.type == "junction" && rdConfigs[i].startConnection.id == id_junction){
            console.log("startconnection");
            switch(rdConfigs[i].type){
                case "UP_TO_BOTTOM":
                    roads[2] = rdConfigs[i];
                    break;
                case "BOTTOM_TO_UP":
                    roads[0] = rdConfigs[i];
                    break;
                case "LEFT_TO_RIGHT":
                    roads[3] = rdConfigs[i];
                    break;
                case "RIGHT_TO_LEFT":
                    roads[1] = rdConfigs[i];
                    break;
            }
            console.log("ddd");
        }
        else if (rdConfigs[i].finishConnection.type == "junction" && rdConfigs[i].finishConnection.id == id_junction){
            console.log("finishconnection");

            switch(rdConfigs[i].type){
                case "UP_TO_BOTTOM":
                    roads[0] = rdConfigs[i];
                    break;
                case "BOTTOM_TO_UP":
                    roads[2] = rdConfigs[i];
                    break;
                case "LEFT_TO_RIGHT":
                    roads[1] = rdConfigs[i];
                    break;
                case "RIGHT_TO_LEFT":
                    roads[3] = rdConfigs[i];
                    break;
            }
        }
    }

    return roads;
}


function get_center_coordinates(roads,id){
    let X = 0;
    let Y = 0;

    for(let i = 0; i < roads; i++){
        if(roads[i].startConnection.type == "junction" && roads[i].startConnection.id == id){
            X += roads[i].startX;
            Y += roads[i].startY;
        }
        else{
            X += roads[i].finishX;
            Y += roads[i].finishY;
        }
    }

    return [X/4,Y/4];
}
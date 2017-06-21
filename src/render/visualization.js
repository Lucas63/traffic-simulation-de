/**
 * Created by lucas63 on 27.05.17.
 */

/*


 */


/*
 @multiplier - variable that adjusting drawn map(diagram by @lucas63) to canvas size,
 converting proportion -> to pixels
 */
//var multiplier = 10;


/*
 @lane_width - width of one lane before multipling. On canvas canvas_lane_width = lane_width * multiplier
 */

//var lane_width = 1;

function render_map(renderer) {
    //print_function_start(render_map.name);

    //---- map properties
    draw_map();

    draw_forest();

    //---- draw roads
    draw_roads(renderer.map_object.roads);

    //---- draw junctions
    draw_junctions(renderer.map_object.junctions);

    //---- draw junctions
    draw_turns(renderer.map_object.turns);

    //---- draw junctions
    draw_onramps(renderer.map_object.onramps);

    //---- draw junctions
    draw_offramps(renderer.map_object.offramps);

    //print_function_end(render_map.name);
}

function draw_map() {
    canvas.style.backgroundColor = "lightyellow";

}


function draw_roads(roads) {

    for (let i = 0; i < roads.length; i++) {
        draw_road(roads[i]);
    }

}

function draw_junctions( junctions) {
    for (let i = 0; i < junctions.length; i++) {
        draw_junction( junctions[i]);
    }
}

function draw_turns( turns) {
    for (let i = 0; i < turns.length; i++) {
        draw_turn( turns[i]);
    }
}

function draw_onramps( onramps) {
    for (let i = 0; i < onramps.length; i++) {
        draw_onramp(onramps[i]);
    }
}

function draw_offramps( offramps) {
    for (let i = 0; i < offramps.length; i++) {
        draw_offramp(offramps[i]);
    }
}

function draw_forest() {

    for ( let i = 0 ; i < 8; i++){
        draw_tree(22 + i * 2.5,11);
        draw_tree(22 + i * 2.5,21);
        draw_tree(22 + i * 2.5,31);
        draw_tree(22 + i * 2.5,31);
    }

    for ( let i = 0 ; i < 14; i++){

        draw_tree(58 + i * 2.5,11);
    }


    for ( let i = 0 ; i < 14; i++){

        draw_tree(58 + i * 2.5,11);
    }

    for ( let i = 0 ; i < 5; i++) {

        draw_tree(58 + i * 2.5, 41);
        draw_tree(62 + i * 2.5, 21);
    }

}

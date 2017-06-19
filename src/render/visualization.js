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
    print_function_start(render_map.name);

    //---- map properties
    draw_map(renderer.canvas);

    //---- draw roads
    draw_roads(renderer.context, renderer.map_object.roads);

    //---- draw junctions
    draw_junctions(renderer.context, renderer.map_object.junctions);

    //---- draw junctions
    draw_turns(renderer.context, renderer.map_object.turns);

    //---- draw junctions
    draw_onramps(renderer.context, renderer.map_object.onramps);

    //---- draw junctions
    draw_offramps(renderer.context, renderer.map_object.offramps);

    print_function_end(render_map.name);
}

function draw_map(canvas,context) {
    canvas.style.backgroundColor = "lightyellow";

    draw_trees(context,53, 1, 91, 11);
    draw_trees(context,17, 1, 45, 11);
    draw_trees(context,17, 20, 45, 32);

}

function draw_roads(context, roads) {

    for (let i = 0; i < roads.length; i++) {
        draw_road(context, roads[i]);
    }

}

function draw_junctions(context, junctions) {
    for (let i = 0; i < junctions.length; i++) {
        draw_junction(context, junctions[i]);
    }
}

function draw_turns(context, turns) {
    for (let i = 0; i < turns.length; i++) {
        draw_turn(context, turns[i]);
    }
}

function draw_onramps(context, onramps) {
    for (let i = 0; i < onramps.length; i++) {
        draw_onramp(context, onramps[i]);
    }
}

function draw_offramps(context, offramps) {
    for (let i = 0; i < offramps.length; i++) {
        draw_offramp(context, offramps[i]);
    }
}

function draw_trees(context, startX, startY, finishX, finishY) {
    let object_number = Math.floor((Math.random() * 10) + 1);

    for (let i = 0; i < object_number; i++) {
        draw_tree(context, startX, startY, finishX, finishY);
    }
}

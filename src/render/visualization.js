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

function render_map(map){
    print_function_start(render_map.name);

    //---- map properties
    draw_map(map.context,map.canvas);

    //---- draw roads
    draw_roads(map.context,map.roads);

    //---- draw junctions
    draw_junctions(map.context,map.junctions);

    //---- draw junctions
    draw_turns(map.context,map.turns);

    //---- draw junctions
    draw_onramps(map.context,map.onramps);

    //---- draw junctions
    draw_offramps(map.context,map.offramps);

    print_function_end(render_map.name);
}

function draw_map(context,canvas){
    context.backgroundColor = "lightblue";
    //context.fillRect(0, 0, canvas.width, canvas.height);
}

function draw_roads(context,roads) {

    for(let i = 0; i< roads.length; i++){
        draw_road(context,roads[i]);
    }

}

function draw_junctions(context,junctions){
    for(let i = 0; i< junctions.length; i++){
        draw_junction(context,junctions[i]);
    }
}

function draw_turns(context,turns){
    for(let i = 0; i< turns.length; i++){
        draw_turn(context,turns[i]);
    }
}

function draw_onramps(context,onramps){
    for(let i = 0; i< onramps.length; i++){
        draw_onramp(context,onramps[i]);
    }
}

function draw_offramps(context,offramps){
    for(let i = 0; i< offramps.length; i++){
        draw_offramp(context,offramps[i]);
    }
}
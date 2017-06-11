/**
 * Created by lucas63 on 27.05.17.
 */

/*


 */


/*
@multiplier - variable that adjusting drawn map(diagram by @lucas63) to canvas size,
  converting proportion -> to pixels
 */
var multiplier = 10;


/*
 @lane_width - width of one lane before multipling. On canvas canvas_lane_width = lane_width * multiplier
 */

var lane_width = 1;

function render_map(){

    roadConfigs = load_road_configs();
    roads = load_roads(roadConfigs);


    console.log(roads);
    junctions = load_junctions(roads);

    var canvas = document.getElementById('canvas_map');
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');

        //---- map properties
        //draw_map(ctx);

        //---- test function, only for debug purposes
        test_function(ctx);

        //---- roads drawing
        draw_roads(ctx,roads);


        //---- turns drawing


    }

}

function draw_map(canvas){
    canvas.style.backgroundColor = '#AAAAAA';

}

function draw_roads(ctx,roadConfigs) {
    draw_message_separator();
    console.log("ROADS");
    draw_message_separator();

    for(let i = 0; i< roadConfigs.length; i++){
        console.log("road ("+i+")");

        draw_road(ctx,roadConfigs[i]);

        draw_message_separator();

    }


}

function draw_junctions(ctx,junctions){
    draw_message_separator();
    console.log("JUNCTIONS");
    draw_message_separator();

}

/*
Function used for testing of drawing objects
TODO: delete in production version
 */
function test_function(ctx) {



}
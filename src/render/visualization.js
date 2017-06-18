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
    console.log(map.context);
    console.log(map.canvas);

    //---- map properties
    draw_map(map.context,map.canvas);

    //---- roads drawing
    draw_roads(map.context,map.roads);


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

function draw_junctions(ctx,junctions){

}

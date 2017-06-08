/**
 * Created by lucas63 on 08.06.17.
 */


function draw_message_separator(){
    console.log("          ");
    console.log("----------");
    console.log("          ");
}

function print_road_object(type,is_vertical,startX,startY,width,height){
    console.log("direction : " + type);
    console.log("is vertical : " + is_vertical);
    console.log("road(X,Y,width,height)=(" + startX + "," + startY + "," + width + "," + height + ");");

}
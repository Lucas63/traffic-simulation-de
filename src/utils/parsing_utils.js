/**
 * Created by lucas63 on 27.05.17.
 */

/*

Function that deciding is road vertical or not 

 */
function is_vertical_road(road_direction){
    if(road_direction == "UP_TO_BOTTOM" || road_direction == "BOTTOM_TO_UP"){
        return true;
    }
    return false;
}

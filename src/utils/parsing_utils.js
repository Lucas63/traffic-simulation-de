/**
 * Created by lucas63 on 27.05.17.
 */

/*

Function that deciding is road vertical or not

 */
function is_vertical_road(road){
	if (road.type == RoadDirection["UP_TO_BOTTOM"] ||
		road.type == RoadDirection["BOTTOM_TO_UP"])
	{
		return true;
	}
	
	return false;
}

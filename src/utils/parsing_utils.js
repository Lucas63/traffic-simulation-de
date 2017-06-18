/**
 * Created by lucas63 on 27.05.17.
 */

/*

Function that deciding is road vertical or not

 */
function is_vertical_road(type){
	if (type == RoadDirection["UP_TO_BOTTOM"] || type == RoadDirection["BOTTOM_TO_UP"])
	{
		return true;
	}
	else if(type == RoadDirection["LEFT_TO_RIGHT"] || type == RoadDirection["RIGHT_TO_LEFT"]){
		return false
	}
	
	return null;
}

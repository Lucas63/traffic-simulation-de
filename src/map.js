/**
 * Created by lucas63 on 11.06.17.
 */

logic_lane_width = 1;
logic_to_canvas_multiplier = 10;

function Map(_roads, _junctions, _turns, _onramps, _offramps) {
    print_function_start(Map.name);

    this.roads = _roads;
    this.junctions = _junctions;
    this.turns = _turns;
    this.onramps = _onramps;
    this.offramps = _offramps;

    this.canvas = document.getElementById('canvas_map');
    this.context = this.canvas.getContext('2d');


    print_function_end(Map.name);
}
// конфигурация путекй вверх направо прямо
Map.prototype.render_map = function () {
    render_map(this);
};


/*

This function return object that matches given parameters
@type - {road,turn,offramp,onramp,junction}
@id - object ID in given array(NOT INDEX OF ARRAY!!)

 */
Map.prototype.get_map_object = function(type,id)
{
    switch(type){
        case "road":
            return this.get_object_from_array(roads,id);
        case "junction":
            return this.get_object_from_array(junctions,id);
        case "turn":
            return this.get_object_from_array(turns,id);
        case "offramp":
            return this.get_object_from_array(offramps,id);
    }
};

/*

This function searching for object in specified array by id
@array - given array of objects(junctions,roads,turns,offramps,onramps or etc)
@id - ID of object(NOT INDEX IN ARRAY!)

 */
Map.prototype.get_object_from_array = function(array,id){
    for(let i =0; i< array.length; i++){
        if(array[i].id == id){
            return array[i];
        }
    }
    return null;
};

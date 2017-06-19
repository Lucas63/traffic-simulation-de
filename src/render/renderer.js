/**
 * Created by lucas63 on 19.06.17.
 */

ctx = document.getElementById('canvas_map').getContext('2d');

function Renderer(_map){
	this.map_object = _map;

	this.canvas = document.getElementById('canvas_map');
	this.context = this.canvas.getContext('2d');

	this.map_color = "";
	this.road_color = "";
	this.dotted_line_color = "";
	this.boiled_line_color = "";
	this.road_side_line_color = "";


}

Renderer.prototype.draw_map = function(){
	render_map(this);
};

// конфигурация путекй вверх направо прямо
Renderer.prototype.update_map = function () {
	// console.log("updated_map");

	let on_roads = this.map_object.get_road_lanes_with_car();
	let on_onramps = this.map_object.get_onramp_lanes_with_car();
	let on_offramps = this.map_object.get_offramp_lanes_with_car();
	let on_turns = this.map_object.get_turn_lanes_with_car();

	for( let i = 0; i < on_roads.length; i++){

	}

	for( let i = 0; i < on_onramps.length; i++){

	}

	for( let i = 0; i < on_offramps.length; i++){

	}

	for( let i = 0; i < on_turns.length; i++){

	}
};


// ------- UTILS

/*

Creating canvas object for car

 */
function get_canvas_object(type, spawnX, spawnY){
	let img_string = 'sources/truck.ico';

	if(type == 0)
		img_string = 'sources/car.ico';

	let canvas_object = new Image();

	canvas_object.src = img_string;

	canvas_object.X = Math.random()*100;
	canvas_object.Y = Math.random()*100;

	canvas_object.width = 1;
	canvas_object.height = 1.5;

	//TODO : add parameter for angle or/and direction.

	/* TODO :
	 1. Get size from object
	 2. Get coordinates
	 3. Get direction of image
	 */

	canvas_object.onload = function() {
		ctx.drawImage(canvas_object,
			canvas_object.X * logic_to_canvas_multiplier,
			canvas_object.Y * logic_to_canvas_multiplier,
			canvas_object.width * logic_to_canvas_multiplier,
			canvas_object.height * logic_to_canvas_multiplier
		);
	};

	return canvas_object;
}

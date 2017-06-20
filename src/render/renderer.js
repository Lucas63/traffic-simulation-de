/**
 * Created by lucas63 on 19.06.17.
 */

canvas = document.getElementById('canvas_map');
context = document.getElementById('canvas_map').getContext('2d');

function Renderer(_map){
	this.map_object = _map;

	this.map_color = "";
	this.road_color = "";
	this.dotted_line_color = "";
	this.boiled_line_color = "";
	this.road_side_line_color = "";
}



Renderer.prototype.draw_map = function(){
	render_map(this);
	context.save();
};


x = 10;
y = 10;

var x = 2;
Renderer.prototype.update_map = function () {


	context.clearRect(0, 0, canvas.width, canvas.height);

	//сontext.moveTo(0,0);
	this.draw_map();
	//context.restore();


	let on_roads = this.map_object.get_road_lanes_with_car();
	let on_onramps = this.map_object.get_onramp_lanes_with_car();
	let on_offramps = this.map_object.get_offramp_lanes_with_car();
	let on_turns = this.map_object.get_turn_lanes_with_car();

	console.log(on_roads);
	// each road
	if(on_roads == null)
		return;
	for( let i = 0; i < on_roads.length; i++){
		let road = on_roads[i][1];
		// each lane
		console.log(road);
		if(road.backwardLanes == null)
			break;
		for( let j = 0; j < road.backwardLanes.length; j++){

			let lane = road.backwardLanes[j];
            console.log(lane);
			// each vehicle
			for( let k = 0; k < lane.vehicles.length; k++){

				let vehicle = lane.vehicles[k];
				console.log(vehicle);
				x +=2;
				console.log(x);
				let canvas_object = get_canvas_object(vehicle.type,x,10,45);
				//draw_car(canvas_object);
			}
		}


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
function get_canvas_object(type, spawnX, spawnY, angle)
{
	let img_string = 'sources/truck.ico';

	if(type == 0)
		img_string = 'sources/car.ico';

	let canvas_object = new Image();

	canvas_object.src = img_string;

	canvas_object.X = spawnX;
	canvas_object.Y = spawnY;

	canvas_object.width = 1;
	canvas_object.height = 1.5;
	canvas_object.angle = angle;

	return canvas_object;
}

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
	//this.draw_map();
	//context.save();
}



Renderer.prototype.draw_map = function(){
	render_map(this);

};


x = 10;
y = 10;

var x = 2;
Renderer.prototype.update_map = function () {


	context.clearRect(0, 0, canvas.width, canvas.height);

	//сontext.moveTo(0,0);
	this.draw_map();
	//context.restore();

	let lanes = null;

	let roads = this.map_object.roads;
	for (let i = 0; i < roads.length; ++i)
	{
		lanes = roads[i].forwardLanes;
		for (let j = 0; j < lanes.length; ++j)
			drawVehiclesOnLane(roads[i], roads[i].forwardBases, lanes[j]);

		lanes = roads[i].backwardLanes;
		for (let j = 0; j < lanes.length; ++j)
			drawVehiclesOnLane(roads[i], roads[i].backwardBases, lanes[j]);

	}

	let junctions = this.map_object.junctions;
	for (let i = 0; i < junctions.length; ++i)
	{
		drawVehiclesOnJunction(junctions[i]);
	}
};

function drawVehiclesOnLane( road, bases, lane )
{
	let canvas_object = null;

	let x =0;
	let y = 0;

	let dx = bases.move_dx;
	let dy = bases.move_dy;

	for (let k = 0; k < lane.vehicles.length; k++)
	{
		let vehicle = lane.vehicles[k];

		console.log("start X " + lane.startX);
		console.log("start Y " + lane.startY);

		console.log("u coord " + vehicle.uCoord);

		x = lane.startX + dx * vehicle.uCoord;
		y = lane.startY + dy * vehicle.uCoord;

		console.log("x = " + x);
		console.log("y = " + y);

		update_canvas_object(vehicle.canvas_object,x,y);

		draw_car(vehicle.canvas_object);
	}
}

function drawVehiclesOnJunction( junction )
{

}

// for (let i = 0; i < on_onramps.length; i++) {
//
// }
//
// for (let i = 0; i < on_offramps.length; i++) {
//
// }
//
// for (let i = 0; i < on_turns.length; i++) {
//
// }
// }
// ;


// ------- UTILS

/*

 Creating canvas object for car

 */
function get_canvas_object(type, spawnX, spawnY, angle) {
	let img_string = 'sources/truck.ico';

	if (type == 0)
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

function update_canvas_object(canvas_object,X,Y){
	console.log(canvas_object);
	canvas_object.X = X;
	canvas_object.Y = Y;
}

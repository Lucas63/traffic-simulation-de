/**
 * Created by lucas63 on 11.06.17.
 */

logger = null;
spawn_points = null;

roads = null;
junctions = null;
offramps = null;
onramps = null;
turns = null;

routes = null;

renderer = null;
road_engine = null;

//var start = 0;

//var counter = 0;
var requestId = null;

function step(timestamp)
{
	// if (counter > 600)
	// 	window.cancelAnimationFrame(requestId);
    //
	// ++counter;

	//let progress = timestamp - start;
	// progress = Math.round(progress);
	// progress /= 1000;
	//
	// start = timestamp;

	let progress = 0.05;

	road_engine.update(progress);
	renderer.update_map();

	window.requestAnimationFrame(step);
}

function load_objects() {
	//print_function_start(load_objects.name);
	logger = new Logger();


	load_vehicle_configuration();

	spawn_points = load_spawn_points();
	console.log(spawn_points);

	roads = load_roads(load_road_configs(), spawn_points);
	console.log(roads);

	junctions = load_junctions(roads);
	console.log(junctions);

	turns = load_turns(roads);
	console.log(turns);

	onramps = load_onramps(roads);
	console.log(onramps);

	offramps = load_offramps(roads);
	console.log(offramps);

	update_road_connections( roads );

	routes = load_routes();
	console.log(routes);

	let map = new Map(roads, junctions, turns, onramps, offramps,routes);

	renderer = new Renderer(map);
	road_engine = new RoadEngine(map);

	//print_function_end(load_objects.name);
}

function main() {
	//print_function_start(main.name);

	load_objects();

	renderer.draw_map();


	requestId = window.requestAnimationFrame(step);

	//print_function_end(main.name);
}

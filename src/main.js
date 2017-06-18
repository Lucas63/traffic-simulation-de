/**
 * Created by lucas63 on 11.06.17.
 */

spawn_points = null;

roads = null;
junctions = null;
offramps = null;
onramps = null;
turns = null;


function load_objects(){
	print_function_start(load_objects.name);

	load_vehicle_configuration();

	spawn_points = load_spawn_points();
	console.log(spawn_points);

	roads = load_roads(load_road_configs(),spawn_points);
	console.log(roads);

	junctions = load_junctions(roads);
	console.log(junctions);

	turns = load_turns(roads);
	console.log(turns);

	onramps = load_onramps(roads);
	console.log(onramps);

	offramps = load_offramps(roads);
	console.log(offramps);

	print_function_end(load_objects.name);
}

/*

Function that activating simulation by sequence of actions
1. Load objects
2. Create Map object
3. Render map objects

 */
function main(){
	print_function_start(main.name);

	load_objects();

	let map = new Map(roads,junctions,turns,onramps,offramps);

	map.render_map();

	print_function_end(main.name);
}

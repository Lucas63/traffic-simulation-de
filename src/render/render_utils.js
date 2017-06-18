/**
 * Created by lucas63 on 27.05.17.
 */


function draw_dotted_line(canvasContext, startX, startY, endX, endY, lineType) {
	startX *= logic_to_canvas_multiplier;
	startY *= logic_to_canvas_multiplier;
	endX *= logic_to_canvas_multiplier;
	endY *= logic_to_canvas_multiplier;

	canvasContext.beginPath();

	switch (lineType) {
		case "solid":

			canvasContext.setLineDash([60, 4]);
			canvasContext.strokeStyle = "#FF0000";
			canvasContext.lineWidth = 1.5;
			break;
		case "dotted":

			canvasContext.strokeStyle = '#256222';
			canvasContext.setLineDash([3, 4]);
			break;
		case "roadside":

			canvasContext.setLineDash([120, 4]);
			canvasContext.lineWidth = 2;
			break;
	}

	canvasContext.moveTo(startX, startY);
	canvasContext.lineTo(endX, endY);
	canvasContext.closePath();
	canvasContext.stroke();
}

function draw_road(context, road) {
	let is_vertical = is_vertical_road(road.direction);

	let startX = 0;
	let startY = 0;
	let width = 0;
	let height = 0;

	if (is_vertical) {
		startX = road.startX - road.getLanesAmount() / 2 * logic_lane_width;
		startY = road.startY;
		width = road.getLanesAmount() * logic_lane_width;
		height = road.finishY - road.startY;

	} else {
		startX = road.startX;
		startY = road.startY - road.getLanesAmount() / 2 * logic_lane_width;
		width = road.finishX - road.startX;
		height = road.getLanesAmount() * logic_lane_width;
	}

	startX *= logic_to_canvas_multiplier;
	startY *= logic_to_canvas_multiplier;
	width *= logic_to_canvas_multiplier;
	height *= logic_to_canvas_multiplier;


	context.beginPath();
	context.fillRect(startX, startY, width, height);
	context.closePath();
	context.stroke();
	draw_road_lines(context, road, is_vertical);
}

function draw_junction(context, junction) {

	let startX = (junction.centralPosition[0] - logic_junction_length / 2) * logic_to_canvas_multiplier;
	let startY = (junction.centralPosition[1] - logic_junction_length / 2) * logic_to_canvas_multiplier;
	let height = logic_junction_length * logic_to_canvas_multiplier;
	let width = logic_junction_length * logic_to_canvas_multiplier;
	context.beginPath();
	context.fillRect(
		startX,
		startY,
		height,
		width
	);
	context.fillStyle = '#8ED6FF';
	context.closePath();
	context.stroke();

}

function draw_turn(context, turn)
{
	let is_source_vertical = is_vertical_road(turn.source.direction);
	let is_destination_vertical = true;
	if (is_source_vertical)
		is_destination_vertical = false;


	console.log(is_source_vertical);
	console.log(is_destination_vertical);


	let startX1 = (is_source_vertical) ?
		turn.source.finishX + turn.source.getForwardLanesAmount() / 2 : turn.source.finishX;

	let startX2 = (is_source_vertical) ?
		turn.source.finishX - turn.source.getForwardLanesAmount() / 2 : turn.source.finishX;

	let startY1 = (!is_source_vertical) ?
		turn.source.finishY + turn.source.getForwardLanesAmount() / 2 : turn.source.finishY;

	let startY2 = (!is_source_vertical) ?
		turn.source.finishY - turn.source.getForwardLanesAmount() / 2 : turn.source.finishY;


	let finishX1 = (is_destination_vertical) ?
		turn.destination.startX + turn.destination.getForwardLanesAmount() / 2 : turn.destination.startX;

	let finishX2 = (is_destination_vertical) ?
		turn.destination.startX - turn.destination.getForwardLanesAmount() / 2 : turn.destination.startX;

	let finishY1 = (!is_destination_vertical) ?
		turn.destination.startY + turn.destination.getForwardLanesAmount() / 2 : turn.destination.startY;

	let finishY2 = (!is_destination_vertical) ?
		turn.destination.startY - turn.destination.getForwardLanesAmount() / 2 : turn.destination.startY;

	startX1 *= logic_to_canvas_multiplier;
	startX2 *= logic_to_canvas_multiplier;
	startY1 *= logic_to_canvas_multiplier;
	startY2 *= logic_to_canvas_multiplier;
	finishX1 *= logic_to_canvas_multiplier;
	finishX2 *= logic_to_canvas_multiplier;
	finishY1 *= logic_to_canvas_multiplier;
	finishY2 *= logic_to_canvas_multiplier;


	context.beginPath();
	context.moveTo(startX2, startY2);
	//context.lineTo(startX2,startY2);


	context.strokeStyle = "#FF0000";
	context.lineWidth = 1;

	if(turn.source.finishX > turn.destination.startX){
		if(turn.source.finishY > turn.destination.startY){


		} else{
			console.log("right + up");
			context.bezierCurveTo(finishX2,startY2,finishX2,startY2,finishX2,finishY2);
			context.lineTo(finishX1,finishY1);
			context.bezierCurveTo(finishX1,startY1,finishX1,startY1,startX1,startY1);
			context.fillStyle = "black";
			context.fill();
			context.closePath();
			context.stroke();


			context.moveTo( turn.source.finishX*logic_to_canvas_multiplier, turn.source.finishY*logic_to_canvas_multiplier);
			context.fillStyle = "#FF0000";
			context.bezierCurveTo(turn.destination.startX*logic_to_canvas_multiplier,
				turn.source.finishY*logic_to_canvas_multiplier,
				turn.destination.startX*logic_to_canvas_multiplier,
				turn.source.finishY*logic_to_canvas_multiplier,
				turn.destination.startX*logic_to_canvas_multiplier,
				turn.destination.startY*logic_to_canvas_multiplier);
			context.stroke();


		}
	}
	else{
		if(turn.source.finishY > turn.destination.startY){

		} else{

		}
	}
}

function draw_road_lines(context, rdCnfg, is_vertical) {

	is_one_way = (rdCnfg.backwardLanesAmount == 0);

	let lines_number = rdCnfg.forwardLanes.length;
	lines_number = is_one_way ? lines_number / 2 : lines_number;

	for (let i = 0; i < lines_number; i++) {

		let line_type = find_road_type(lines_number, i);
		if (is_vertical) {

			draw_dotted_line(
				context,
				rdCnfg.startX + i * logic_lane_width,
				rdCnfg.startY,
				rdCnfg.finishX + i * logic_lane_width,
				rdCnfg.finishY,
				line_type);

			draw_dotted_line(
				context,
				rdCnfg.startX - i * logic_lane_width,
				rdCnfg.startY,
				rdCnfg.finishX - i * logic_lane_width,
				rdCnfg.finishY,
				line_type);
		}
		else {
			draw_dotted_line(
				context,
				rdCnfg.startX,
				rdCnfg.startY + i * logic_lane_width,
				rdCnfg.finishX,
				rdCnfg.finishY + i * logic_lane_width,
				line_type);

			draw_dotted_line(
				context,
				rdCnfg.startX,
				rdCnfg.startY - i * logic_lane_width,
				rdCnfg.finishX,
				rdCnfg.finishY - i * logic_lane_width,
				line_type);
		}

	}
}


// -------------- UTILS --------------

function find_road_type(lines_number, line) {
	switch (line) {
		case 0:
			return "solid";
			break;
		case lines_number:
			return "roadside";
			break;
		default:
			return "dotted";
	}
}

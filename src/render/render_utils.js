/**
 * Created by lucas63 on 27.05.17.
 */


function draw_dotted_line(startX, startY, endX, endY, lineType) {
	startX *= logic_to_canvas_multiplier;
	startY *= logic_to_canvas_multiplier;
	endX *= logic_to_canvas_multiplier;
	endY *= logic_to_canvas_multiplier;

	//context.beginPath();

	switch (lineType) {
		case "solid":

			context.setLineDash([60, 4]);
			context.strokeStyle = "#FF0000";
			context.lineWidth = 1.5;
			break;
		case "dotted":

			context.strokeStyle = '#256222';
			context.setLineDash([3, 4]);
			break;
		case "roadside":

			canvasContext.setLineDash([120, 4]);
			canvasContext.lineWidth = 2;
			break;
	}

	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
	//context.closePath();
	context.stroke();
}

function draw_road(road) {
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
	context.fillStyle = '#000000';
	context.fillRect(startX, startY, width, height);
	context.closePath();
	context.stroke();
	draw_road_lines(road, is_vertical);
}

function draw_junction(junction)
{
	let startX = (junction.centralPosition[0] - logic_junction_length / 2) * logic_to_canvas_multiplier;

	let startY = (junction.centralPosition[1] - logic_junction_length / 2) * logic_to_canvas_multiplier;

	let height = logic_junction_length * logic_to_canvas_multiplier;
	let width = logic_junction_length * logic_to_canvas_multiplier;

	context.beginPath();
	context.fillStyle = '#e0840b';
	context.fillRect(
		startX,
		startY,
		height,
		width
	);
	context.closePath();
}

function draw_turn(turn) {
	let is_source_vertical = is_vertical_road(turn.source.direction);
	let is_destination_vertical = is_vertical_road(turn.destination.direction);


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
	context.strokeStyle = "#FF0000";
	context.lineWidth = 1;


	if (turn.source.finishX > turn.destination.startX) {
		if (turn.source.finishY > turn.destination.startY) {

			context.moveTo(startX1, startY1);
			context.lineTo(startX2, startY2);
			context.bezierCurveTo(finishX2, startY2, finishX2, startY2, finishX2, finishY2);
			context.lineTo(finishX1, finishY1);
			context.bezierCurveTo(finishX1, startY1, finishX1, startY1, startX1, startY1);
		}
		else {
			if (!is_source_vertical) {
				context.moveTo(startX1, startY1);
				context.lineTo(startX2, startY2);
				context.bezierCurveTo(finishX2, startY2, finishX2, startY2, finishX2, finishY2);
				context.lineTo(finishX1, finishY1);
				context.bezierCurveTo(finishX1, startY1, finishX1, startY1, startX1, startY1);
			}

			else {

				context.moveTo(startX1, startY1);
				context.lineTo(startX2, startY2);
				context.bezierCurveTo(startX2, finishY2, startX2, finishY2, finishX2, finishY2);
				context.lineTo(finishX1, finishY1);
				context.bezierCurveTo(startX1, finishY1, startX1, finishY1, startX1, startY1);
			}
		}
	}

	else {
		if (turn.source.finishY > turn.destination.startY) {
			context.moveTo(startX1, startY1);
			context.lineTo(startX2, startY2);
			context.bezierCurveTo(finishX2, startY2, finishX2, startY2, finishX2, finishY2);
			context.lineTo(finishX1, finishY1);
			context.bezierCurveTo(finishX1, startY1, finishX1, startY1, startX1, startY1);
		}

		else {
			context.moveTo(startX1, startY1);
			context.lineTo(startX2, startY2);
			context.bezierCurveTo(finishX2, startY2, finishX2, startY2, finishX2, finishY2);
			context.lineTo(finishX1, finishY1);
			context.bezierCurveTo(finishX1, startY1, finishX1, startY1, startX1, startY1);
		}
	}


	context.fillStyle = "black";
	context.fill();
	context.closePath();
	context.stroke();


	if (!is_source_vertical) {
		context.moveTo(turn.source.finishX * logic_to_canvas_multiplier, turn.source.finishY * logic_to_canvas_multiplier);
		context.fillStyle = "green";
		context.bezierCurveTo(turn.destination.startX * logic_to_canvas_multiplier,
			turn.source.finishY * logic_to_canvas_multiplier,
			turn.destination.startX * logic_to_canvas_multiplier,
			turn.source.finishY * logic_to_canvas_multiplier,
			turn.destination.startX * logic_to_canvas_multiplier,
			turn.destination.startY * logic_to_canvas_multiplier);

	}
	else {
		context.moveTo(turn.source.finishX * logic_to_canvas_multiplier,
			turn.source.finishY * logic_to_canvas_multiplier);

		context.fillStyle = "green";

		context.bezierCurveTo(turn.source.finishX * logic_to_canvas_multiplier,
			turn.destination.startY * logic_to_canvas_multiplier,
			turn.source.finishX * logic_to_canvas_multiplier,
			turn.destination.finishY * logic_to_canvas_multiplier,
			turn.destination.startX * logic_to_canvas_multiplier,
			turn.destination.startY * logic_to_canvas_multiplier);
	}

	context.stroke();
	context.closePath();
}


function draw_onramp(onramp) {
	let onramp_width = logic_lane_width * onramp.source.getForwardLanesAmount();
	let onramp_height = logic_lane_width * onramp.inflow.getLanesAmount();
	let startX = 0;
	let startY = 0;

	if (is_vertical_road(onramp.source.direction)) {
		startY = onramp.source.finishY;
		startX = onramp.destination.startX - onramp_height / 2;
	}

	onramp_height *= logic_to_canvas_multiplier;
	onramp_width *= logic_to_canvas_multiplier;

	startX *= logic_to_canvas_multiplier;
	startY *= logic_to_canvas_multiplier;

	context.beginPath();
	context.moveTo(startX, startY);
	context.fillStyle = "#8ED6FF";
	context.fillRect(startX, startY, onramp_width, onramp_height);
	context.closePath();
	context.stroke();
}

function draw_offramp(offramp) {

	let startX = 0;
	let startY = 0;
	let offramp_width = 0;
	let offramp_height = 0;

	if (is_vertical_road(offramp.source.direction)) {
		startX = offramp.source.finishX - offramp.source.getForwardLanesAmount() * logic_lane_width / 2;
		startY = offramp.source.finishY;

		offramp_width = offramp.source.getForwardLanesAmount() * logic_lane_width;
		offramp_height = offramp.outflow.getForwardLanesAmount() * logic_lane_width;

	}
	else {
		startX = offramp.source.finishX;
		startY = offramp.source.finishY - offramp.source.getLanesAmount() * logic_lane_width / 2;

		offramp_width = offramp.source.getLanesAmount() * logic_lane_width / 2;
		offramp_height = offramp.outflow.getLanesAmount() * logic_lane_width;


	}

	startX *= logic_to_canvas_multiplier;
	startY *= logic_to_canvas_multiplier;

	offramp_width *= logic_to_canvas_multiplier;
	offramp_height *= logic_to_canvas_multiplier;


	context.beginPath();
	context.moveTo(startX, startY);
	context.fillStyle = "#0da00b";
	context.fillRect(startX, startY, offramp_width, offramp_height);

	context.closePath();
	context.stroke();

}

function draw_road_lines(rdCnfg, is_vertical) {

	is_one_way = (rdCnfg.backwardLanesAmount == 0);

	let lines_number = rdCnfg.forwardLanes.length;
	lines_number = is_one_way ? lines_number / 2 : lines_number;

	for (let i = 0; i < lines_number; i++) {

		let line_type = find_road_type(lines_number, i);
		if (is_vertical) {

			draw_dotted_line(
				rdCnfg.startX + i * logic_lane_width,
				rdCnfg.startY,
				rdCnfg.finishX + i * logic_lane_width,
				rdCnfg.finishY,
				line_type);

			draw_dotted_line(
				rdCnfg.startX - i * logic_lane_width,
				rdCnfg.startY,
				rdCnfg.finishX - i * logic_lane_width,
				rdCnfg.finishY,
				line_type);
		}
		else {
			draw_dotted_line(
				rdCnfg.startX,
				rdCnfg.startY + i * logic_lane_width,
				rdCnfg.finishX,
				rdCnfg.finishY + i * logic_lane_width,
				line_type);

			draw_dotted_line(
				rdCnfg.startX,
				rdCnfg.startY - i * logic_lane_width,
				rdCnfg.finishX,
				rdCnfg.finishY - i * logic_lane_width,
				line_type);
		}

	}
}

function draw_tree(startX, startY, finishX, finishY) {
	let windowX = finishX - startX;
	let windowY = finishY - startY;

	let X = Math.floor((Math.random() * windowX) + startX);
	let Y = Math.floor((Math.random() * windowY) + startY);

	let image_source = 'sources/top.png';

	var img = new Image();
	img.onload = function () {
		context.drawImage(img,
			X * logic_to_canvas_multiplier,
			Y * logic_to_canvas_multiplier,
			2 * logic_to_canvas_multiplier,
			4 * logic_to_canvas_multiplier
		);
	};
	img.src = image_source;//'https://mdn.mozillademos.org/files/5395/backdrop.png';
}

function draw_car(canvas_object) {

	//context.save();
	//context.translate(canvas_object.X * logic_to_canvas_multiplier, canvas_object.Y * logic_to_canvas_multiplier);
	// context.rotate(canvas_object.angle * Math.PI / 180);
	//context.rotate(canvas_object.angle);

	// console.log(canvas_object.X * logic_to_canvas_multiplier);
	// console.log(canvas_object.Y * logic_to_canvas_multiplier);


	context.drawImage(canvas_object,
		(canvas_object.X)* logic_to_canvas_multiplier,
		(canvas_object.Y) * logic_to_canvas_multiplier,
		canvas_object.width * logic_to_canvas_multiplier,
		canvas_object.height * logic_to_canvas_multiplier);
	//context.restore();

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

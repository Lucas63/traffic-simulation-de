/**
 * Created by lucas63 on 27.05.17.
 */


function draw_dotted_line(canvasContext, startX,startY,endX,endY,lineType) {
	startX *= multiplier;
	startY *= multiplier;
	endX *= multiplier;
	endY *= multiplier;

	canvasContext.beginPath();

	switch(lineType){
		case "solid":
			console.log("solid");
			canvasContext.setLineDash([60, 4]);
			canvasContext.strokeStyle="#FF0000";
			break;
		case "dotted":
			console.log("dotted");
			canvasContext.strokeStyle = '#256222';
			canvasContext.setLineDash([3, 4]);
			break;
		case "roadside":
			console.log("roadside");
			canvasContext.setLineDash([120, 4]);
			canvasContext.lineWidth=2;
			break;
	}

	canvasContext.moveTo(startX,startY);
	canvasContext.lineTo(endX,endY);
	canvasContext.stroke();
}

function draw_road(ctx, road) {

	let is_vertical = is_vertical_road(road);

	let startX = 0;
	let startY = 0;
	let width = 0;
	let height = 0;

	if (is_vertical) {
		startX = road.startX - road.forwardLanes * lane_width;
		startY = road.startY;
		width =  2* road.forwardLanes * lane_width;
		height = road.finishY - road.startY;

	} else {
		startX = road.startX;
		startY = road.startY - road.forwardLanes * lane_width;
		width = road.finishX - road.startX;
		height =  2* road.forwardLanes * lane_width;
	}

	startX *= multiplier;
	startY *= multiplier;
	width *= multiplier;
	height *= multiplier;

	ctx.fillRect(startX, startY, width, height);
	draw_road_lines(ctx,road,is_vertical);
	print_road_object(road.direction,is_vertical,startX,startY,width,height);
}

function draw_road_lines(ctx,rdCnfg,is_vertical){
	let lines_number = rdCnfg.forwardLanes;

	for(let i = 0; i < lines_number+1; i++){

	   let line_type = find_road_type(lines_number,i);
	   if(is_vertical){

		   draw_dotted_line(
			   ctx,
			   rdCnfg.startX+i*lane_width,
			   rdCnfg.startY,
			   rdCnfg.finishX+i*lane_width,
			   rdCnfg.finishY,
			   line_type);

		   draw_dotted_line(
			   ctx,
			   rdCnfg.startX-i*lane_width,
			   rdCnfg.startY,
			   rdCnfg.finishX-i*lane_width,
			   rdCnfg.finishY,
			   line_type);
	   }
	   else{
		   draw_dotted_line(
			   ctx,
			   rdCnfg.startX,
			   rdCnfg.startY+i*lane_width,
			   rdCnfg.finishX,
			   rdCnfg.finishY+i*lane_width,
			   line_type);

		   draw_dotted_line(
			   ctx,
			   rdCnfg.startX,
			   rdCnfg.startY-i*lane_width,
			   rdCnfg.finishX,
			   rdCnfg.finishY-i*lane_width,
			   line_type);
	   }

	}
}


// -------------- UTILS --------------

function find_road_type(lines_number,line){
	switch(line){
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

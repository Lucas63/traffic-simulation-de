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

function draw_turn(context, turn) {
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

}


function draw_onramp(context, onramp) {
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

function draw_offramp(context, offramp) {

    let startX = 0;
    let startY = 0;
    let offramp_width = 0;
    let offramp_height = 0;

    if (is_vertical_road(offramp.source.direction)) {
        console.log("test");
        startX = offramp.source.finishX - offramp.source.getForwardLanesAmount()*logic_lane_width/2;
        startY = offramp.source.finishY;

        offramp_width = offramp.source.getForwardLanesAmount()*logic_lane_width;
        offramp_height = offramp.outflow.getForwardLanesAmount()*logic_lane_width;

    }
    else {
        console.log("test");
        startX = offramp.source.finishX ;
        startY = offramp.source.finishY - offramp.source.getLanesAmount()*logic_lane_width/2;

        offramp_width = offramp.source.getLanesAmount()*logic_lane_width/2;
        offramp_height = offramp.outflow.getLanesAmount()*logic_lane_width;


    }

    startX *= logic_to_canvas_multiplier;
    startY *= logic_to_canvas_multiplier;

    offramp_width *= logic_to_canvas_multiplier;
    offramp_height *= logic_to_canvas_multiplier;


    context.beginPath();
    context.moveTo(startX, startY);
    context.fillStyle = "#8ED6FF";
    context.fillRect(startX, startY, offramp_width, offramp_height);
    context.closePath();
    context.stroke();

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

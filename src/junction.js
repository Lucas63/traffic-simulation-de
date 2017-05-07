
// Each junction has 4 sides identified by numbers
// and 2 traffic lights: vertical and horizontal.

/*
Number represents each side of the junction
		 0
	 ――――――――――
	|          |
	|          |
  3 |          | 1
	|          |
	|          |
	 ――――――――――
		 2
*/

var JunctionSides =
{
	"top"   : 0,
	"right" : 1,
	"bottom": 2,
	"left"  : 3
}

function Junction( _id, _pos, _width,
				   _verticalTrafficLight,
				   _horizontalTrafficLight)
{
	this.id = _id;
	this.centralPosition = _pos;
	this.width = _width;

	this.verticalTrafficLight = _verticalTrafficLight;
	this.horizontalTrafficLight = _horizontalTrafficLight;
}

Junction.prototype.addRoadToSide( _side, _road )
{
    switch(_side)
    {
    case JunctionSides["top"]:
        this.connectedRoads["top"] = _road;
        break;

    case JunctionSides["right"]:
        this.connectedRoads["right"] = _road;
        break;

    case JunctionSides["bottom"]:
        this.connectedRoads["bottom"] = _road;
        break;

    case JunctionSides["left"]:
        this.connectedRoads["left"] = _road;
        break;

    default:
        console.log("Unknown junction side " + _side + "!!!");
        return false;
    }
}

Junction.prototype.getSideForRoad( roadID )
{
	switch ( roadID ) {
	case this.connectedRoads["top"]:
		return JunctionSides["top"];

	case this.connectedRoads["right"]:
		return JunctionSides["right"];

	case this.connectedRoads["bottom"]:
		return JunctionSides["bottom"];

	case this.connectedRoads["left"]:
		return JunctionSides["left"];

	default:
		console.log("Road with id " + roadID + "is not connected to junction "
					+ "with id " + this.id);
		return null;
	}
}

Junction.prototype.findMoveFromRoad = function( fromRoadId, toRoadId )
{
    fromRoadSide = this.getSideForRoad( fromRoadId );
    toRoadSide = this.getSideForRoad( toRoadId );
}

// return LaneDirection.FORWARD if vehicle turn from *currentRoadId*
// to forward lane of *newRoadId*
// return LaneDirection.BACKWARD if vehicle turn from *currentRoadId*
// to backward lane of *newRoadId*
// if cannot turn, return null
Junction.prototype.turnToLane = function( currentRoadId, newRoadId)
{
	// it's impossible to turn
	if (currentRoadId == newRoadId)
	{
		return null;
	}

	let side = this.getSideForRoad( newRoadId );
	if (side == null)
	{
		return null;
	}

	// TODO add logic to select lanes for turn
}

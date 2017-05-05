
// Each junction has 4 sides identified by numbers
// and 2 traffic lights: vertical and horizontal.

/*
Number represents each side of the junction
		 0
	――――――――――――
	|          |
	|          |
  3 |          | 1
	|          |
	|          |
	――――――――――――
		 2
*/

var JunctionSides =
{
	TOP : { value: 0, name: "top"} ,
	RIGHT : { value: 1, name: "right" },
	BOTTOM : { value: 2, name: "bottom" },
	LEFT : { value: 3, name: "left" }
}

function Junction( _id, _pos, _width, _connectedRoads,
				   _verticalTrafficLight,
				   _horizontalTrafficLight)
{
	this.id = _id;
	this.centralPosition = _pos;
	this.width = _width;

	this.connectedRoads = _connectedRoads;

	this.verticalTrafficLight = _verticalTrafficLight;
	this.horizontalTrafficLight = _horizontalTrafficLight;
}

Junction.prototype.getSideForRoad( roadID )
{
	switch ( roadID ) {
	case this.connectedRoads[ JunctionSides.TOP.name ]:
		return JunctionSides.TOP.value;

	case this.connectedRoads[ JunctionSides.RIGHT.name ]:
		return JunctionSides.RIGHT.value;

	case this.connectedRoads[ JunctionSides.BOTTOM.name ]:
		return JunctionSides.BOTTOM.value;

	case this.connectedRoads[ JunctionSides.LEFT.name ]:
		return JunctionSides.RIGHT.value;

	default:
		console.log("Road with id " + roadID + "is not connected to junction "
					+ "with id " + this.id);
		return null;
	}
}

// return LaneDirection.FORWARD if vehicle turn from *currentRoadId*
// to forward lane of *newRoadId*
// return LaneDirection.BACKWARD if vehicle turn from *currentRoadId*
// to backward lane of *newRoadId*
// if cannot turn, return null
Junction.prototype.turnToLane( currentRoadId, newRoadId)
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

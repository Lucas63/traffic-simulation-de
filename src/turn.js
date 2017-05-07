var TurnOrientation =
{
	"left": 0,
	"right": 1
}

// _from - road id vehicle moves from
// _to - road id vehicle moves to
function Turn( _from, _to )
{
	this.from = _from;
	this.to = _to;

	let fromDirection = _from.direction;
	let toDirection = _to.direction;

	// this formula used to decide direction of this turn
	// switching to the road with orientation UP_TO_BOTTOM is a different
	// turn whether vehicle moves on LEFT_TO_RIGHT or RIGHT_TO_LEFT road.
	// so find difference between road orientation, add 4 to avoid negative
	// values and wrap around 4
	// each road's direction points at side of the world and I found
	// whether new direction less than old or not
	//               BOTTOM_TO_UP: 0
	//                    ↑
	// RIGHT_TO_LEFT: 3 ←  → LEFT_TO_RIGHT: 1
	//                   ↓
	//               UP_TO_BOTTOM: 2
	let diff = ((fromDirection - toDirection) + 4) % 4;

	if (diff == 1)
	{
		this.orientation = TurnOrientation["left"];
	}
	else
	{
		this.orientation = TurnOrientation["right"];
	}
}

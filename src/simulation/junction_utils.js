function getRightSide( _side )
{
	switch(_side)
	{
	case JunctionSides["top"]:
		return JunctionSides["left"];

	case JunctionSides["right"]:
		return JunctionSides["top"];

	case JunctionSides["bottom"]:
		return JunctionSides["right"];

	case JunctionSides["left"]:
		return JunctionSides["bottom"];
	}
}

function getOppositeSide( _side )
{
	switch(_side)
	{
	case JunctionSides["top"]:
		return JunctionSides["bottom"];

	case JunctionSides["right"]:
		return JunctionSides["left"];

	case JunctionSides["bottom"]:
		return JunctionSides["top"];

	case JunctionSides["left"]:
		return JunctionSides["right"];
	}
}

function getLeftSide( _side )
{
	switch(_side)
	{
	case JunctionSides["top"]:
		return JunctionSides["right"];

	case JunctionSides["right"]:
		return JunctionSides["bottom"];

	case JunctionSides["bottom"]:
		return JunctionSides["left"];

	case JunctionSides["left"]:
		return JunctionSides["top"];
	}
}

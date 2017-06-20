const MovementType =
{
	"pass": 0,
	"turnLeft": 1,
	"turnRight": 2
};

const RouteItemType =
{
	"ROAD": "road",
	"TURN": "turn",
	"OFFRAMP": "offramp",
	"ONRAMP": "onramp",
	"JUNCTION": "junction"
};


// route items listed in route.json configuration file and structure of item:
// type - value from RouteItemType
// id - object's id
// movementType - value from MovementType

function Route( _id, _items )
{
	this.id = _id;
	this.items = _items;
}

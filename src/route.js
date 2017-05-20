const var MovementType =
{
	"pass": 0,
	"turnLeft": 1,
	"turnRight": 2
}

const var RouteItemType =
{
	"road": 0,
	"turn": 1,
	"offramp": 2,
	"onramp": 3,
	"trafficLight": 4
}


// route items listed in route.json configuration file and structure of item:
// type - value from RouteItemType
// id - object's id
// movementType - value from MovementType

function Route( _items )
{
	this.items = _items;
	this.itemIndex = 0;
}

Route.prototype.completed = function()
{
	return (this.items.length - 1) == this.itemIndex;
}

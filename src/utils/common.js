
// value denoting error, I prefer it to numerical variables instead of null
const INVALID = -1;

const TURN_DURATION_BASE = 0.5;
const TURN_DURATION_FOR_LANE = 0.5;

if ( !Array.prototype.first )
{
	Array.prototype.first = function()
	{
		return this[0];
	};
}

// simple way to get last element of any array
if ( !Array.prototype.last )
{
	Array.prototype.last = function()
	{
		return this[this.length - 1];
	};
}

if ( !Array.prototype.empty )
{
	Array.prototype.empty = function()
	{
		return this.length == 0;
	};
}

function printDebug( functionName, message )
{
	console.debug(functionName + ": " + message);
}

function printWarning( functionName, message )
{
	console.warn(functionName + ": " + message);
}

function printError( functionName, message )
{
	console.error(functionName + ": " + message);
}
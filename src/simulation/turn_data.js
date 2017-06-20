function TurnData(_startX, _startY, _controlX, _controlY, _endX, _endY)
{
	this.startX = _startX;
	this.startY = _startY;
	this.controlX = _controlX;
	this.controlY = _controlY;
	this.endX = _endX;
	this.endY = _endY;
}

function Point( _x, _y )
{
	this.x = _x;
	this.y = _y;
}

Point.prototype.length = function()
{
	return Max.sqrt( this.x * this.x + this.y * this.y);
}

Point.prototype.dotProduct = function(point)
{
	return this.x * point.x + this.y * point.y;
}

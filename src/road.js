// Layout of road, orientation used in calculation of car positions
// also used by map for rendering
var RoadDirectionEnum =
{
    LEFT_TO_RIGTH : 0,
    RIGHT_TO_LEFT : 1,
    BOTTOM_TO_UP : 2,
    UP_TO_BOTTOM : 3
};


/*
 * \brief Object with all information for road setup
 *
 * \param _roadLength - length in distance units
 * \param _laneWidth - width of the single lane
 * \param _lanes - array with all lanes related to current road
 * \param _orientation - value from RoadDirectionEnum
 */
function RoadConfig( _roadLength, _laneWidth, _lanes, _direction, _cars )
{
    this.roadLength = _roadLength;

    // Lane length is equal to road length
    this.laneWidth = _laneWidth;
    this.lanes = _lanes;
    this.direction = _direction;
    this.cars = _cars;
}

/*
 * \brief This function setup road and make all initialization
 */
function Road( roadConfig )
{
    this.roadLength = roadConfig.laneWidth;
    this.roadWidth = roadConfig.lanesWidth * roadConfig.lanes.length;
    this.lanes = roadConfig.lanes;
}

Road.prototype.addVehicleToLane( vehicle, laneIndex )
{
    if (laneIndex < 0 || laneIndex >= this.lanes.length)
    {
        return false;
    }

    this.lanes[laneIndex].addVehicle( vehicle );
    return true;
}

// Update leader car on lane
Road.prototype.updateLeader = function( index )
{
    console.log("updateLeader() for " + index + " car");
}

// update a lagger (presently I don't know is it the last car or not)
Road.prototype.updateLagger = function( index )
{
    console.log("updateLagger() for " + index + " car");
}

// leader at the right lane for car specified by index
Road.prototype.updateLeaderAtRight = function( index )
{
    console.log("updateLeaderAtRight() for " + index + " car");
}

Road.prototype.updateLaggerAtRight = function( index )
{
    console.log("updateLaggerAtRight() for " + index + " car");
}

// leader at the left lane for car specified by index
Road.prototype.updateLeaderAtLeft = function( index )
{
    console.log("updateLeaderAtLeft() for " + index + " car");
}

Road.prototype.updateLaggerAtLeft = function( index )
{
    console.log("updateLaggerAtLeft() for ", index, " car");
}

// update positions of all cars on all lanes
Road.prototype.update = function()
{
    lane = null;
    for (i = 0; i < this.lanes.length; ++i)
    {
        lane = this.lanes[i];

        for (j = 0; j < lane.cars.length; j++)
        {
            this.updateLeader( j );

            this.updateLagger( j );

            this.updateLeaderAtLeft( j );

            this.updateLaggerAtLeft( j );

            this.updateLeaderAtRight( j );

            this.updateLaggerAtRight( j );
        }
    }
}

// Traverse over each car and decide whether it moves to the right lane
Road.prototype.checkRightLane = function()
{
    console.log("checkRightLane()")
}

// Traverse over each car and decide whether it moves to the left lane
Road.prototype.checkLeftLane = function()
{
    console.log("checkLeftLane()")
}

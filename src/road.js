// Layout of road, orientation used in calculation of car positions
// also used by map for rendering
var DirectionEnum =
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
 * \param _orientation - Direction.HORIZONTAL or Direction.VERTICAL
 */
function RoadConfig( _roadLength, _laneWidth, _lanes[], _orientation,
                     _cars[] )
{
    this.roadLength = _roadLength;

    // Lane length is equal to road length
    this.laneWidth = _laneWidth;
    this.lanes = _lanes;
    this.orientation = _orientation;
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
    for (i = 0; i < this.cars.length; i++)
    {
        this.updateLeader( i );

        this.updateLagger( i );

        this.updateLeaderAtLeft( i );

        this.updateLaggerAtLeft( i );

        this.updateLeaderAtRight( i );

        this.updateLaggerAtRight( i );
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

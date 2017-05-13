 /*
  * RoadEngine is a main computational unit initializing and performing
  * traffic simulation.
  */

 /*
  * \param _roads - roads data from map configuration file
  * \param _roadObjects - road objects data from map configuration file
  */
 function RoadEngine( _map )
 {
	this.map = _map;
	
	this.roads = new Array( _roads.length );
	_roads.forEach( this.initRoads, this );

	this.roadObjects = _roadObjects;
 }

 RoadEngine.prototype.initRoads( roadConfig, roadIndex, roads )
 {
	this.roads[ roadIndex ] = new Road( roadConfig );
 }

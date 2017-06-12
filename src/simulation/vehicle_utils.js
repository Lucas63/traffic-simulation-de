function addVehiclesArray(lanes)
{
    for (let i = 0; i < lanes.length; ++i)
        lanes[i].vehicles = [];
}

function addVirtualVehicle(lanes, length)
{
    // multiplier 1.5 was selected just to make free movement coordindate
    // not so big, but it's a random choise
    for (let i = 0; i < lanes.length; ++i)
        lanes[i].virtualVehicle = new VirtualVehicle(length, 1.5 * length,
                                                     upstreamRoad.desiredSpeed,
                                                     freeRoadIDM.desiredSpeed);
}

function setupPassLanes(lanes, laneLength)
{
    addVehiclesArray(lanes);
    addVirtualVehicle(lanes, length);
}

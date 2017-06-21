/**
 * Created by lucas63 on 27.05.17.
 */
var roads_json = {
	"roads": [
		{
			"id": 0,
			"direction": "BOTTOM_TO_UP",
			"length": 20,
			"startX": 14,
			"startY": 60,
			"finishX": 14,
			"finishY": 40,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				0,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.VOID,
				"id": null
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 0
			}
		},

		{
			"id": 1,
			"direction": "LEFT_TO_RIGHT",
			"length": 8,
			"startX": 4,
			"startY": 38,
			"finishX": 12,
			"finishY": 38,
			"forwardLanes":2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes":2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.VOID,
				"id": null
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 0
			}
		},

		{
			"id": 2,
			"direction": "LEFT_TO_RIGHT",
			"length": 8,
			"startX": 4,
			"startY": 18,
			"finishX": 12,
			"finishY": 18,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.VOID,
				"id": null
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 1
			}
		},

		{
			"id": 3,
			"direction": "BOTTOM_TO_UP",
			"length": 16,
			"startX": 14,
			"startY": 36,
			"finishX": 14,
			"finishY": 20,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 0
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 1
			}
		},
		{
			"id": 4,
			"direction": "BOTTOM_TO_UP",
			"length": 12,
			"startX": 14,
			"startY": 16,
			"finishX": 14,
			"finishY": 4,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 1
			},
			"finishConnection": {
				"type": RoadObject.VOID,
				"id": null
			}
		},
		{
			"id": 5,
			"direction": "LEFT_TO_RIGHT",
			"length": 16,
			"startX": 16,
			"startY": 38,
			"finishX": 33,
			"finishY": 38,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 0
			},
			"finishConnection": {
				"type": RoadObject.OFFRAMP,
				"id": 0
			}
		},
		{
			"id": 6,
			"direction": "UP_TO_BOTTOM",
			"length": 4,
			"startX": 26,
			"startY": 57,
			"finishX": 26,
			"finishY": 60,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 0,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.TURN,
				"id": 0
			},
			"finishConnection": {
				"type": RoadObject.VOID,
				"id": null
			}
		},
		{
			"id": 7,
			"direction": "RIGHT_TO_LEFT",
			"length": 4,
			"startX": 31,
			"startY": 54,
			"finishX": 29,
			"finishY": 54,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 0,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.TURN,
				"id": 1
			},
			"finishConnection": {
				"type": RoadObject.TURN,
				"id": 0
			}
		},

		{
			"id": 8,
			"direction": "UP_TO_BOTTOM",
			"length": 12,
			"startX": 34,
			"startY": 40,
			"finishX": 34,
			"finishY": 51,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 0,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.OFFRAMP,
				"id": 0
			},
			"finishConnection": {
				"type": RoadObject.TURN,
				"id": 1
			}
		},

		{
			"id": 9,
			"direction": "LEFT_TO_RIGHT",
			"length": 32,
			"startX": 16,
			"startY": 18,
			"finishX": 48,
			"finishY": 18,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 1
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 2
			}
		},

		{
			"id": 10,
			"direction": "LEFT_TO_RIGHT",
			"length": 12,
			"startX": 35,
			"startY": 38,
			"finishX": 48,
			"finishY": 38,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.OFFRAMP,
				"id": 0
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 3
			}
		},

		{
			"id": 11,
			"direction": "BOTTOM_TO_UP",
			"length": 20,
			"startX": 50,
			"startY": 60,
			"finishX": 50,
			"finishY": 40,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.VOID,
				"id": null
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 3
			}
		},

		{
			"id": 12,
			"direction": "BOTTOM_TO_UP",
			"length": 16,
			"startX": 50,
			"startY": 36,
			"finishX": 50,
			"finishY": 20,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 3
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 2
			}
		},

		{
			"id": 13,
			"direction": "BOTTOM_TO_UP",
			"length": 12,
			"startX": 50,
			"startY": 16,
			"finishX": 50,
			"finishY": 4,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 2
			},
			"finishConnection": {
				"type": RoadObject.VOID,
				"id": null
			}
		},

		{
			"id": 14,
			"direction": "LEFT_TO_RIGHT",
			"length": 8,
			"startX": 52,
			"startY": 38,
			"finishX": 61,
			"finishY": 38,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 3
			},
			"finishConnection": {
				"type": RoadObject.ONRAMP,
				"id": 1
			}
		},

		{
			"id": 15,
			"direction": "UP_TO_BOTTOM",
			"length": 8,
			"startX": 62,
			"startY": 29,
			"finishX": 62,
			"finishY": 36,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 0,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.TURN,
				"id": 2
			},
			"finishConnection": {
				"type": RoadObject.ONRAMP,
				"id": 0
			}
		},

		{
			"id": 16,
			"direction": "LEFT_TO_RIGHT",
			"length": 24,
			"startX": 52,
			"startY": 18,
			"finishX": 77,
			"finishY": 18,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 2
			},
			"finishConnection": {
				"type": RoadObject.OFFRAMP,
				"id": 2
			}
		},

		{
			"id": 17,
			"direction": "LEFT_TO_RIGHT",
			"length":12,
			"startX": 63,
			"startY": 38,
			"finishX": 76,
			"finishY": 38,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.ONRAMP,
				"id": 0
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 4
			}
		},

		{
			"id": 18,
			"direction": "RIGHT_TO_LEFT",
			"length": 12,
			"startX": 77,
			"startY": 26,
			"finishX": 65,
			"finishY": 26,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 0,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.OFFRAMP,
				"id": 1
			},
			"finishConnection": {
				"type": RoadObject.TURN,
				"id": 2
			}
		},

		{
			"id": 19,
			"direction": "BOTTOM_TO_UP",
			"length": 20,
			"startX": 78,
			"startY": 60,
			"finishX": 78,
			"finishY": 40,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.VOID,
				"id": null
			},
			"finishConnection": {
				"type": RoadObject.JUNCTION,
				"id": 4
			}
		},

		{
			"id": 20,
			"direction": "BOTTOM_TO_UP",
			"length": 8,
			"startX": 78,
			"startY": 36,
			"finishX": 78,
			"finishY": 27,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 4
			},
			"finishConnection": {
				"type": RoadObject.OFFRAMP,
				"id": 1
			}
		},

		{
			"id": 21,
			"direction": "UP_TO_BOTTOM",
			"length": 1,
			"startX": 78,
			"startY": 25,
			"finishX": 78,
			"finishY": 20,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.OFFRAMP,
				"id": 1
			},
			"finishConnection": {
				"type": RoadObject.OFFRAMP,
				"id": 2
			}
		},

		{
			"id": 22,
			"direction": "LEFT_TO_RIGHT",
			"length": 12,
			"startX": 80,
			"startY": 38,
			"finishX": 92,
			"finishY": 38,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.JUNCTION,
				"id": 4
			},
			"finishConnection": {
				"type": RoadObject.VOID,
				"id": null
			}
		},

		{
			"id": 23,
			"direction": "LEFT_TO_RIGHT",
			"length": 12,
			"startX": 79,
			"startY": 18,
			"finishX": 92,
			"finishY": 18,
			"forwardLanes": 2,
			"forwardLanesSpawnPoints": [
				null,
				null
			],
			"backwardLanes": 2,
			"backwardLanesSpawnPoints": [
				null,
				null
			],
			"startConnection": {
				"type": RoadObject.OFFRAMP,
				"id": 2
			},
			"finishConnection": {
				"type": RoadObject.VOID,
				"id": null
			}
		}
	]
};

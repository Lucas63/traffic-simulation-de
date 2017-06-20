/**
 * Created by lucas63 on 27.05.17.
 */
var junctions_json = {
	"defaultGreenDuration": 20,
	"defaultYellowDuration": 3,
	"defaultRedDuration": 30,

	"junctions":
		[
			{
				"id": 0,
				"verticalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.GREEN
					},
				"horizontalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.RED
					}
			},
			{
				"id": 1,
				"verticalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.RED
					},
				"horizontalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.GREEN
					}
			},
			{
				"id": 2,
				"verticalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.RED
					},
				"horizontalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.GREEN
					}
			},
			{
				"id": 3,
				"verticalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.RED
					},
				"horizontalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.GREEN
					}
			},
			{
				"id": 4,
				"verticalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.GREEN
					},
				"horizontalTrafficLight":
					{
						"exists": "yes", "initialLight": TrafficLightColor.RED
					}
			}
		]
}

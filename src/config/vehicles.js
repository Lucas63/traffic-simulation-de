/**
 * Created by lucas63 on 27.05.17.
 */
var vehicles_json = {
	"car":
	{
		"length": 4,
		"width": 2,
		"minimum_gap": 2,

		"FreeMoveIDMModel":
		{
			"desiredSpeed": 80,
			"timeHeadway": 1.5,
			"acceleration": 1.2,
			"deceleration": 1.8,
			"lambda_a": 1,
			"lambda_b": 1,
			"lambda_T": 1
		},

		"FreeMoveLCModel":
		{

		},

		"UpstreamIDMModel":
		{
			"desiredSpeed": 30,
			"timeHeadway": 1.5,
			"acceleration": 0.4,
			"deceleration": 2.1,
			"lambda_a": 1,
			"lambda_b": 1.7,
			"lambda_T": 1
		},

		"UpstreamLCModel":
		{

		},

		"DownstreamIDMModel":
		{
			"desiredSpeed": 80,
			"timeHeadway": 1.5,
			"acceleration": 0.8,
			"deceleration": 1.3,
			"lambda_a": 1,
			"lambda_b": 2,
			"lambda_T": 0.5
		},

		"DownstreamLCModel":
		{

		},

		"JamIDMModel":
		{
			"desiredSpeed": 10,
			"timeHeadway": 1.5,
			"acceleration": 0.5,
			"deceleration": 1.5,
			"lambda_a": 1.5,
			"lambda_b": 1,
			"lambda_T": 1.5
		}
	},

	"truck":
	{
		"length": 10,
		"width": 5,
		"minimumGap": 2,

		"FreeMoveIDMModel":
		{
			"desiredSpeed": 60,
			"timeHeadway": 1.8,
			"acceleration": 1.2,
			"deceleration": 1.8,
			"lambda_a": 1,
			"lambda_b": 1,
			"lambda_T": 1
		},

		"FreeMoveLCModel":
		{

		},

		"UpstreamIDMModel":
		{
			"desiredSpeed": 15,
			"timeHeadway": 1.8,
			"acceleration": 1.2,
			"deceleration": 1,
			"lambda_a": 1,
			"lambda_b": 1.7,
			"lambda_T": 1
		},

		"UpstreamLCModel":
		{

		},

		"DownstreamIDMModel":
		{
			"desiredSpeed": 60,
			"timeHeadway": 1.5,
			"acceleration": 1.2,
			"deceleration": 1,
			"lambda_a": 1,
			"lambda_b": 2,
			"lambda_T": 0.5
		},

		"DownstreamLCModel":
		{

		},

		"JamIDMModel":
		{
			"desiredSpeed": 10,
			"timeHeadway": 2,
			"acceleration": 1.2,
			"deceleration": 1,
			"lambda_a": 1.5,
			"lambda_b": 1,
			"lambda_T": 0.5
		}
	}
}

/**
 * Created by lucas63 on 27.05.17.
 */
var vehicles_json = {
	"car":
	{
		"length": 1,
		"width": 0.5,
		"minimum_gap": 0.25,

		"FreeMoveIDMModel":
		{
			"desiredSpeed": 0.8,
			"timeHeadway": 1.5,
			"acceleration": 0.5,
			"deceleration": 0.5,
			"lambda_a": 1,
			"lambda_b": 1,
			"lambda_T": 1
		},

		"FreeMoveLCModel":
		{

		},

		"UpstreamIDMModel":
		{
			"desiredSpeed": 0.3,
			"timeHeadway": 1.5,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 1,
			"lambda_b": 1.7,
			"lambda_T": 1
		},

		"UpstreamLCModel":
		{

		},

		"DownstreamIDMModel":
		{
			"desiredSpeed": 0.75,
			"timeHeadway": 1.5,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 1,
			"lambda_b": 2,
			"lambda_T": 0.5
		},

		"DownstreamLCModel":
		{

		},

		"JamIDMModel":
		{
			"desiredSpeed": 0.1,
			"timeHeadway": 1.5,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 1.5,
			"lambda_b": 1,
			"lambda_T": 1.5
		}
	},

	"truck":
	{
		"length": 1.5,
		"width": 0.8,
		"minimum_gap": 0.4,

		"FreeMoveIDMModel":
		{
			"desiredSpeed": 0.6,
			"timeHeadway": 1.8,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 1,
			"lambda_b": 1,
			"lambda_T": 1
		},

		"FreeMoveLCModel":
		{

		},

		"UpstreamIDMModel":
		{
			"desiredSpeed": 0.25,
			"timeHeadway": 1.8,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 1,
			"lambda_b": 1.7,
			"lambda_T": 1
		},

		"UpstreamLCModel":
		{

		},

		"DownstreamIDMModel":
		{
			"desiredSpeed": 0.5,
			"timeHeadway": 1.5,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 1,
			"lambda_b": 2,
			"lambda_T": 0.5
		},

		"DownstreamLCModel":
		{

		},

		"JamIDMModel":
		{
			"desiredSpeed": 0.1,
			"timeHeadway": 2,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 1.5,
			"lambda_b": 1,
			"lambda_T": 0.5
		}
	}
};

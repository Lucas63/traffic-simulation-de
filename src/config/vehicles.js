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
			"desiredSpeed": 1.0,
			"timeHeadway": 1.5,
			"acceleration": 0.5,
			"deceleration": 0.5,
			"lambda_a": 0.8,
			"lambda_b": 0.8,
			"lambda_T": 0.8
		},

		"FreeMoveLCModel":
		{

		},

		"UpstreamIDMModel":
		{
			"desiredSpeed": 0.5,
			"timeHeadway": 1.5,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 0.8,
			"lambda_b": 1.4,
			"lambda_T": 0.8
		},

		"UpstreamLCModel":
		{

		},

		"DownstreamIDMModel":
		{
			"desiredSpeed": 0.9,
			"timeHeadway": 1.5,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 0.8,
			"lambda_b": 1.6,
			"lambda_T": 0.4
		},

		"DownstreamLCModel":
		{

		},

		"JamIDMModel":
		{
			"desiredSpeed": 0.35,
			"timeHeadway": 1.5,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 1.2,
			"lambda_b": 0.8,
			"lambda_T": 1.2
		}
	},

	"truck":
	{
		"length": 1.5,
		"width": 0.8,
		"minimum_gap": 0.4,

		"FreeMoveIDMModel":
		{
			"desiredSpeed": 0.9,
			"timeHeadway": 1.8,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 0.8,
			"lambda_b": 0.8,
			"lambda_T": 0.8
		},

		"FreeMoveLCModel":
		{

		},

		"UpstreamIDMModel":
		{
			"desiredSpeed": 0.45,
			"timeHeadway": 1.8,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 0.8,
			"lambda_b": 1.4,
			"lambda_T": 0.8
		},

		"UpstreamLCModel":
		{

		},

		"DownstreamIDMModel":
		{
			"desiredSpeed": 0.75,
			"timeHeadway": 1.9,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 0.8,
			"lambda_b": 1.6,
			"lambda_T": 0.4
		},

		"DownstreamLCModel":
		{

		},

		"JamIDMModel":
		{
			"desiredSpeed": 0.2,
			"timeHeadway": 2,
			"acceleration": 0.25,
			"deceleration": 0.25,
			"lambda_a": 1.2,
			"lambda_b": 0.8,
			"lambda_T": 0.4
		}
	}
};

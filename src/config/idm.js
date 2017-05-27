var idm_json =
{
	"car":
	{
		"desired_speed": 80,
		"time_headway": 1.5,
		"minimum_gap": 2,
		"acceleration": 1.5,
		"deceleration": 1.8,
	},

	"truck":
	{
		"desired_speed": 60,
		"time_headway": 1.8,
		"minimum_gap": 2,
		"acceleration": 1.2,
		"deceleration": 1.5,
	},

	"free_road":
	{
		"lambda_T": 1,
		"lambda_a": 1,
		"lambda_b": 1,
	},

	"upstream":
	{
		"lambda_T": 1,
		"lambda_a": 1,
		"lambda_b": 1.7,
	},

	"downstream":
	{
		"lambda_T": 0.5,
		"lambda_a": 1,
		"lambda_b": 2,
	},

	"jam":
	{
		"lambda_T": 0.5,
		"lambda_a": 1.5,
		"lambda_b": 1,
	}
};

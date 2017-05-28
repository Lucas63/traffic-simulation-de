var idm_json =
{
	"car":
	{
		"minimum_gap": 2,
		"acceleration": 1.5,
		"deceleration": 1.8,

		"free_road":
		{
			"desired_speed": 80,
			"time_headway": 1.5,
			"lambda_T": 1,
			"lambda_a": 1,
			"lambda_b": 1,
		},

		"upstream":
		{
			"desired_speed": 20,
			"time_headway": 1.6,
			"lambda_T": 1,
			"lambda_a": 1,
			"lambda_b": 1.7,
		},

		"downstream":
		{
			"desired_speed": 80,
			"time_headway": 1.5,
			"lambda_T": 0.5,
			"lambda_a": 1,
			"lambda_b": 2,
		},

		"jam":
		{
			"desired_speed": 10,
			"time_headway": 1.5,
			"lambda_T": 0.5,
			"lambda_a": 1.5,
			"lambda_b": 1,
		}
	},

	"truck":
	{
		"minimum_gap": 2,
		"acceleration": 1.2,
		"deceleration": 1.5,

		"free_road":
		{
			"desired_speed": 60,
			"time_headway": 1.8,
			"lambda_T": 1,
			"lambda_a": 1,
			"lambda_b": 1,
		},

		"upstream":
		{
			"desired_speed": 15,
			"time_headway": 1.8,
			"lambda_T": 1,
			"lambda_a": 1,
			"lambda_b": 1.7,
		},

		"downstream":
		{
			"desired_speed": 60,
			"time_headway": 1.5,
			"lambda_T": 0.5,
			"lambda_a": 1,
			"lambda_b": 2,
		},

		"jam":
		{
			"desired_speed": 10,
			"time_headway": 1.5,
			"lambda_T": 0.5,
			"lambda_a": 1.5,
			"lambda_b": 1,
		}
	},

};

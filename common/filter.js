const age = [
	[{
			value: "-1",
			label: '不限'
		},
		{
			value: '18',
			label: '18'
		},
		{
			value: '20',
			label: '20'
		},
		{
			value: '30',
			label: '30'
		}
	],
	[{
			value: "-1",
			label: ''
		},
		{
			value: '25',
			label: '25'
		},
		{
			value: '35',
			label: '35'
		},
		{
			value: '40',
			label: '40'
		}
	]
]

const height = [
	[{
			value: "-1",
			label: '不限'
		},
		{
			value: '150',
			label: '150cm'
		},
		{
			value: '160',
			label: '160cm'
		},
		{
			value: '170',
			label: '170cm'
		},
		{
			value: '180',
			label: '180cm'
		}
	],
	[{
			value: "-1",
			label: ''
		},
		{
			value: '160',
			label: '160cm'
		},
		{
			value: '170',
			label: '170cm'
		},
		{
			value: '180',
			label: '180cm'
		},
		{
			value: '190',
			label: '190cm'
		}
	]
]

const weight = [
	[{
			value: "-1",
			label: '不限'
		},
		{
			value: '50',
			label: '50kg'
		},
		{
			value: '60',
			label: '60kg'
		},
		{
			value: '80',
			label: '80kg'
		}
	],
	[{
			value: "-1",
			label: ''
		},
		{
			value: '70',
			label: '70kg'
		},
		{
			value: '80',
			label: '80kg'
		},
		{
			value: '100',
			label: '100kg'
		},
		{
			value: '180',
			label: '180kg'
		}
	]
]

const feel = [{
		value: "-1",
		label: '不限'
	},
	{
		value: '0',
		label: '未婚'
	},
	{
		value: '1',
		label: '离异'
	},
	{
		value: '2',
		label: '已婚'
	}
]

const feelCompile = [{
		value: "-1",
		label: '保密'
	},
	{
		value: '0',
		label: '未婚'
	},
	{
		value: '1',
		label: '离异'
	},
	{
		value: '2',
		label: '已婚'
	}
]

const like = [{
		id: 0,
		check: true,
		label: "不限"
	},
	{
		id: 1,
		check: false,
		label: "旅游"
	},
	{
		id: 2,
		check: false,
		label: "逛街"
	},
	{
		id: 3,
		check: false,
		label: "看电影"
	},
	{
		id: 4,
		check: false,
		label: "喝酒"
	},
	{
		id: 5,
		check: false,
		label: "唱歌"
	}
]

const leve = [{
		value: "1",
		label: '非会员'
	},
	{
		value: '2',
		label: '金牌会员'
	},
	{
		value: '3',
		label: '钻石会员'
	},
	{
		value: '4',
		label: 'VIP本地会员'
	},
	{
		value: '5',
		label: 'VIP全球会员'
	},
	{
		value: '6',
		label: '直通车会员'
	},
	{
		value: '7',
		label: '私人订制会员'
	}
]

const cup = [{
		value: "-1",
		label: '保密'
	}, 
	{
		value: "A",
		label: 'A'
	},
	{
		value: 'B',
		label: 'B'
	},
	{
		value: 'C',
		label: 'C'
	},
	{
		value: 'D',
		label: 'D'
	},
	{
		value: 'E',
		label: 'E'
	},
	{
		value: 'F',
		label: 'F'
	}
]

export {
	age,
	height,
	weight,
	feel,
	like,
	feelCompile,
	leve,
	cup
}

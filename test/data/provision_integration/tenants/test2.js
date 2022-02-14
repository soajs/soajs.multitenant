'use strict';

let lib = {
	"_id": "5e348418ed5e433de5bea716",
	"type": "product",
	"oauth": {
		secret: "this is a secret",
		redirectURI: "http://domain.com",
		grants: [
			"password",
			"refresh_token"
		],
		disabled: 0,
		type: 2.0,
		loginMode: "urac",
		pin: {
			DSBRD: {
				enabled: false
			}
		},
	},
	"code": "test2",
	"name": "test 2 tenant",
	"description": "this is a description for test tenant",
	"applications": [
		{
			"product": "TPROD",
			"package": "TPROD_BASIC",
			"appId": "30d2cb5fc04ce51e06000002",
			"description": "this is a description for app for test tenant for test product and basic package, and with example03 in acl",
			"_TTL": 86400000, // 24 hours
			"keys": [
				{
					"key": "695d3456de70fddc9e1e60a6d85b97d3",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 86400000,
							"extKey": "aa39b5490c4a4ed0e56d7ec1232a428f7ad78ebb7347db3fc9875cb10c2bce39bbf8aabacf9e00420afb580b15698c04ce10d659d1972ebc53e76b6bbae0c113bee1e23062800bc830e4c329ca913fefebd1f1222295cf2eb5486224044b4d0c",
							"device": {},
							"geo": {}
						}
					],
					"config": {
						"dev": {
							"commonFields": {
								"SOAJS_SAAS": {
									"demo": {}
								}
							},
							"oauth": {
								"loginMode": 'urac'
							},
							"urac": {
								"hashIterations": 12, //used by hasher
								"tokenExpiryTTL": 2 * 24 * 3600 * 1000
							}
						}
					}
				}
			]
		},
		{
			"product": "TPROD",
			"package": "TPROD_EXA3",
			"appId": "30d2cb5fc04ce51e06000003",
			"description": "this is a description for app for test tenant for test product and example03 package",
			"_TTL": 86400000, // 24 hours
			"keys": [
				{
					"key": "ff7b65bb252201121f1be95adc08f44a",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 86400000,
							"extKey": "aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25",
							"device": {},
							"geo": {}
						}
					],
					"config": {
						"dev": {
							"commonFields": {},
							"oauth": {
								"loginMode": 'urac'
							},
							"urac": {
								"hashIterations": 12, //used by hasher
								"tokenExpiryTTL": 2 * 24 * 3600 * 1000
							}
						}
					}
				}
			]
		}
	],
	"console": false
};

module.exports = lib;

/**
 *
 * {
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
								"hashIterations": 1024, //used by hasher
								"seedLength": 32, //used by hasher
								"tokenExpiryTTL": 2 * 24 * 3600 * 1000
							}
						}
					}
				}
 **/

let getApplicationSchema = {
    "type": "object",
    "required": true,
    "additionalProperties": false,
    "properties": {
        "result": {
            "type": "boolean",
            "required": true
        },
        "data": {
            "type": "object",
            "required": false,
            "additionalProperties": false,
            "properties": {
                "product": {"type": "string", "required": true},
                "package": {"type": "string", "required": true},
                "appId": {"type": "string", "required": true},
                "description": {"type": "string", "required": false},
                "_TTL": {"type": "integer", "required": false},
                "keys": {
                    "type": "array",
                    "required": true,
                    "items": {
                        "type": "object",
                        "required": true,
                        "properties": {
                            "key": {"type": "string", "required": false},
                            "extKeys": {
                                "type": "array",
                                "required": true,
                                "items": {
                                    "extKey": {"type": "string", "required": true},
                                    "device": {"type": "object", "required": false},
                                    "geo": {"type": "object", "required": false},
                                    "env": {"type": "string", "required": true},
                                    "dashboardAccess": {"type": "boolean", "required": true},
                                    "expDate": {"type": "string", "required": false},
                                }
                            },
                            "config": {"type": "object", "required": false}
                        }
                    }
                }
            }
        },
        "errors": {
            "type": "object",
            "required": false,
            "properties": {
                "codes": {
                    "type": "array",
                    "required": true
                },
                "details": {
                    "type": "array",
                    "required": true
                }
            }
        }
    }
};

module.exports = getApplicationSchema;


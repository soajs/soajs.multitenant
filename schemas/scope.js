"use strict";
let accessSchema = {
	// "oneOf": [
	//     {"type": "boolean", "required": false},
	//     {"type": "array", "minItems": 1, "items": {"type": "string", "required": true}, "required": false}
	// ]
	"type": "boolean", "required": false
};

let apisObject = {
	"type": "object",
	"required": false,
	"patternProperties": {
		"^[_a-z\/][_a-zA-Z0-9\/:]*$": { //pattern to match an api route
			"type": "object",
			"required": true,
			"properties": {
				"access": accessSchema
			},
			"additionalProperties": false
		}
	}
};

let aclMethod = {
	"required": false,
	"type": "array",
	"items": {
		"required": false,
		"type": "object",
		"properties" :{
			"apis": apisObject,
			"group": {"type": "string", "required": true}
		},
		"uniqueItems": true
	}
};

let scope = {
	"type": "object",
	"required": false,
	"patternProperties": {
		"^[a-zA-Z0-9]+$": { //env
			"type": "object",
			"required": false,
			"patternProperties": {
				"^[a-zA-Z0-9]+$": { //service
					"type": "object",
					"required": false,
					"patternProperties": {
						"^[0-9]+(.[0-9]+)$": { //version
							"type": "object",
							"required": false,
							"properties": {
								"access": accessSchema,
								"apisPermission": {
									"type": "string", "enum": ["restricted"], "required": false
								},
								"get": aclMethod,
								"post": aclMethod,
								"put": aclMethod,
								"delete": aclMethod
							},
							"additionalProperties": false
						}
					},
					"additionalProperties": false
				}
			},
			"additionalProperties": false
		}
	}
};

module.exports = scope;
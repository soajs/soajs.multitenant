"use strict";
let accessSchema = {
	// "oneOf": [
	//     {"type": "boolean", "required": false},
	//     {"type": "array", "minItems": 1, "items": {"type": "string", "required": true}, "required": false}
	// ]
	"type": "boolean", "required": false
};

let aclMethod = {
	"type": "array",
	"required": false,
	"items": {
		"required": false,
		"type": "string",
		"uniqueItems": true
	}
};

let acl = {
	'source': ['body.acl'],
	'required': false,
	'validation': {
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
							"^[a-zA-Z0-9.]+$": { //version
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
		},
		"additionalProperties": false
	}
};

module.exports = acl;
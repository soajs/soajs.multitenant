"use strict";

const apisObject = {
	"type": "object",
	"patternProperties": {
		"^[_a-z\/][_a-zA-Z0-9\/:]*$": { //pattern to match an api route
			"type": "object",
			"required": true,
			"properties": {
				"access": {"type": "boolean"},
				"group:": {"type": "string"}
			}
		}
	}
};

const granularAcl = {
	"type": "object",
	"properties": {
		"apis": apisObject
	}
};

const granular = {
	"type": "object",
	"patternProperties": {
		".+": {
			"type": "object",
			"properties": {
				"access": {"type": "boolean"},
				"apisPermission": {
					"type": "string", "enum": ["restricted"]
				},
				"apis": apisObject,
				"get": granularAcl,
				"post": granularAcl,
				"put": granularAcl,
				"delete": granularAcl,
				"head": granularAcl,
				"options": granularAcl,
				"patch": granularAcl,
				"other": granularAcl,
				"apisRegExp": {
					"type": "array",
					"minItems": 1,
					"items": {
						"type": "object",
						"properties": {
							"regExp": {
								"type": "pattern",
								"required": true,
								"pattern": /\.+/
							},
							"access": {"type": "boolean"}
						},
						"additionalProperties": false
					}
				},
				"additionalProperties": false
			},
			"additionalProperties": false
		}
	},
	"additionalProperties": false
};

module.exports = granular;
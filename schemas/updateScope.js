
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const apisObject = {
	"type": "object",
	"required": false,
	"patternProperties": {
		"^[_a-z\/][_a-zA-Z0-9\/:]*$": { //pattern to match an api route
			"type": "object",
			"required": true,
			"properties": {
				"access": {"type": "boolean", "required": false},
			}
		}
	}
};

const aclRoute = {
	"type": "array",
	"required": false,
	"items":
		{
			"type": "object",
			"required": false,
			"properties": {
				"access": {"type": "string", "required": false},
				"apis": apisObject
			}
		}
};

let scope = {
	"type": "object",
	"required": false,
	"patternProperties": {
		"^[^\W\.]+$": 	{
			"type": "object",
			"required": false,
			"patternProperties": {
				".+": {
					"type": "object",
					"required": false,
					"properties": {
						"access": {"type": "boolean", "required": false},
						"apisPermission": {
							"type": "string", "enum": ["restricted"], "required": false
						},
						"get": aclRoute,
						"post": aclRoute,
						"put": aclRoute,
						"delete": aclRoute,
						"head": aclRoute,
						"options": aclRoute,
						"other": aclRoute,
						"additionalProperties": false
					},
					"additionalProperties": false
				}
			},
			"additionalProperties": false
		},
	},
	"additionalProperties": false
};

module.exports = scope;

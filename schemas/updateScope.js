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
	"patternProperties": {
		"^[_a-z\/][_a-zA-Z0-9\/:]*$": { //pattern to match an api route
			"type": "object",
			"required": true,
			"properties": {
				"access": {"type": "boolean"},
			}
		}
	}
};

const aclRoute = {
	"type": "array",
	"items":
		{
			"type": "object",
			"properties": {
				"access": {"type": "string"},
				"apis": apisObject
			}
		}
};

let scope = {
	"type": "object",
	"patternProperties": {
		"^[^\W\.]+$": {
			"type": "object",
			"patternProperties": {
				".+": {
					"type": "object",
					"properties": {
						"access": {"type": "boolean"},
						"apisPermission": {
							"type": "string", "enum": ["restricted"]
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

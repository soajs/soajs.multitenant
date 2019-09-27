
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

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
						"type": "array",
						"required": false,
						"items": {
							"type": "object",
							"required": false,
							"properties": {
								"version": {"type": "string", "required": true},
								"get": aclMethod,
								"post": aclMethod,
								"put": aclMethod,
								"delete": aclMethod
							},
							"additionalProperties": false
						}
					}
				}
			}
		}
	}
};

module.exports = acl;
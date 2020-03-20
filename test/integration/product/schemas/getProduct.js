
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

let scopeSchema = require('../../../../schemas/scope');
let aclSchema = require('../../../../schemas/acl');
aclSchema.required = true;

let getProductSchema = {
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
                "_id": {"type": "string", "required": true},
                "code": {"type": "string", "required": true},
                "name": {"type": "string", "required": true},
                "description": {"type": "string", "required": false},
                "console": {"type": "boolean", "required": false},
                "scope": {
                    "type": "object",
                    "required": true,
                    "properties": {
                        "acl" : scopeSchema
                    }
                },
                "packages": {
                    "type": "array",
                    "required": true,
                    "uniqueItems": true,
                    "items": {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "code": {"type": "string", "required": true},
                            "name": {"type": "string", "required": true},
                            "description": {"type": "string", "required": false},
                            "_TTL": {"type": "number", "min": 1, "required": true},
                            "acl": aclSchema,
	                        "aclTypeByEnv": {
		                        "type": "object",
		                        "required": false
	                        }
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


module.exports = getProductSchema;
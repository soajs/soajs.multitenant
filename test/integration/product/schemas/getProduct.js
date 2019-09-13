"use strict";

let scopeSchema = require('../../../../schemas/scope');

let getProductSchema = {
    "type": "object",
    "required": true,
    "additionalProperties": false,
    "properties": {
        "result": "boolean",
        "data": {
            "type": "object",
            "required": true,
            "additionalProperties": false,
            "properties": {
                "_id": {"type": "string", "required": true},
                "code": {"type": "string", "required": true},
                "name": {"type": "string", "required": true},
                "description": {"type": "string", "required": false},
                "console": {"type": "boolean", "required": false},
                "scope": scopeSchema,
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
                            "acl": {"type": "object", "required": true}
                        }
                    }
                }
            }
        },
        "errors": {
            "type": "object",
            "required": false,
            "properties": {
                "codes": "array",
                "details": "array"
            }
        }
    }
};


module.exports = getProductSchema;
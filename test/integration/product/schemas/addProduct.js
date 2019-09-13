"use strict";

let scopeSchema = require('../../../../schemas/scope');

let addProductSchema = {
    "type": "object",
    "required": true,
    "additionalProperties": false,
    "properties": {
        "result": {
            "type": "boolean"
        },
        "data": {
            "type": "object",
            "required": false,
            "properties": {
                "_id": {
                    "type": "string",
                    "required": true,
                },
                "name": {
                    "type": "string",
                    "required": true,
                },
                "code": {
                    "type": "string",
                    "required": true,
                },
                "description": {
                    "type": "string",
                    "required": false,
                },
                "scope": scopeSchema,
                "packages": {
                    "type": "array",
                    "required": false,
                    "uniqueItems": true,
                    "items": {
                        "type": "object",
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

module.exports = addProductSchema;
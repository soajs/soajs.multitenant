"use strict";

let deleteProductSchema = {
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
            "properties": {
                "n": {
                    "type": "integer",
                    "required": true
                },
                "ok": {
                    "type": "integer",
                    "required": true
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

module.exports = deleteProductSchema;
"use strict";

let updatePackageSchema = {
    "type": "object",
    "required": true,
    "additionalProperties": false,
    "properties": {
        "result": "boolean",
        "data": {
            "type": "string",
            "required": false
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

module.exports = updatePackageSchema;
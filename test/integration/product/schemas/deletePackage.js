"use strict";

let deletePackageSchema = {
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
};

module.exports = deletePackageSchema;
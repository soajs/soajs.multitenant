"use strict";

let addPackageSchema = {
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

module.exports = addPackageSchema;
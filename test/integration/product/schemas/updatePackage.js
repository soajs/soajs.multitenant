"use strict";

let updatePackageSchema = {
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

module.exports = updatePackageSchema;
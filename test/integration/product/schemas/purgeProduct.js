"use strict";

let purgeProductSchema = {
    "result": "boolean",
    "data": {
        "type": "boolean",
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

module.exports = purgeProductSchema;
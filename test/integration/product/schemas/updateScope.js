"use strict";

let updateScopechema = {
    "result": "boolean",
    "data": {
        "type": "integer",
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

module.exports = updateScopechema;
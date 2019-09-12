"use strict";

let deleteProductSchema = {
    "result": "boolean",
    "data": {
        "type": "object",
        "required": false,
        "properties": {
            "n": "integer",
            "ok": "integer"
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
};

module.exports = deleteProductSchema;
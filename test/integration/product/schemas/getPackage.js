"use strict";

let getPackageSchema = {
    "result": "boolean",
    "data": {
        "type": "object",
        "required": true,
        "properties": {
            "code": {"type": "string", "required": true},
            "name": {"type": "string", "required": true},
            "description": {"type": "string", "required": false},
            "_TTL": {"type": "number", "min": 1, "required": true},
            "acl": {"type": "object", "required": true}
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

module.exports = getPackageSchema;
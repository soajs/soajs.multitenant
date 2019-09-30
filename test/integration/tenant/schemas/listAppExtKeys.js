"use strict";

let listApplicationExtKeysSchema = {
    "type": "object",
    "required": true,
    "additionalProperties": false,
    "properties": {
        "result": {
            "type": "boolean",
            "required": true
        },
        "data": {
            "type": "array",
            "required": false,
            "items": {

                "type": "object",
                "required": true,
                "properties": {
                    "key": {"type": "string", "required": false},
                    "extKeys": {
                        "type": "array",
                        "required": false,
                        "items": {
                            "extKey": {"type": "string", "required": true},
                            "device": {"type": "object", "required": false},
                            "geo": {"type": "object", "required": false},
                            "env": {"type": "string", "required": true},
                            "dashboardAccess": {"type": "boolean", "required": true},
                            "expDate": {"type": "string", "required": false},
                        }
                    },
                    "config": {"type": "object", "required": false}
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

module.exports = listApplicationExtKeysSchema;


"use strict";

let getProductSchema = {
    "result": "boolean",
    "data": {
        "type": "object",
        "required": true,
        "properties": {
            "_id": {"type": "string", "required": true},
            "code": {"type": "string", "required": true},
            "name": {"type": "string", "required": true},
            "description": {"type": "string", "required": false},
            "console": {"type": "boolean", "required": false},
            "packages": {
                "type": "array",
                "required": true,
                "uniqueItems": true,
                "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                        "code": {"type": "string", "required": true},
                        "name": {"type": "string", "required": true},
                        "description": {"type": "string", "required": false},
                        "_TTL": {"type": "number", "min": 1, "required": true},
                        "acl": {"type": "object", "required": true}
                        /*"acl": {
                            "type": "object",
                            "required":true,
                            "properties": {
                                "^\/[a-zA-Z0-9_\.\-]+$": {
                                    "type": "object",
                                    "properties": {
                                        "^\/[a-zA-Z0-9_\.\-]+$": {
                                            "type": "object",
                                            "method": {
                                                "type": "string",
                                                "required": false,
                                                "enum": ["GET", "POST", "PUT", "DELETE", "DEL"]
                                            },
                                        }
                                    }
                                }
                            }
                        }*/
                    }
                }
            }
        }
    }
};

module.exports = getProductSchema;
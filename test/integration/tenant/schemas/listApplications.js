
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

let listApplicationSchema = {
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
                "required": false,
                "properties": {
                    "product": {"type": "string", "required": true},
                    "package": {"type": "string", "required": true},
                    "appId": {"type": "string", "required": true},
                    "description": {"type": "string", "required": false},
                    "_TTL": {"type": "integer", "required": false},
                    "keys": {
                        "type": "array",
                        "required": true,
                        "items": {
                            "type": "object",
                            "required": true,
                            "properties": {
                                "key": {"type": "string", "required": false},
                                "extKeys": {
                                    "type": "array",
                                    "required": true,
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
                    }
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

module.exports = listApplicationSchema;


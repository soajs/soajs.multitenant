
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

let addTenantsSchema = {
    "type": "object",
    "required": true,
    "additionalProperties": false,
    "properties": {
        "result": {
            "type": "boolean",
            "required": true
        },
        "data": {
            "type": "object",
            "required": false,
            "additionalProperties": false,
            "properties": {
                "_id": {"type": "string", "required": true},
                "code": {"type": "string", "required": true},
                "name": {"type": "string", "required": true},
                "description": {"type": "string", "required": false},
                "type": {"type": "string", "required": false},
                "tag": {"type": "string", "required": false},
                "console": {"type": "boolean", "required": false},
                "profile": {"type": "object", "required": false},
                "oauth": {
                    "type": "object",
                    "required": true,
                    "additionalProperties": false,
                    "properties": {
                        "secret": {"type": "string", "required": true},
                        "redirectURI": {"type": "string", "required": true},
                        "grants": {"type": "array", "required": true},
                        "pin": {"type": "object", "required": false},
                        "disabled": {"type": "integer", "required": true},
                        "type": {"type": "integer", "required": true},
                        "loginMode": {"type": "string", "required": true},
                    }
                },
                "applications": {
                    "type": "array",
                    "required": false,
                    "items": {
                        "type": "object",
                        "required": false,
                        "properties": {
                            "product": {"type": "string", "required": true},
                            "package": {"type": "string", "required": true},
                            "description": {"type": "string", "required": false},
                            "appId": {"type": "string", "required": true},
                            "_TTL": {"type": "integer", "required": false},
                            "keys": {
                                "type": "array",
                                "required": true,
                                "items": {
                                    "type": "object",
                                    "required": true,
                                    "properties": {
                                        "key": {"type": "string", "required": false},                                        "extKeys": {
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
                            },
                        }
                    }
                },
                "tenant": {
                    "type": "object",
                    "required": false,
                    "properties": {
                        "id": {"type": "string", "required": true},
                        "code": {"type": "string", "required": true},
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

module.exports = addTenantsSchema;


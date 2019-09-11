"use strict";

let listProducts = {
  "result": "boolean",
  "data": {
    "type": "Array",
    "properties": {
      "_id": "string",
      "code": "string",
      "name": "string",
      "description": "string",
      "console": "boolean",
      "packages": {
        "type": "object",
        "properties": {
          "code": "string",
          "name": "string",
          "description": "string",
          "acl": {
            "type": "object",
            "properties": {
              "%environment_name%": {
                "type": "object",
                "properties": {
                  "%service_name%": {
                    "type": "object",
                    "properties": {
                      "version": "string",
                      "http_verb": {
                        "type": "Array",
                        "properties": {
                          "%group_name%": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "_TTL": "integer"
    }
  }
};
module.exports(listProducts);
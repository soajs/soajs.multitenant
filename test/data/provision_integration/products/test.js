'use strict';

let lib = {
    "code" : "TPROD",
    "name" : "Test Product",
    "description" : "this is a description for test product",
    "console": false,
    "scope": {
        "acl": {
           "dashboard": {
               "multitenant": {
                   "1": {
                       "access": false,
                       "get": [
                           {
                               "apis": {
                                   "/product": {
                                       "access": false
                                   }
                               },
                               "group": "Product"
                           }
                       ]
                   }
               }
           }
        }
    },
    "packages" : [
        {
            "code" : "TPROD_BASIC",
            "name" : "basic package",
            "description" : "this is a description for test product basic package",
            "acl" : {
                "dashboard": {
                    "oauth": [
                        {
                            "version": "1",
                            "get": [
                                "Guest"
                            ]
                        }
                    ]
                }
            },
            "_TTL" : 86400000 // 24 hours
        },
        {
            "code" : "TPROD_EXAMPLE03",
            "name" : "example03 package",
            "description" : "this is a description for test product example03 package",
            "acl" : {
                "dashboard": {
                    "oauth": [
                        {
                            "version": "1",
                            "get": [
                                "Guest"
                            ]
                        }
                    ]
                }
            },
            "_TTL" : 86400000 // 24 hours
        }
    ]
};

module.exports = lib;
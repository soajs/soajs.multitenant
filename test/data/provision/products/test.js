'use strict';

let lib = {
    "code" : "TPROD",
    "name" : "Test Product",
    "description" : "this is a description for test product",
    "console": false,
    "packages" : [
        {
            "code" : "TPROD_BASIC",
            "name" : "basic package",
            "description" : "this is a description for test product basic package",
            "acl" : {
                "urac" : {},
                "multitenant" : {}
            },
            "_TTL" : 86400000 // 24 hours
        },
        {
            "code" : "TPROD_EXAMPLE03",
            "name" : "example03 package",
            "description" : "this is a description for test product example03 package",
            "acl" : {
                "urac" : {},
                "example03" : {}
            },
            "_TTL" : 86400000 // 24 hours
        }
    ]
};

module.exports = lib;
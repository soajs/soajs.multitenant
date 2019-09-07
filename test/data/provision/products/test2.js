'use strict';

let lib = {
    "code" : "TEST2",
    "name" : "Test 2 Product",
    "description" : "this is a description for test 2 product",
    "console": false,
    "packages" : [
        {
            "code" : "TEST2_BASIC",
            "name" : "SOME package",
            "description" : "this is a description for test product SOME package",
            "acl" : {
                "multitenant" : {}
            },
            "_TTL" : 86400000 // 24 hours
        },
        {
            "code" : "TEST2_EXAMPLE03",
            "name" : "SOME 2 package",
            "description" : "this is a description for test product SOME 2 package",
            "acl" : {
                "urac" : {},
                "example03" : {}
            },
            "_TTL" : 86400000 // 24 hours
        }
    ]
};

module.exports = lib;
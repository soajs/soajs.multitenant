'use strict';

let lib = {
    "code" : "TEST2",
    "name" : "Test 2 Product",
    "description" : "this is a description for test 2 product",
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
                },
                "urac": {
                    "2": {
                        "access": true,
                        "apisPermission": "restricted",
                        "get": [
                            {
                                "group": "Administration",
                                "apis": {
                                    "/admin/all": {
                                        "access": true
                                    }
                                }
                            },
                            {
                                "group": "My Account",
                                "apis": {
                                    "/account/getUser": {
                                        "access": true
                                    }
                                }
                            },
                            {
                                "group": "Guest Password Settings",
                                "apis": {
                                    "/forgotPassword": {
                                        "access": false
                                    }
                                }
                            },
                            {
                                "group": "Guest Email Validation",
                                "apis": {
                                    "/changeEmail/validate": {
                                        "access": true
                                    }
                                }
                            }
                        ],
                        "post": [
                            {
                                "group": "My Account",
                                "apis": {
                                    "/account/changeEmail": {
                                        "access": true
                                    },
                                    "/account/changePassword": {
                                        "access": true
                                    },
                                    "/account/editProfile": {
                                        "access": true
                                    }
                                }
                            },
                            {
                                "group": "Guest Password Settings",
                                "apis": {
                                    "/resetPassword": {
                                        "access": false
                                    }
                                }
                            }
                        ]
                    }
                },
            }
        }
    },
    "packages" : [
        {
            "code" : "TEST2_NEWS",
            "name" : "news package",
            "description" : "this is a description for test 2 product news package",
            "acl" : {
                "dashboard": {
                    "urac": [
                        {
                            "version": "3",
                            "get": [
                                "Administrator"
                            ]
                        }
                    ]
                }
            },
            "_TTL" : 86400000 // 24 hours
        },
        {
            "code" : "TEST2_NEW",
            "name" : "new package",
            "description" : "this is a description for test 2 product new package",
            "acl" : {
                "dashboard": {
                    "urac": [
                        {
                            "version": "2",
                            "post": [
                                "Guest Password Settings"
                            ],
                            "get": [
                                "Guest Password Settings",
                                "Guest Email Validation"
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
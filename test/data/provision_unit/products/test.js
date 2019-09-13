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
                    },
                    "1x2": {
                        "access": true,
                        "get": [
                            {
                                "apis": {
                                    "/tenant": {
                                        "access": false
                                    }
                                },
                                "group": "Tenant"
                            }
                        ],
                        "post": [
                            {
                                "apis": {
                                    "/tenant": {
                                        "access": true
                                    }
                                },
                                "group": "Tenant"
                            }
                        ]
                    }
                },
                "urac": {
                    "1": {
                        "access": true,
                        "apisPermission": "restricted",
                        "get": [
                            {
                                "apis": {
                                    "/user": {
                                        "access": false
                                    }
                                },
                                "group": "Administrator"
                            }
                        ]
                    },
                    "2x5": {
                        "access": true,
                        "apisPermission": "restricted",
                        "post": [
                            {
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
                                },
                                "group": "My Account"
                            }
                        ],
                        "get": [
                            {
                                "apis": {
                                    "/account/getUser": {
                                        "access": true
                                    }
                                },
                                "group": "My Account"
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
                    "multitenant": [
                        {
                            "version": "1",
                            "get": [
                                "Product"
                            ]
                        },
                        {
                            "version": "1.2",
                            "get": [
                                "Tenant"
                            ]
                        }
                    ],
                    "urac": [
                        {
                            "version": "1",
                            "get": [
                                "Administrator",
                            ]
                        },
                        {
                            "version": "3",
                            "get": [
                                "Administrator",
                                "My Account",
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
                    "urac": [
                        {
                            "version": "2.5",
                            "get": [
                                "My Account",
                            ],
                            "put": [
                                "My Account",
                            ],
                            "delete": [
                                "My Account",
                            ],
                            "post": [
                                "My Account",
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
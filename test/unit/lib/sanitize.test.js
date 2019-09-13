"use strict";
const assert = require('assert');
const lib = require("../../../lib/sanitize");

let record = {
    "code": "TPROD",
    "name": "Test Product",
    "description": "this is a description for test product",
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
                                    "/product": {
                                        "access": false
                                    }
                                },
                                "group": "Product"
                            }
                        ],
                        "post": [
                            {
                                "apis": {
                                    "/product": {
                                        "access": true
                                    }
                                },
                                "group": "Product"
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
                        "get": [
                            {
                                "apis": {
                                    "/user": {
                                        "access": false
                                    },
                                    "/group": {
                                        "access": false
                                    }
                                },
                                "group": "Administrator"
                            }
                        ],
                        "post": [
                            {
                                "apis": {
                                    "/user": {
                                        "access": true
                                    },
                                    "/group": {
                                        "access": true
                                    },
                                },
                                "group": "Product"
                            }
                        ]
                    },
                    "3": {
                        "access": false,
                        "get": [
                            {
                                "apis": {
                                    "/user": {
                                        "access": false
                                    },
                                    "/group": {
                                        "access": false
                                    }
                                },
                                "group": "Product"
                            }
                        ],
                        "post": [
                            {
                                "apis": {
                                    "/user": {
                                        "access": false
                                    },
                                    "/group": {
                                        "access": true
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
    "packages": [
        {
            "code": "TPROD_BASIC",
            "name": "basic package",
            "description": "this is a description for test product basic package",
            "acl": {
                "dashboard": {
                    "oauth": [
                        {
                            "version": "1",
                            "get": [
                                "Tokenization",
                                "User Tokenization",
                                "Cient Tokenization"
                            ]
                        }
                    ],
                    "multitenant": [
                        {
                            "version": "1x2",
                            "get": [
                                "Product",
                                "Tenant"
                            ]
                        }
                    ],
                    "urac": [
                        {
                            "version": "3x1",
                            "get": [
                                "Administrator",
                                "My Account",
                            ]
                        }
                    ]
                }
            },
            "_TTL": 86400000 // 24 hours
        },
        {
            "code": "TPROD_EXAMPLE03",
            "name": "example03 package",
            "description": "this is a description for test product example03 package",
            "acl": {
                "dashboard": {
                    "urac": [
                        {
                            "version": "2x5",
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
            "_TTL": 86400000 // 24 hours
        }
    ]
};

describe("Testing sanitize", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - Sanitizes", (done) => {
        let scopeObject = {
            dashboard: {
                multitenant: {
                    "1.2": {
                        access: false,
                        get: [
                            {
                                "/product": {
                                    access: false
                                },
                                group: 'Product'
                            }
                        ]
                    },
                    "2.1": {
                        access: false,
                        get: [
                            {
                                "/product": {
                                    access: false
                                },
                                group: 'Product'
                            }
                        ]
                    }
                },
                urac: {
                    "1.0": {
                        access: false,
                        get: [
                            {
                                "/user": {
                                    access: false
                                },
                                group: 'Admin'
                            }
                        ]
                    }
                }
            }
        };
        lib.sanitize(scopeObject, (err) => {
            assert.deepEqual(scopeObject.dashboard.multitenant, {
                "1x2": {
                    "access": false,
                    "get": [
                        {
                            "/product": {
                                "access": false
                            },
                            "group": 'Product'
                        }
                    ]
                },
                "2x1": {
                    "access": false,
                    "get": [
                        {
                            "/product": {
                                "access": false
                            },
                            "group": 'Product'
                        }
                    ]
                }
            });
            done();
        });
    });

    it("Success - unSanitizes", (done) => {
        lib.unsanitize(record, (err, result) => {
            console.log(JSON.stringify(result, null, 2), "FLAG2");
            done();
        });
    });
});

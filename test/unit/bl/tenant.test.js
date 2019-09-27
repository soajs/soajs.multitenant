"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/tenant.js');
const assert = require('assert');

describe("Unit test for: BL - tenant", () => {
    let soajs = {
        config: {
            "errors": {
                400: "Business logic required data are missing",
                450: "Unable to find tenant",
                451: "Tenant already exists",
                452: "Main Tenant id is required!",
                453: "Main Tenant is not found!",
                454: "Unable to add tenant application",
                455: "Unable to add a new key to the tenant application",
                456: "Unable to add the tenant application ext Key",
                457: "Unable to find application",

                460: "Unable to find product",
                461: "Unable to find package",
                462: "You are not allowed to remove the tenant you are currently logged in with",
                463: "Invalid product code or package code provided",

                466: "You are not allowed to remove the product you are currently logged in with",
                467: "Package already exists",
                468: "Product already exists",

                470: "Unable to update product",
                471: "Unable to update tenant",
                472: "Unable to get the tenant application",
                473: "Unable to get the tenant application key",
                500: "You cannot modify or delete a locked record",
                501: "Environment record not found!",

                601: "Model not found",
                602: "Model error: ",
            },
            "console": {
                "product": "DSBRD"
            },
        },
        tenant: {
            id: "5c0e74ba9acc3c5a84a51259",
            main: {
                id: "5d8387fd1873f9079b863da0"
            },
            application: {
                product: "TPROD",
                package: "TPROD_TEST",
            }
        },
        log: {
            error: () => {
                console.log();
            }
        }
    };

    describe("Testing list tenants", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - List tenants - empty object", (done) => {
            BL.modelObj = {
                listTenants: (nullObject, cb) => {
                    return cb(null, []);
                }
            };
            BL.list(soajs, {}, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Fails - List tenants - null data", (done) => {
            BL.modelObj = {
                listTenants: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.list(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {code: 400, msg: soajs.config.errors[400]});
                done();
            });
        });

        it("Fails - List tenants - listTenants error", (done) => {
            BL.modelObj = {
                listTenants: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.list(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Success - List tenants - empty object - client tenant", (done) => {
            let soajsClient = {
                config: {},
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.listTenants = (nullObject, cb) => {
                return cb(null, []);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.list(soajsClient, {}, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Fails - List tenants - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing"
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Product() {
                console.log("Product");
            }

            Product.prototype.listTenants = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.list(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {code: 400, msg: soajsClient.config.errors[400]});
                done();
            });
        });

    });

    describe("Testing Get tenant", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - Get tenant - code", (done) => {
            let inputMask = {
                code: "test"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                    });
                }
            };
            BL.get(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "Test Tenant");
                done();
            });
        });

        it("Success - Get tenant - no code no id", (done) => {
            let inputMask = {};

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "id": "5c0e74ba9acc3c5a84a51259",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                    });
                }
            };
            BL.get(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "Test Tenant");
                done();
            });
        });

        it("Success - Get tenant - id", (done) => {
            let inputMask = {
                id: "testid"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "testid",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                    });
                }
            };
            BL.get(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "Test Tenant");
                done();
            });
        });

        it("Fails - Get tenant - null data", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(null, null);
                }
            };
            BL.get(soajs, null, (err, record) => {
                assert.ok(err);
                assert.equal(err.code, 400);
                done();
            });
        });

        it("Success - Get tenant - code - client tenant", (done) => {
            let soajsClient = {
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    "code": "test",
                    "name": "Test Tenant",
                    "description": "this is a description for test tenant",
                });
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            let inputMask = {
                code: "test"
            };

            BL.get(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "Test Tenant");
                done();
            });
        });

        it("Success - Get tenant - id - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing"
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.getTenant = (inputMask, cb) => {
                return cb(null, {
                    "_id": "testid",
                    "name": "Test Tenant",
                    "description": "this is a description for test tenant",
                });
            };

            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            let inputMask = {
                id: "testid"
            };

            BL.get(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "Test Tenant");
                done();
            });
        });

        it("Fail - Get tenant - null data - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing"
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.getTenant = (data, cb) => {
                return cb(true, null);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.get(soajsClient, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 400);
                done();
            });
        });

        it("Fail - Get tenant - null record - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        450: "Unable to find tenant",
                        601: "Model not found",
                        602: "Model error: "
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, null);
            };
            Tenant.prototype.closeConnection = () => {
            };

            BL.model = Tenant;

            BL.get(soajsClient, {id: "notfound"}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 450);
                done();
            });
        });

        it("Fail - Get tenant - mongo error when getting Tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        450: "Unable to find tenant",
                        601: "Model not found",
                        602: "Model error: "
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.getTenant = (data, cb) => {
                return cb(true, null);
            };
            Tenant.prototype.closeConnection = () => {
            };

            BL.model = Tenant;

            BL.get(soajsClient, {id: "found"}, (err, record) => {
                assert.deepEqual(err.code, 602);
                assert.ok(err);
                done();
            });
        });
    });

    describe("Testing Add tenant", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - add tenant - only", (done) => {
            let inputMask = {
                "name": "tenant only name",
                "code": "twr2",
                "description": "3221",
                "type": "product",
                "profile": {},
                "tag": "tag"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        466: "You are not allowed to remove the product you are currently logged in with.",
                        467: "Package already exists",
                        468: "Product already exists.",

                        470: "Unable to update product.",

                        500: "You cannot modify or delete a locked record.",
                        501: "Environment record not found!",

                        601: "Model not found.",
                        602: "Model error: "
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.addTenant = (data, cb) => {
                return cb(null, {
                    "_id": "5d823afc89ace01605cd0e14",
                    "type": "product",
                    "code": "twr2",
                    "name": "tenant only name",
                    "description": "3221",
                    "oauth": {
                        "secret": "this is a secret",
                        "redirectURI": "http://domain.com",
                        "grants": [
                            "password",
                            "refresh_token"
                        ],
                        "disabled": 1,
                        "type": 2,
                        "loginMode": "urac"
                    }
                });
            };

            BL.model = Tenant;
            BL.localConfig = {
                "tenant": {
                    "generatedCodeLength": 5,
                    "character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    "expDateTTL": 86400000
                },
                "errors": {
                    400: "Business logic required data are missing",
                    450: "Unable to find tenant",
                    451: "Tenant already exists",
                    452: "Main Tenant id is required!",
                    453: "Main Tenant is not found!",
                    454: "Unable to add tenant application",
                    455: "Unable to add a new key to the tenant application",
                    456: "Unable to add the tenant application ext Key",

                    460: "Unable to find product",
                    461: "Unable to find package",
                    466: "You are not allowed to remove the product you are currently logged in with.",
                    467: "Package already exists",
                    468: "Product already exists.",

                    470: "Unable to update product.",

                    500: "You cannot modify or delete a locked record.",
                    501: "Environment record not found!",

                    601: "Model not found.",
                    602: "Model error: "
                },
            };
            BL.add(soajsClient, inputMask, {}, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("success - add tenant - with application no internal key", (done) => {
            let inputMask = {
                "name": "tenant only name",
                "code": "twr2",
                "description": "3221",
                "type": "client",
                "mainTenant": "1231231231",

                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6"
                }
            };
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        466: "You are not allowed to remove the product you are currently logged in with.",
                        467: "Package already exists",
                        468: "Product already exists.",

                        470: "Unable to update product.",

                        500: "You cannot modify or delete a locked record.",
                        501: "Environment record not found!",

                        601: "Model not found.",
                        602: "Model error: "
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231",
                    "oauth": {
                        "secret": "this is a secret test",
                        "redirectURI": "http://domain.com",
                        "grants": [
                            "password",
                            "refresh_token"
                        ],
                        "disabled": 0,
                        "type": 1,
                        "loginMode": "ouath"
                    },
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.addTenant = (data, cb) => {
                return cb(null, {
                    "_id": "5d823afc89ace01605cd0e14",
                    "type": "product",
                    "code": "twr2",
                    "name": "tenant only name",
                    "description": "3221",
                    "oauth": {
                        "secret": "this is a secret",
                        "redirectURI": "http://domain.com",
                        "grants": [
                            "password",
                            "refresh_token"
                        ],
                        "disabled": 1,
                        "type": 2,
                        "loginMode": "urac"
                    }
                });
            };

            BL.model = Tenant;
            BL.localConfig = {
                "tenant": {
                    "generatedCodeLength": 5,
                    "character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    "expDateTTL": 86400000
                },
                "errors": {
                    400: "Business logic required data are missing",
                    450: "Unable to find tenant",
                    451: "Tenant already exists",
                    452: "Main Tenant id is required!",
                    453: "Main Tenant is not found!",
                    454: "Unable to add tenant application",
                    455: "Unable to add a new key to the tenant application",
                    456: "Unable to add the tenant application ext Key",

                    460: "Unable to find product",
                    461: "Unable to find package",
                    466: "You are not allowed to remove the product you are currently logged in with.",
                    467: "Package already exists",
                    468: "Product already exists.",

                    470: "Unable to update product.",

                    500: "You cannot modify or delete a locked record.",
                    501: "Environment record not found!",

                    601: "Model not found.",
                    602: "Model error: "
                },
            };
            BL.add(soajsClient, inputMask, {}, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("success - add tenant - with application with internal key", (done) => {
            let inputMask = {
                "name": "tenant only name",
                "code": "twr2",
                "description": "3221",
                "type": "client",
                "mainTenant": "1231231231",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {}
                }
            };
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        466: "You are not allowed to remove the product you are currently logged in with.",
                        467: "Package already exists",
                        468: "Product already exists.",

                        470: "Unable to update product.",

                        500: "You cannot modify or delete a locked record.",
                        501: "Environment record not found!",

                        601: "Model not found.",
                        602: "Model error: "
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.addTenant = (data, cb) => {
                return cb(null, {
                    "_id": "5d823afc89ace01605cd0e14",
                    "type": "product",
                    "code": "twr2",
                    "name": "tenant only name",
                    "description": "3221",
                    "oauth": {
                        "secret": "this is a secret",
                        "redirectURI": "http://domain.com",
                        "grants": [
                            "password",
                            "refresh_token"
                        ],
                        "disabled": 1,
                        "type": 2,
                        "loginMode": "urac"
                    }
                });
            };

            BL.model = Tenant;
            BL.localConfig = {
                "tenant": {
                    "generatedCodeLength": 5,
                    "character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    "expDateTTL": 86400000
                },
                "errors": {
                    400: "Business logic required data are missing",
                    450: "Unable to find tenant",
                    451: "Tenant already exists",
                    452: "Main Tenant id is required!",
                    453: "Main Tenant is not found!",
                    454: "Unable to add tenant application",
                    455: "Unable to add a new key to the tenant application",
                    456: "Unable to add the tenant application ext Key",

                    460: "Unable to find product",
                    461: "Unable to find package",
                    466: "You are not allowed to remove the product you are currently logged in with.",
                    467: "Package already exists",
                    468: "Product already exists.",

                    470: "Unable to update product.",

                    500: "You cannot modify or delete a locked record.",
                    501: "Environment record not found!",

                    601: "Model not found.",
                    602: "Model error: "
                },
            };
            let soajs = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {code: "KUBE"});
                        }
                    },
                    key: {
                        generateExternalKey: (key, opt, opt1, opt2, cb) => {
                            return cb(null, "2313131312312");
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }
            };
            BL.add(soajsClient, inputMask, soajs, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("success - add tenant - with application with internal key and extkey", (done) => {
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "1231231231",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        466: "You are not allowed to remove the product you are currently logged in with.",
                        467: "Package already exists",
                        468: "Product already exists.",

                        470: "Unable to update product.",

                        500: "You cannot modify or delete a locked record.",
                        501: "Environment record not found!",

                        601: "Model not found.",
                        602: "Model error: "
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, []);
            };
            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.addTenant = (data, cb) => {
                return cb(null, {
                    "_id": "5d823afc89ace01605cd0e14",
                    "type": "product",
                    "code": "twr2",
                    "name": "tenant only name",
                    "description": "3221",
                    "oauth": {
                        "secret": "this is a secret",
                        "redirectURI": "http://domain.com",
                        "grants": [
                            "password",
                            "refresh_token"
                        ],
                        "disabled": 1,
                        "type": 2,
                        "loginMode": "urac"
                    }
                });
            };

            BL.model = Tenant;
            BL.localConfig = {
                "tenant": {
                    "generatedCodeLength": 5,
                    "character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    "expDateTTL": 86400000
                },
                "errors": {
                    400: "Business logic required data are missing",
                    450: "Unable to find tenant",
                    451: "Tenant already exists",
                    452: "Main Tenant id is required!",
                    453: "Main Tenant is not found!",
                    454: "Unable to add tenant application",
                    455: "Unable to add a new key to the tenant application",
                    456: "Unable to add the tenant application ext Key",

                    460: "Unable to find product",
                    461: "Unable to find package",
                    466: "You are not allowed to remove the product you are currently logged in with.",
                    467: "Package already exists",
                    468: "Product already exists.",

                    470: "Unable to update product.",

                    500: "You cannot modify or delete a locked record.",
                    501: "Environment record not found!",

                    601: "Model not found.",
                    602: "Model error: "
                },
            };
            let soajs = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
                        }
                    },
                    key: {
                        generateExternalKey: (key, opt, opt1, opt2, cb) => {
                            return cb(null, "2313131312312");
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }
            };
            BL.add(soajsClient, inputMask, soajs, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("success - add tenant - with application with internal key and extkey with initial fail", (done) => {
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "1231231231",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        466: "You are not allowed to remove the product you are currently logged in with.",
                        467: "Package already exists",
                        468: "Product already exists.",

                        470: "Unable to update product.",

                        500: "You cannot modify or delete a locked record.",
                        501: "Environment record not found!",

                        601: "Model not found.",
                        602: "Model error: "
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });

            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            let fail = true;
            Tenant.prototype.addTenant = (data, cb) => {
                if (fail) {
                    fail = false;
                    return cb({message: "MongoDB Error: E11000 duplicate key error collection: local_core_provision.tenants index: code_1 dup key: { : \"twr2\" }"});
                } else {
                    return cb(null, {
                        "_id": "5d823afc89ace01605cd0e14",
                        "type": "product",
                        "code": "random",
                        "name": "tenant only name",
                        "description": "3221",
                        "oauth": {
                            "secret": "this is a secret",
                            "redirectURI": "http://domain.com",
                            "grants": [
                                "password",
                                "refresh_token"
                            ],
                            "disabled": 1,
                            "type": 2,
                            "loginMode": "urac"
                        }
                    });
                }
            };

            BL.model = Tenant;
            BL.localConfig = {
                "tenant": {
                    "generatedCodeLength": 5,
                    "character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    "expDateTTL": 86400000
                },
                "errors": {
                    400: "Business logic required data are missing",
                    450: "Unable to find tenant",
                    451: "Tenant already exists",
                    452: "Main Tenant id is required!",
                    453: "Main Tenant is not found!",
                    454: "Unable to add tenant application",
                    455: "Unable to add a new key to the tenant application",
                    456: "Unable to add the tenant application ext Key",

                    460: "Unable to find product",
                    461: "Unable to find package",
                    466: "You are not allowed to remove the product you are currently logged in with.",
                    467: "Package already exists",
                    468: "Product already exists.",

                    470: "Unable to update product.",

                    500: "You cannot modify or delete a locked record.",
                    501: "Environment record not found!",

                    601: "Model not found.",
                    602: "Model error: "
                },
            };
            let soajs = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
                        }
                    },
                    key: {
                        generateExternalKey: (key, opt, opt1, opt2, cb) => {
                            return cb(null, "2313131312312");
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }
            };
            BL.add(soajsClient, inputMask, soajs, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Success - add tenant - client no maintenant", (done) => {
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "profile": {},
                "tag": "tag"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        466: "You are not allowed to remove the product you are currently logged in with.",
                        467: "Package already exists",
                        468: "Product already exists.",

                        470: "Unable to update product.",

                        500: "You cannot modify or delete a locked record.",
                        501: "Environment record not found!",

                        601: "Model not found.",
                        602: "Model error: "
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {},
                    id: "5c0e74ba9acc3c5a84a51259",
                    main: {
                        id: "5d8387fd1873f9079b863da0"
                    },
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "5d8387fd1873f9079b863da0"
                }]);
            };
            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.addTenant = (data, cb) => {
                return cb(null, {
                    "_id": "5d823afc89ace01605cd0e14",
                    "type": "product",
                    "code": "twr2",
                    "name": "tenant only name",
                    "description": "3221",
                    "oauth": {
                        "secret": "this is a secret",
                        "redirectURI": "http://domain.com",
                        "grants": [
                            "password",
                            "refresh_token"
                        ],
                        "disabled": 1,
                        "type": 2,
                        "loginMode": "urac"
                    }
                });
            };

            BL.model = Tenant;
            BL.localConfig = {
                "tenant": {
                    "id": "5c0e74ba9acc3c5a84a51259",
                    "main": {
                        "id": "5d8387fd1873f9079b863da0"
                    },
                },
                "errors": {
                    400: "Business logic required data are missing",
                    450: "Unable to find tenant",
                    451: "Tenant already exists",
                    452: "Main Tenant id is required!",
                    453: "Main Tenant is not found!",
                    454: "Unable to add tenant application",
                    455: "Unable to add a new key to the tenant application",
                    456: "Unable to add the tenant application ext Key",

                    460: "Unable to find product",
                    461: "Unable to find package",
                    466: "You are not allowed to remove the product you are currently logged in with.",
                    467: "Package already exists",
                    468: "Product already exists.",

                    470: "Unable to update product.",

                    500: "You cannot modify or delete a locked record.",
                    501: "Environment record not found!",

                    601: "Model not found.",
                    602: "Model error: "
                },
            };
            BL.add(soajsClient, inputMask, {}, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Success - add tenant - product no maintenant", (done) => {
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "product",
                "profile": {},
                "tag": "tag"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        466: "You are not allowed to remove the product you are currently logged in with.",
                        467: "Package already exists",
                        468: "Product already exists.",

                        470: "Unable to update product.",

                        500: "You cannot modify or delete a locked record.",
                        501: "Environment record not found!",

                        601: "Model not found.",
                        602: "Model error: "
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {},
                    id: "5c0e74ba9acc3c5a84a51259",
                    main: {
                        id: "5d8387fd1873f9079b863da0"
                    },
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "5c0e74ba9acc3c5a84a51259"
                }]);
            };
            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.addTenant = (data, cb) => {
                return cb(null, {
                    "_id": "5d823afc89ace01605cd0e14",
                    "type": "product",
                    "code": "twr2",
                    "name": "tenant only name",
                    "description": "3221",
                    "oauth": {
                        "secret": "this is a secret",
                        "redirectURI": "http://domain.com",
                        "grants": [
                            "password",
                            "refresh_token"
                        ],
                        "disabled": 1,
                        "type": 2,
                        "loginMode": "urac"
                    }
                });
            };

            BL.model = Tenant;
            BL.localConfig = {
                "tenant": {
                    "id": "5c0e74ba9acc3c5a84a51259",
                    "main": {
                        "id": "5d8387fd1873f9079b863da0"
                    },
                },
                "errors": {
                    400: "Business logic required data are missing",
                    450: "Unable to find tenant",
                    451: "Tenant already exists",
                    452: "Main Tenant id is required!",
                    453: "Main Tenant is not found!",
                    454: "Unable to add tenant application",
                    455: "Unable to add a new key to the tenant application",
                    456: "Unable to add the tenant application ext Key",

                    460: "Unable to find product",
                    461: "Unable to find package",
                    466: "You are not allowed to remove the product you are currently logged in with.",
                    467: "Package already exists",
                    468: "Product already exists.",

                    470: "Unable to update product.",

                    500: "You cannot modify or delete a locked record.",
                    501: "Environment record not found!",

                    601: "Model not found.",
                    602: "Model error: "
                },
            };
            BL.add(soajsClient, inputMask, {}, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - add tenant - empty data", (done) => {
            BL.modelObj = {};

            BL.add(soajs, null, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - add tenant - tenant check error", (done) => {
            BL.modelObj = {};

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.countTenants = (data, cb) => {
                return cb(true, 0);
            };

            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "1231231231",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",

                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };
            BL.add(soajsClient, inputMask, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add tenant - tenant already exist ", (done) => {
            BL.modelObj = {};
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "1231231231",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 1);
            };
            BL.model = Tenant;
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",

                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };
            BL.add(soajsClient, inputMask, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 451);
                done();
            });
        });

        it("Fails - add tenant - error getting tenant", (done) => {
            BL.modelObj = {};
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "12313",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(true, 0);
            };
            BL.model = Tenant;
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",

                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };
            BL.add(soajsClient, inputMask, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add tenant - malformed getting tenant ", (done) => {
            BL.modelObj = {};
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "12313",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {});
            };
            BL.model = Tenant;
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",

                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };
            BL.add(soajsClient, inputMask, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 453);
                done();
            });
        });

        it("Fails - add tenant - no code and failed listing tenants ", (done) => {
            BL.modelObj = {};
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "12313",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(true, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            BL.model = Tenant;
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",

                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };
            let soajs = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
                        }
                    },
                    key: {
                        generateExternalKey: (key, opt, opt1, opt2, cb) => {
                            return cb(null, "2313131312312");
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }
            };
            BL.add(soajsClient, inputMask, soajs, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add tenant - err when creating app key ", (done) => {
            BL.modelObj = {};
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "12313",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            BL.model = Tenant;
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",

                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };
            let soajs = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
                        }
                    },
                    key: {
                        generateExternalKey: (key, opt, opt1, opt2, cb) => {
                            return cb(null, "2313131312312");
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(true, "232423423423432");
                    }
                }
            };
            BL.add(soajsClient, inputMask, soajs, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add tenant - err when creating ext key ", (done) => {
            BL.modelObj = {};
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "12313",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            BL.model = Tenant;
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",
                        502: "Unable to create External key",

                        601: "Model not found",
                        602: "Model error: ",

                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };
            let soajs = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
                        }
                    },
                    key: {
                        generateExternalKey: (key, opt, opt1, opt2, cb) => {
                            return cb(true, "2313131312312");
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }
            };
            BL.add(soajsClient, inputMask, soajs, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 502);
                done();
            });
        });

        it("Fails - add tenant - err when getting environment ", (done) => {
            BL.modelObj = {};
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "12313",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            BL.model = Tenant;
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",

                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };
            let soajs = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(true, {code: "KUBE", serviceConfig: {key: "test"}});
                        }
                    },
                    key: {
                        generateExternalKey: (key, opt, opt1, opt2, cb) => {
                            return cb(null, "2313131312312");
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }
            };
            BL.add(soajsClient, inputMask, soajs, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add tenant - err no environment", (done) => {
            BL.modelObj = {};
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "12313",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });
            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            BL.model = Tenant;
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",

                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };
            let soajs = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, null);
                        }
                    },
                    key: {
                        generateExternalKey: (key, opt, opt1, opt2, cb) => {
                            return cb(null, "2313131312312");
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }
            };
            BL.add(soajsClient, inputMask, soajs, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 501);
                done();
            });
        });

        it("fail - add tenant - with application with internal key and extkey with fail", (done) => {
            let inputMask = {
                "name": "tenant only name",
                "description": "3221",
                "type": "client",
                "mainTenant": "1231231231",
                "oauth": {
                    "secret": "this is a secret test",
                    "redirectURI": "http://domain.com",
                    "grants": [
                        "password",
                        "refresh_token"
                    ],
                    "disabled": 0,
                    "type": 1,
                    "loginMode": "ouath"
                },
                "application": {
                    "productCode": "tyrv",
                    "packageCode": "sdfw",
                    "description": "123",
                    "_TTL": "6",
                    "appKey": {
                        "extKey": {
                            "label": "ttestkeylabel",
                            "env": "KUBE"
                        }
                    }
                }
            };
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",

                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            function Tenant() {
                console.log("Tenant");
            }

            Tenant.prototype.countTenants = (data, cb) => {
                return cb(null, 0);
            };
            Tenant.prototype.getTenant = (data, cb) => {
                return cb(null, {
                    code: "mainTenant",
                    _id: "1231231231"
                });

            };
            Tenant.prototype.listAllTenants = (data, cb) => {
                return cb(null, [{
                    code: "mainTenant",
                    _id: "1231231231"
                }]);
            };
            Tenant.prototype.closeConnection = () => {
            };
            Tenant.prototype.generateId = () => {
                return "idgenerated";
            };
            let fail = true;
            Tenant.prototype.addTenant = (data, cb) => {
                if (fail) {
                    fail = false;
                    return cb({message: "MongoDB Error: E11000 duplicate key error collection: local_core_provision.tenants index: code_1 dup key: { : \"twr2\" }"});
                } else {
                    return cb(true, null);
                }
            };

            BL.model = Tenant;
            BL.localConfig = {
                "tenant": {
                    "generatedCodeLength": 5,
                    "character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    "expDateTTL": 86400000
                },
                "errors": {
                    400: "Business logic required data are missing",
                    450: "Unable to find tenant",
                    451: "Tenant already exists",
                    452: "Main Tenant id is required!",
                    453: "Main Tenant is not found!",
                    454: "Unable to add tenant application",
                    455: "Unable to add a new key to the tenant application",
                    456: "Unable to add the tenant application ext Key",

                    460: "Unable to find product",
                    461: "Unable to find package",
                    462: "You are not allowed to remove the tenant you are currently logged in with",
                    466: "You are not allowed to remove the product you are currently logged in with",
                    467: "Package already exists",
                    468: "Product already exists",

                    470: "Unable to update product",
                    471: "Unable to update tenant",

                    500: "You cannot modify or delete a locked record",
                    501: "Environment record not found!",

                    601: "Model not found",
                    602: "Model error: ",
                },
            };
            let soajs = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
                        }
                    },
                    key: {
                        generateExternalKey: (key, opt, opt1, opt2, cb) => {
                            return cb(null, "2313131312312");
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }
            };
            BL.add(soajsClient, inputMask, soajs, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });
    });

    describe("Testing Update tenant profile", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - Update tenant profile - data - id", (done) => {
            let inputMask = {
                "id": "SomeID",
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "id": "SomeID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.updateProfile(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, true);
                done();
            });
        });

        it("Success - Update tenant profile - data - code", (done) => {
            let inputMask = {
                "code": "twr2",
                "profile": {
                    "fadi": "lebanon"
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "id": "SomeID",
                        "code": "twr2",
                        "name": "twr2 Tenant",
                        "description": "this is a description for twr2 tenant",
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.updateProfile(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, true);
                done();
            });
        });

        it("Success - Update tenant profile - no code no id", (done) => {
            let inputMask = {
                "profile": {
                    "fadi": "lebanon"
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "id": "maintenantID",
                        "code": "DBTN",
                        "name": "Main Tenant",
                        "description": "this is a description for twr2 tenant",
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.updateProfile(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, true);
                done();
            });
        });

        it("Fails - Update tenant profile - null data", (done) => {
            BL.modelObj = {};

            BL.updateProfile(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - Update tenant profile - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.updateProfile(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Update tenant profile - updateTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.updateProfile(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it("Fails - Update tenant profile - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.updateProfile(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - Update tenant profile - locked record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        locked: true,
                        console: true
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.updateProfile(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });
    });

    describe("Testing Update tenant", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - Update tenant - data - id", (done) => {
            let inputMask = {
                "id": "SomeID",
                "name": "Test Tenant",
                "description": "this is an updated description for test tenant",
                "tag": "sometag",
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "SomeID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.updateTenant(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 1);
                done();
            });
        });

        it("Success - Update tenant - data - code", (done) => {
            let inputMask = {
                "code": "twr2",
                "name": "Test Tenant",
                "description": "this is an updated description for twr2 tenant",
                "tag": "sometag",
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "id": "SomeID",
                        "code": "twr2",
                        "name": "twr2 Tenant",
                        "description": "this is a description for twr2 tenant",
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.updateTenant(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 1);
                done();
            });
        });

        it("Success - Update tenant - no data - no code", (done) => {
            let inputMask = {
                "name": "Test Tenant",
                "description": "this is an updated description for twr2 tenant",
                "tag": "sometag",
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "id": "MAINTENANT",
                        "code": "MAIN",
                        "name": "MAIN Tenant",
                        "description": "this is a description for MAIN tenant",
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.updateTenant(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 1);
                done();
            });
        });

        it("Fails - Update tenant - null data", (done) => {
            BL.modelObj = {};

            BL.updateTenant(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - Update tenant - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.updateTenant(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Update tenant - updateTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.updateTenant(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it("Fails - Update tenant - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.updateTenant(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - Update tenant - locked record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        locked: true,
                        console: true
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.updateTenant(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });
    });

    describe("Testing Update application of tenant", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - update tenant application - data - id (admin)", (done) => {
            let inputMask = {
                id: 'tenantID',
                appId: 'appID',
                _TTL: "12",
                description: 'TEN application for TEND_GUEST package updated'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "a139786a6e6d18e48b4987e83789430b",
                                        extKeys: [
                                            {
                                                extKey: "3d90163cf9d6b3076ad26aa5ed58556348069258e5c6c941ee0f18448b570ad1c5c790e2d2a1989680c55f4904e2005ff5f8e71606e4aa641e67882f4210ebbc5460ff305dcb36e6ec2a2299cf0448ef60b9e38f41950ec251c1cf41f05f3ce9",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ],
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.updateApplication(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 1);
                done();
            });
        });

        it("Success - update tenant application - data - no id", (done) => {
            let inputMask = {
                appId: 'appID',
                _TTL: "12",
                description: 'TEN application for TEND_GUEST package updated'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "a139786a6e6d18e48b4987e83789430b",
                                        extKeys: [
                                            {
                                                extKey: "3d90163cf9d6b3076ad26aa5ed58556348069258e5c6c941ee0f18448b570ad1c5c790e2d2a1989680c55f4904e2005ff5f8e71606e4aa641e67882f4210ebbc5460ff305dcb36e6ec2a2299cf0448ef60b9e38f41950ec251c1cf41f05f3ce9",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ],
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.updateApplication(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 1);
                done();
            });
        });

        it("Fails - Update tenant application - null data", (done) => {
            BL.modelObj = {};

            BL.updateApplication(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - Update tenant application - get tenant error", (done) => {

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.updateApplication(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Update tenant application - update tenants error", (done) => {
            let inputMask = {
                id: 'tenantID',
                appId: 'appID',
                _TTL: "12",
                description: 'TEN application for TEND_GUEST package updated'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "a139786a6e6d18e48b4987e83789430b",
                                        extKeys: [
                                            {
                                                extKey: "3d90163cf9d6b3076ad26aa5ed58556348069258e5c6c941ee0f18448b570ad1c5c790e2d2a1989680c55f4904e2005ff5f8e71606e4aa641e67882f4210ebbc5460ff305dcb36e6ec2a2299cf0448ef60b9e38f41950ec251c1cf41f05f3ce9",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(true, null)
                }
            };

            BL.updateApplication(soajs, inputMask, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it.skip("Fails - Update tenant application - app not found error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        applications: []
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(true, null)
                }
            };

            BL.updateApplication(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 472,
                    msg: soajs.config.errors[472]
                });
                done();
            });
        });

        it("Fails - Update tenant application - get tenant null record", (done) => {

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.updateApplication(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - Update tenant application - get tenant locked record", (done) => {

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        locked: true
                    });
                }
            };

            BL.updateApplication(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

    });

    describe("Testing Update application key of tenant", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - Update application key - data - id (admin)", (done) => {
            let inputMask = {
                id: 'tenantID',
                appId: 'appID',
                key: "KEY1",
                config: {
                    dashboard: {
                        oauth: {
                            loginMode: "urac"
                        },
                        commonFields: {
                            mail: {
                                from: "me@localhost.com",
                                transport: {
                                    type: "sendmail",
                                    options: {}
                                }
                            }
                        }
                    }
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "KEY1",
                                        extKeys: [
                                            {
                                                extKey: "extKey1",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ],
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.updateApplicationKey(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 1);
                done();
            });
        });

        it("Success - Update application key - data - no id", (done) => {
            let inputMask = {
                appId: 'appID',
                key: "KEY1",
                config: {
                    dashboard: {
                        oauth: {
                            loginMode: "urac"
                        },
                        commonFields: {
                            mail: {
                                from: "me@localhost.com",
                                transport: {
                                    type: "sendmail",
                                    options: {}
                                }
                            }
                        }
                    }
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "KEY1",
                                        extKeys: [
                                            {
                                                extKey: "extKey1",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ],
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.updateApplicationKey(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 1);
                done();
            });
        });

        it("Fails - Update application key - null data", (done) => {
            BL.modelObj = {};

            BL.updateApplicationKey(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - Update application key - get tenant error", (done) => {

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.updateApplicationKey(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Update application key - update tenants error", (done) => {
            let inputMask = {
                id: 'tenantID',
                appId: 'appID',
                key: "KEY1",
                config: {
                    dashboard: {
                        oauth: {
                            loginMode: "urac"
                        },
                        commonFields: {
                            mail: {
                                from: "me@localhost.com",
                                transport: {
                                    type: "sendmail",
                                    options: {}
                                }
                            }
                        }
                    }
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "KEY1",
                                        extKeys: [
                                            {
                                                extKey: "extkey1",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(true, null)
                }
            };

            BL.updateApplicationKey(soajs, inputMask, (err) => {
                assert.ok(err);
                console.log(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it.skip("Fails - Update application key - app key not found error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "KEY1",
                                        extKeys: [
                                            {
                                                extKey: "extkey1",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(true, null)
                }
            };

            BL.updateApplicationKey(soajs, {key: 'notFound', id: 'tenantID'}, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - Update application key - get tenant null record", (done) => {

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.updateApplicationKey(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - Update application key - get tenant locked record", (done) => {

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        locked: true
                    });
                }
            };

            BL.updateApplicationKey(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });
    });

    describe("Testing Update application external key of tenant", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - Update application external key - data - id (admin)", (done) => {
            let inputMask = {
                id: 'tenantID',
                appId: 'appID',
                key: "KEY1",
                extKey: "extkey1",
                expDate: new Date().getTime() + 172800000,
                device: {},
                geo: {},
                label: "labelUdate",
                extKeyEnv: "DASHBOARD",
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "KEY1",
                                        extKeys: [
                                            {
                                                extKey: "extKey1",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ],
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.updateApplication(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 1);
                done();
            });
        });

        it("Success - Update application external key - data - no id", (done) => {
            let inputMask = {
                appId: 'appID',
                key: "KEY1",
                extKey: "extKey1",
                expDate: new Date().getTime() + 172800000,
                device: {},
                geo: {},
                label: "labelUdate",
                extKeyEnv: "DEV",
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "KEY1",
                                        extKeys: [
                                            {
                                                extKey: "extKey1",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ],
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.updateApplicationExternalKey(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 1);
                done();
            });
        });

        it("Fails - Update application external key - null data", (done) => {
            BL.modelObj = {};

            BL.updateApplicationExternalKey(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - Update application external key - get tenant error", (done) => {

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.updateApplicationExternalKey(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Update application external key - update tenants error", (done) => {
            let inputMask = {
                id: 'tenantID',
                appId: 'appID',
                key: "KEY1",
                extKey: "extkey1",
                expDate: new Date().getTime() + 172800000,
                device: {},
                geo: {},
                label: "labelUdate",
                extKeyEnv: "DASHBOARD",
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "KEY1",
                                        extKeys: [
                                            {
                                                extKey: "extkey1",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(true, null)
                }
            };

            BL.updateApplicationExternalKey(soajs, inputMask, (err) => {
                assert.ok(err);
                console.log(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it.skip("Fails - Update application external key - app key not found error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "tenantID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                product: "TEND",
                                package: "TEND_GUEST",
                                description: "TEN application for TEND_GUEST package",
                                appId: "appID",
                                _TTL: 604800000,
                                keys: [
                                    {
                                        key: "KEY1",
                                        extKeys: [
                                            {
                                                extKey: "extkey1",
                                                device: null,
                                                geo: null,
                                                env: "DASHBOARD",
                                                dashboardAccess: true,
                                                expDate: null
                                            }
                                        ],
                                        config: {}
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputMask, cb) => {
                    return cb(true, null)
                }
            };

            BL.updateApplicationExternalKey(soajs, {key: 'notFound', id: 'tenantID'}, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - Update application external key - get tenant null record", (done) => {

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.updateApplicationExternalKey(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - Update application external key - get tenant locked record", (done) => {

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        locked: true
                    });
                }
            };

            BL.updateApplicationExternalKey(soajs, {}, (err) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });
    });

    describe("Testing Delete tenant", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - delete tenant - data", (done) => {
            let inputMask = {
                "id": "SomeID",
                "code": "test",
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "id": "SomeID",
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                    });
                },
                deleteTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.delete(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, true);
                done();
            });
        });

        it("Fails - delete tenant - null data", (done) => {
            BL.modelObj = {};

            BL.delete(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - delete tenant - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                },
                deleteTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.delete(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - delete tenant - deleteTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                    });
                },
                deleteTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.delete(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - delete tenant - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                },
                deleteTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.delete(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - delete tenant - locked record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        locked: true,
                        console: true
                    });
                },
                deleteTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };

            BL.delete(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - delete tenant - tenant logged in with", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        _id: "5c0e74ba9acc3c5a84a51259"
                    });
                },
                deleteTenant: (inputMask, cb) => {
                    return cb(null, true);
                }
            };
            soajs.tenant = {
                id: "5c0e74ba9acc3c5a84a51259",
                application: {
                    product: "TPROD",
                    package: "TPROD_TEST",
                }
            };
            BL.localConfig = {
                "tenant": {
                    "generatedCodeLength": 5,
                    "character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    "expDateTTL": 86400000
                },
                "errors": {
                    400: "Business logic required data are missing",
                    450: "Unable to find tenant",
                    451: "Tenant already exists",
                    452: "Main Tenant id is required!",
                    453: "Main Tenant is not found!",
                    454: "Unable to add tenant application",
                    455: "Unable to add a new key to the tenant application",
                    456: "Unable to add the tenant application ext Key",

                    460: "Unable to find product",
                    461: "Unable to find package",
                    462: "You are not allowed to remove the tenant you are currently logged in with",
                    466: "You are not allowed to remove the product you are currently logged in with",
                    467: "Package already exists",
                    468: "Product already exists",

                    470: "Unable to update product",
                    471: "Unable to update tenant",

                    500: "You cannot modify or delete a locked record",
                    501: "Environment record not found!",

                    601: "Model not found",
                    602: "Model error: ",
                },
            };
            BL.delete(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 462,
                    msg: soajs.config.errors[462]
                });
                done();
            });
        });
    });

    describe("Testing Get application", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - get application - data - (admin)", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.getApplication(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.product, "PROD");
                assert.deepEqual(record.appId, 'AppID');
                done();
            });
        });

        it("Success - get application - data - no id", (done) => {
            let inputMask = {
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.getApplication(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.product, "PROD");
                assert.deepEqual(record.appId, 'AppID');
                done();
            });
        });

        it("Fails - get application - null data", (done) => {
            BL.modelObj = {};

            BL.getApplication(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - get application - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.getApplication(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - get application - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.getApplication(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - get application - no Apps", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant"
                    });
                }
            };

            BL.getApplication(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 457);
                done();
            });
        });

        it("Fails - get application - Apps no appId", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.getApplication(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 457);
                done();
            });
        });

    });

    describe("Testing List applications", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - List applications - data - (admin)", (done) => {
            let inputMask = {
                id: 'TenantID',
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.listApplications(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(Array.isArray(record), true);
                assert.deepEqual(record.length, 1);
                done();
            });
        });

        it("Success - List applications - data - no id", (done) => {
            let inputMask = {};

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.listApplications(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(Array.isArray(record), true);
                assert.deepEqual(record.length, 1);
                done();
            });
        });

        it("Success - List applications - empty array - data - no id", (done) => {
            let inputMask = {};

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant"
                    });
                }
            };

            BL.listApplications(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(Array.isArray(record), true);
                assert.deepEqual(record.length, 0);
                done();
            });
        });

        it("Fails - List applications - null data", (done) => {
            BL.modelObj = {};

            BL.listApplications(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - List applications - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.listApplications(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - List applications - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.listApplications(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });
    });

    describe("Testing List application external keys", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - List application external keys - data - (admin)", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: "AppID",
                key: "KEY1"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.listApplicationExtKeys(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(Array.isArray(record), true);
                assert.deepEqual(record.length, 1);
                done();
            });
        });

        it("Success - List application external keys - data - no id", (done) => {
            let inputMask = {
                appId: "AppID",
                key: "KEY1"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.listApplicationExtKeys(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(Array.isArray(record), true);
                assert.deepEqual(record.length, 1);
                done();
            });
        });

        it("Success - List application external keys - empty array - data - no id", (done) => {
            let inputMask = {};

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant"
                    });
                }
            };

            BL.listApplicationExtKeys(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(Array.isArray(record), true);
                assert.deepEqual(record.length, 0);
                done();
            });
        });

        it("Fails - List application external keys - no App keys", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                            }
                        ]
                    });
                }
            };

            BL.listApplicationExtKeys(soajs, inputMask, (err, record) => {
                assert.deepEqual(Array.isArray(record), true);
                assert.deepEqual(record.length, 0);
                done();
            });
        });

        it("Fails - List application external keys - no App external keys", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID',
                key: "KEY1"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.listApplicationExtKeys(soajs, inputMask, (err, record) => {
                assert.deepEqual(Array.isArray(record), true);
                assert.deepEqual(record.length, 0);
                done();
            });
        });

        it("Fails - List application external keys - null data", (done) => {
            BL.modelObj = {};

            BL.listApplicationExtKeys(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - List application external keys - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.listApplicationExtKeys(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - List application external keys - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.listApplicationExtKeys(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });
    });

    describe("Testing delete application", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - delete application - data - (admin)", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                removeApplication: (inputmask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.deleteApplication(soajs, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - delete application - null data", (done) => {
            BL.modelObj = {};

            BL.deleteApplication(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - delete application - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.deleteApplication(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - delete application - removeApplication error", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                removeApplication: (inputmask, cb) => {
                    return cb(true, null);
                }
            };

            BL.deleteApplication(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it("Fails - delete application - data", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {locked: true});
                }
            };

            BL.deleteApplication(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - delete application - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.deleteApplication(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - delete application - tenant.id", (done) => {
            let inputMask = {
                id: '5c0e74ba9acc3c5a84a51259',
                appId: 'AppID'
            };

            let soa = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",
                        457: "Unable to find application",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        463: "Invalid product code or package code provided",

                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",
                        472: "Unable to get the tenant application",
                        473: "Unable to get the tenant application key",
                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",
                    },
                    "console": {
                        "product": "DSBRD"
                    },
                },
                tenant: {
                    id: "5c0e74ba9acc3c5a84a51259",
                    main: {
                        id: "5d8387fd1873f9079b863da0"
                    },
                    application: {
                        product: "TPROD",
                        package: "TPROD_TEST",
                    }
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "_id": '5c0e74ba9acc3c5a84a51259'
                    });
                }
            };

            BL.deleteApplication(soa, inputMask, (err, record) => {
                assert.ok(err);
                done();
            });
        });

    });

    describe("Testing delete application key", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - delete application key - data", (done) => {
            let inputMask = {
                id: 'TenantID',
                key: "KEY1",
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                removeApplicationKey: (inputmask, cb) => {
                    return cb(null, 1);
                }
            };

            BL.deleteApplicationKey(soajs, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - delete application key - null data", (done) => {
            BL.modelObj = {};

            BL.deleteApplicationKey(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - delete application key - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.deleteApplicationKey(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - delete application key - removeApplication error", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                removeApplicationKey: (inputmask, cb) => {
                    return cb(true, null);
                }
            };

            BL.deleteApplicationKey(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it("Fails - delete application key - data", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {locked: true});
                }
            };

            BL.deleteApplicationKey(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - delete application key - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.deleteApplicationKey(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - delete application key - tenant.id", (done) => {
            let inputMask = {
                id: '5c0e74ba9acc3c5a84a51259',
                appId: 'AppID'
            };

            let soa = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",
                        457: "Unable to find application",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        463: "Invalid product code or package code provided",

                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",
                        472: "Unable to get the tenant application",
                        473: "Unable to get the tenant application key",
                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",
                    },
                    "console": {
                        "product": "DSBRD"
                    },
                },
                tenant: {
                    id: "5c0e74ba9acc3c5a84a51259",
                    main: {
                        id: "5d8387fd1873f9079b863da0"
                    },
                    application: {
                        product: "TPROD",
                        package: "TPROD_TEST",
                    }
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "_id": '5c0e74ba9acc3c5a84a51259'
                    });
                }
            };

            BL.deleteApplicationKey(soa, inputMask, (err, record) => {
                assert.ok(err);
                done();
            });
        });

    });

    describe("Testing delete application external key", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - delete application external key - data", (done) => {
            let inputMask = {
                id: 'TenantID',
                key: "KEY1",
                appId: 'AppID',
                extKey: "EXTKEY1"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                }
            };

            BL.deleteApplicationExternalKey(soajs, inputMask, (err, record) => {
                assert.ok(record);
                console.log("reso", record);
                done();
            });
        });

        it("Fails - delete application external key - null data", (done) => {
            BL.modelObj = {};

            BL.deleteApplicationExternalKey(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - delete application external key - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.deleteApplicationExternalKey(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - delete application external key - updateTenant error", (done) => {
            let inputMask = {
                id: 'TenantID',
                key: "KEY1",
                appId: 'AppID',
                extKey: "EXTKEY1"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(true, null);
                }
            };

            BL.deleteApplicationExternalKey(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it("Fails - delete application external key - data", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {locked: true});
                }
            };

            BL.deleteApplicationExternalKey(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - delete application external key - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.deleteApplicationExternalKey(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

        it("Fails - delete application external key - tenant.id", (done) => {
            let inputMask = {
                id: 'TenantID',
                key: "KEY1",
                appId: 'AppID',
                extKey: "EXTKEY1"
            };

            let soa = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing",
                        450: "Unable to find tenant",
                        451: "Tenant already exists",
                        452: "Main Tenant id is required!",
                        453: "Main Tenant is not found!",
                        454: "Unable to add tenant application",
                        455: "Unable to add a new key to the tenant application",
                        456: "Unable to add the tenant application ext Key",
                        457: "Unable to find application",

                        460: "Unable to find product",
                        461: "Unable to find package",
                        462: "You are not allowed to remove the tenant you are currently logged in with",
                        463: "Invalid product code or package code provided",

                        466: "You are not allowed to remove the product you are currently logged in with",
                        467: "Package already exists",
                        468: "Product already exists",

                        470: "Unable to update product",
                        471: "Unable to update tenant",
                        472: "Unable to get the tenant application",
                        473: "Unable to get the tenant application key",
                        500: "You cannot modify or delete a locked record",
                        501: "Environment record not found!",

                        601: "Model not found",
                        602: "Model error: ",
                    },
                    "console": {
                        "product": "DSBRD"
                    },
                },
                tenant: {
                    id: "5c0e74ba9acc3c5a84a51259",
                    main: {
                        id: "5d8387fd1873f9079b863da0"
                    },
                    application: {
                        product: "TPROD",
                        package: "TPROD_TEST",
                    }
                },
                log: {
                    error: () => {
                        console.log();
                    }
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "_id": '5c0e74ba9acc3c5a84a51259'
                    });
                }
            };

            BL.deleteApplicationExternalKey(soa, inputMask, (err, record) => {
                assert.ok(err);
                done();
            });
        });

        it("Fails - delete application external key - no Apps", (done) => {
            let inputMask = {
                id: 'TenantID',
                key: "KEY1",
                appId: 'AppID',
                extKey: "EXTKEY1"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant"
                    });
                }
            };

            BL.deleteApplicationExternalKey(soajs, inputMask, (err, record) => {
                assert.deepEqual(record, 0);
                done();
            });
        });

        it("Fails - delete application external key - Apps no appId", (done) => {
            let inputMask = {
                id: 'TenantID',
                key: "KEY1",
                appId: 'AppID',
                extKey: "EXTKEY1"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.deleteApplicationExternalKey(soajs, inputMask, (err, record) => {
                assert.deepEqual(record, 0);
                done();
            });
        });

        it("Fails - delete application external key - Apps no extKeys", (done) => {
            let inputMask = {
                id: 'TenantID',
                key: "KEY1",
                appId: 'AppID',
                extKey: "EXTKEY1"
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "appId": 'AppID',
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            };

            BL.deleteApplicationExternalKey(soajs, inputMask, (err, record) => {
                assert.deepEqual(record, 0);
                done();
            });
        });
    });

    describe("Testing add application key", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let core = {
            core: {
                registry: {
                    loadByEnv: (env, cb) => {
                        return cb(null, {
                            serviceConfig: {
                                key: 'key1'
                            }
                        });
                    }
                },
                key: {
                    generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                        return cb(null, {
                            "extKey": 'extKey',
                            "device": {},
                            "geo": {},
                            "env": 'dashboard',
                            "label": 'label',
                            "expDate": '2019-09-27T13:54:17Z'
                        });
                    }
                }
            },
            provision: {
                generateInternalKey: (cb) => {
                    return cb(null, "232423423423432");
                }
            }

        };

        it("Success - add application key - data (admin)", (done) => {
            let inputMask = {
                id: 'TenantID',
                key: "KEY2",
                appId: 'AppID',
                extKey: {
                    label: 'dashboardk',
                    env: 'dashboard',
                    expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                    device: {},
                    geo: {}
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                }
            };

            BL.addApplicationKey(soajs, inputMask, core, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, true);
                done();
            });
        });

        it("Success - add application key - data", (done) => {
            let inputMask = {
                key: "KEY2",
                appId: 'AppID',
                extKey: {
                    label: 'dashboardk',
                    env: 'dashboard',
                    expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                    device: {},
                    geo: {}
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                }
            };

            BL.addApplicationKey(soajs, inputMask, core, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, true);
                done();
            });
        });

        it("Fails - add application key - null data", (done) => {
            BL.modelObj = {};

            BL.addApplicationKey(soajs, null, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - add application key - loadByEnv error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                }
            };

            let coreError = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(true, null);
                        }
                    },
                    key: {
                        generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                            return cb(null, {
                                "extKey": 'extKey',
                                "device": {},
                                "geo": {},
                                "env": 'dashboard',
                                "label": 'label',
                                "expDate": '2019-09-27T13:54:17Z'
                            });
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }

            };

            let inputMask = {
                id: 'TenantID',
                key: "KEY2",
                appId: 'AppID',
                extKey: {
                    label: 'dashboardk',
                    env: 'dashboard',
                    expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                    device: {},
                    geo: {}
                }
            };

            BL.addApplicationKey(soajs, inputMask, coreError, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add application key - no env error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                }
            };

            let coreError = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, null);
                        }
                    },
                    key: {
                        generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                            return cb(null, {
                                "extKey": 'extKey',
                                "device": {},
                                "geo": {},
                                "env": 'dashboard',
                                "label": 'label',
                                "expDate": '2019-09-27T13:54:17Z'
                            });
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }

            };

            let inputMask = {
                id: 'TenantID',
                key: "KEY2",
                appId: 'AppID',
                extKey: {
                    label: 'dashboardk',
                    env: 'dashboard',
                    expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                    device: {},
                    geo: {}
                }
            };

            BL.addApplicationKey(soajs, inputMask, coreError, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 501);
                done();
            });
        });

        it("Fails - add application key - generateExternalKey error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                }
            };

            let coreError = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {
                                serviceConfig: {
                                    key: 'key1'
                                }
                            });
                        }
                    },
                    key: {
                        generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                            return cb(true, null);
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }

            };

            let inputMask = {
                id: 'TenantID',
                key: "KEY2",
                appId: 'AppID',
                extKey: {
                    label: 'dashboardk',
                    env: 'dashboard',
                    expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                    device: {},
                    geo: {}
                }
            };

            BL.addApplicationKey(soajs, inputMask, coreError, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 502);
                done();
            });
        });

        it("Fails - add application key - generateInternalKey error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                }
            };

            let coreError = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {
                                serviceConfig: {
                                    key: 'key1'
                                }
                            });
                        }
                    },
                    key: {
                        generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                            return cb(null, {
                                "extKey": 'extKey',
                                "device": {},
                                "geo": {},
                                "env": 'dashboard',
                                "label": 'label',
                                "expDate": '2019-09-27T13:54:17Z'
                            });
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(true, null);
                    }
                }

            };

            let inputMask = {
                id: 'TenantID',
                key: "KEY2",
                appId: 'AppID',
                extKey: {
                    label: 'dashboardk',
                    env: 'dashboard',
                    expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                    device: {},
                    geo: {}
                }
            };

            BL.addApplicationKey(soajs, inputMask, coreError, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add application key - not found", (done) => {
            let inputMask = {
                id: 'TenantID',
                key: "KEY2",
                extKey: {
                    label: 'dashboardk',
                    env: 'dashboard',
                    expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                    device: {},
                    geo: {}
                }
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                }
            };

            BL.addApplicationKey(soajs, inputMask, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 472);
                done();
            });
        });

        it("Fails - add application key - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                }
            };

            BL.addApplicationKey(soajs, {}, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add application key - update Tenant error", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(true, null);
                }
            };

            BL.addApplicationKey(soajs, inputMask, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it("Fails - add application key - data", (done) => {
            let inputMask = {
                id: 'TenantID',
                appId: 'AppID'
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {locked: true});
                }
            };

            BL.addApplicationKey(soajs, inputMask, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - add application key - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                }
            };

            BL.addApplicationKey(soajs, {}, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

    });

    describe("Testing add application", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let core = {
            core: {
                registry: {
                    loadByEnv: (env, cb) => {
                        return cb(null, {
                            serviceConfig: {
                                key: 'key1'
                            }
                        });
                    }
                },
                key: {
                    generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                        return cb(null, {
                            "extKey": 'extKey',
                            "device": {},
                            "geo": {},
                            "env": 'dashboard',
                            "label": 'label',
                            "expDate": '2019-09-27T13:54:17Z'
                        });
                    }
                }
            },
            provision: {
                generateInternalKey: (cb) => {
                    return cb(null, "internalKey");
                }
            }

        };

        it("Success - add application - data (admin)", (done) => {
            let inputMask = {
                id: 'TenantID',
                description: '',
                productCode: '',
                packageCode: '',
                _TTL: '',
                appKey: {
                    config: {},
                    extKey: {
                        label: 'dashboardk',
                        env: 'dashboard',
                        expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                        device: {},
                        geo: {}
                    },
                },
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                },
                generateId: () => {
                    return 'id';
                }
            };

            BL.addApplication(soajs, inputMask, core, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 'internalKey');
                done();
            });
        });

        it("Success - add application - data", (done) => {
            let inputMask = {
                description: '',
                productCode: '',
                packageCode: '',
                _TTL: '',
                appKey: {
                    config: {},
                    extKey: {
                        label: 'dashboardk',
                        env: 'dashboard',
                        expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                        device: {},
                        geo: {}
                    },
                },
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                },
                generateId: () => {
                    return 'id';
                }
            };

            BL.addApplication(soajs, inputMask, core, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, 'internalKey');
                done();
            });
        });

        it("Fails - add application - null data", (done) => {
            BL.modelObj = {};

            BL.addApplication(soajs, null, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - add application - loadByEnv error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                },
                generateId: () => {
                    return 'id';
                }
            };

            let coreError = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(true, null);
                        }
                    },
                    key: {
                        generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                            return cb(null, {
                                "extKey": 'extKey',
                                "device": {},
                                "geo": {},
                                "env": 'dashboard',
                                "label": 'label',
                                "expDate": '2019-09-27T13:54:17Z'
                            });
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }

            };

            let inputMask = {
                id: 'TenantID',
                description: '',
                productCode: '',
                packageCode: '',
                _TTL: '',
                appKey: {
                    config: {},
                    extKey: {
                        label: 'dashboardk',
                        env: 'dashboard',
                        expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                        device: {},
                        geo: {}
                    },
                },
            };

            BL.addApplication(soajs, inputMask, coreError, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add application - no env error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                },
                generateId: () => {
                    return 'id';
                }
            };

            let coreError = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, null);
                        }
                    },
                    key: {
                        generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                            return cb(null, {
                                "extKey": 'extKey',
                                "device": {},
                                "geo": {},
                                "env": 'dashboard',
                                "label": 'label',
                                "expDate": '2019-09-27T13:54:17Z'
                            });
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }

            };

            let inputMask = {
                id: 'TenantID',
                description: '',
                productCode: '',
                packageCode: '',
                _TTL: '',
                appKey: {
                    config: {},
                    extKey: {
                        label: 'dashboardk',
                        env: 'dashboard',
                        expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                        device: {},
                        geo: {}
                    },
                },
            };

            BL.addApplication(soajs, inputMask, coreError, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 501);
                done();
            });
        });

        it("Fails - add application - generateExternalKey error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                },
                generateId: () => {
                    return 'id';
                }
            };

            let coreError = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {
                                serviceConfig: {
                                    key: 'key1'
                                }
                            });
                        }
                    },
                    key: {
                        generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                            return cb(true, null);
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(null, "232423423423432");
                    }
                }

            };

            let inputMask = {
                id: 'TenantID',
                description: '',
                productCode: '',
                packageCode: '',
                _TTL: '',
                appKey: {
                    config: {},
                    extKey: {
                        label: 'dashboardk',
                        env: 'dashboard',
                        expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                        device: {},
                        geo: {}
                    },
                },
            };

            BL.addApplication(soajs, inputMask, coreError, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 502);
                done();
            });
        });

        it("Fails - add application - generateInternalKey error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(null, true);
                },
                generateId: () => {
                    return 'id';
                }
            };

            let coreError = {
                core: {
                    registry: {
                        loadByEnv: (env, cb) => {
                            return cb(null, {
                                serviceConfig: {
                                    key: 'key1'
                                }
                            });
                        }
                    },
                    key: {
                        generateExternalKey: (interKey, opt1, opt2, key, cb) => {
                            return cb(null, {
                                "extKey": 'extKey',
                                "device": {},
                                "geo": {},
                                "env": 'dashboard',
                                "label": 'label',
                                "expDate": '2019-09-27T13:54:17Z'
                            });
                        }
                    }
                },
                provision: {
                    generateInternalKey: (cb) => {
                        return cb(true, null);
                    }
                }

            };

            let inputMask = {
                id: 'TenantID',
                description: '',
                productCode: '',
                packageCode: '',
                _TTL: '',
                appKey: {
                    config: {},
                    extKey: {
                        label: 'dashboardk',
                        env: 'dashboard',
                        expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                        device: {},
                        geo: {}
                    },
                },
            };

            BL.addApplication(soajs, inputMask, coreError, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add application - getTenant Error", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(true, null);
                },
                generateId: () => {
                    return 'id';
                }
            };

            BL.addApplication(soajs, {}, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add application - update Tenant error", (done) => {
            let inputMask = {
                id: 'TenantID',
                description: '',
                productCode: '',
                packageCode: '',
                _TTL: '',
                appKey: {
                    config: {},
                    extKey: {
                        label: 'dashboardk',
                        env: 'dashboard',
                        expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                        device: {},
                        geo: {}
                    },
                },
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {
                        "type": "product",
                        "oauth": {
                            secret: "this is a secret",
                            redirectURI: "http://domain.com",
                            grants: [
                                "password",
                                "refresh_token"
                            ],
                            disabled: 0,
                            type: 2.0,
                            loginMode: "urac",
                            pin: {
                                DSBRD: {
                                    enabled: false
                                }
                            },
                        },
                        "code": "test",
                        "name": "Test Tenant",
                        "description": "this is a description for test tenant",
                        "applications": [
                            {
                                "product": "PROD",
                                "package": "PROD_TEST",
                                "appId": "AppID",
                                "description": "this is a description",
                                "_TTL": 86400000, // 24 hours
                                "keys": [
                                    {
                                        "key": "KEY1",
                                        "extKeys": [
                                            {
                                                "expDate": new Date().getTime() + 86400000,
                                                "extKey": "EXTKEY1",
                                                "device": {},
                                                "geo": {}
                                            }
                                        ],
                                        "config": {
                                            "dev": {
                                                "commonFields": {},
                                                "oauth": {
                                                    "loginMode": 'urac'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                },
                updateTenant: (inputmask, cb) => {
                    return cb(true, null);
                },
                generateId: () => {
                    return 'id';
                }
            };

            BL.addApplication(soajs, inputMask, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 471,
                    msg: soajs.config.errors[471]
                });
                done();
            });
        });

        it("Fails - add application - data", (done) => {
            let inputMask = {
                id: 'TenantID',
                description: '',
                productCode: '',
                packageCode: '',
                _TTL: '',
                appKey: {
                    config: {},
                    extKey: {
                        label: 'dashboardk',
                        env: 'dashboard',
                        expDate: new Date().getTime() + 7 * 24 * 3600 * 1000,
                        device: {},
                        geo: {}
                    },
                },
            };

            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, {locked: true});
                },
                generateId: () => {
                    return 'id';
                }
            };

            BL.addApplication(soajs, inputMask, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - add application - no record", (done) => {
            BL.modelObj = {
                getTenant: (inputMask, cb) => {
                    return cb(null, null);
                },
                generateId: () => {
                    return 'id';
                }
            };

            BL.addApplication(soajs, {}, core, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 450,
                    msg: soajs.config.errors[450]
                });
                done();
            });
        });

    });

});
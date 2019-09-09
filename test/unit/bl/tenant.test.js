"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/tenant.js');
const assert = require('assert');

describe("Unit test for: BL - tenant", () => {

    let soajs = {
        config: {
            "errors": {
                421: "Unable to update the tenant record",
                423: "An id must be provided",
                426: 'Invalid Product ID provided',
                430: "Tenant not found for this user",
                436: "Unable to find tenants",
                437: "Unable to get the environment records",
                460: "Unable to find products",
                461: "Unable to find package",
                464: "You are not allowed to remove the key you are currently logged in with",
                466: "You are not allowed to remove the product you are currently logged in with",
                467: "Package already exists",
                468: "Product already exists",
                469: "Unable to add the product record",
                473: "Missing required fields",
                474: "Missing required field: either id or code",
                475: "Unable to remove product record",
                476: "Unable to update product record",
                477: "Invalid product code provided",
                500: "This record is locked. You cannot modify or delete it",
                601: "Model not found"
            },
        },
        uracDriver: true,
        urac_Profile: true,
        log: {
            error: () => {
                console.log();
            }
        }
    };

    describe("Testing list tenant", () => {
        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        it("Success - List tenants - null data", (done) => {
            BL.modelObj = {
                listTenants: (nullObject, cb) => {
                    return cb(null, []);
                }
            };
            BL.list(soajs, null, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Success - List tenants - null data - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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

            Tenant.prototype.listTenants = (data, cb) => {
                return cb(null, []);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.list(soajsClient, null, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Fails - List tenants - error", (done) => {
            BL.modelObj = {
                listTenants: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.list(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 436,
                    msg: soajs.config.errors[436]
                });
                done();
            });
        });

        it("Fails - List tenants - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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

            Tenant.prototype.listTenants = (data, cb) => {
                return cb(true, null);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;
            BL.list(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 436,
                    msg: soajs.config.errors[436]
                });
                done();
            });
        });
    });

    describe("Testing list Console tenants", () => {
        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        it("Success - List console tenants - null data", (done) => {
            let consoleTenant = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "DBTN",
                locked: true,
                name: "Console Tenant",
                description: "This is the tenant that holds the access rights and configuration for the console users with DSBRD_GUEST as Guest default package",
                oauth: {
                    secret: "this is a secret",
                    disabled: 0,
                    type: 2,
                    loginMode: "urac"
                },
                applications: [
                    {
                        product: "DSBRD",
                        package: "DSBRD_GUEST",
                        description: "Dashboard application for DSBRD_GUEST package",
                        appId: "5c0e74ba9acc3c5a84a5125a",
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
                                                    options: {

                                                    }
                                                }
                                            }
                                        },
                                        urac: {
                                            hashIterations: 1024,
                                            seedLength: 32,
                                            link: {
                                                addUser: "http://dashboard.soajs.org:80/#/setNewPassword",
                                                changeEmail: "http://dashboard.soajs.org:80/#/changeEmail/validate",
                                                forgotPassword: "http://dashboard.soajs.org:80/#/resetPassword",
                                                join: "http://dashboard.soajs.org:80/#/join/validate"
                                            },
                                            tokenExpiryTTL: 172800000,
                                            validateJoin: true,
                                            mail: {
                                                join: {
                                                    subject: "Welcome to SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/join.tmpl"
                                                },
                                                forgotPassword: {
                                                    subject: "Reset Your Password at SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/forgotPassword.tmpl"
                                                },
                                                addUser: {
                                                    subject: "Account Created at SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/addUser.tmpl"
                                                },
                                                changeUserStatus: {
                                                    subject: "Account Status changed at SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/changeUserStatus.tmpl"
                                                },
                                                changeEmail: {
                                                    subject: "Change Account Email at SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/changeEmail.tmpl"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ],
                tag: "Console"
            };
            BL.modelObj = {
                listConsoleTenants: (nullObject, cb) => {
                    return cb(null, consoleTenant);
                }
            };
            BL.listConsole(soajs, {negate: false}, (err, records) => {
                assert.ok(records);
                done();
            });
        });

        it("Success - List console tenants - null data - client tenant", (done) => {
            let consoleTenant = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "DBTN",
                locked: true,
                name: "Console Tenant",
                description: "This is the tenant that holds the access rights and configuration for the console users with DSBRD_GUEST as Guest default package",
                oauth: {
                    secret: "this is a secret",
                    disabled: 0,
                    type: 2,
                    loginMode: "urac"
                },
                applications: [
                    {
                        product: "DSBRD",
                        package: "DSBRD_GUEST",
                        description: "Dashboard application for DSBRD_GUEST package",
                        appId: "5c0e74ba9acc3c5a84a5125a",
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
                                                    options: {

                                                    }
                                                }
                                            }
                                        },
                                        urac: {
                                            hashIterations: 1024,
                                            seedLength: 32,
                                            link: {
                                                addUser: "http://dashboard.soajs.org:80/#/setNewPassword",
                                                changeEmail: "http://dashboard.soajs.org:80/#/changeEmail/validate",
                                                forgotPassword: "http://dashboard.soajs.org:80/#/resetPassword",
                                                join: "http://dashboard.soajs.org:80/#/join/validate"
                                            },
                                            tokenExpiryTTL: 172800000,
                                            validateJoin: true,
                                            mail: {
                                                join: {
                                                    subject: "Welcome to SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/join.tmpl"
                                                },
                                                forgotPassword: {
                                                    subject: "Reset Your Password at SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/forgotPassword.tmpl"
                                                },
                                                addUser: {
                                                    subject: "Account Created at SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/addUser.tmpl"
                                                },
                                                changeUserStatus: {
                                                    subject: "Account Status changed at SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/changeUserStatus.tmpl"
                                                },
                                                changeEmail: {
                                                    subject: "Change Account Email at SOAJS",
                                                    path: "undefined/soajs/node_modules/soajs.urac/mail/urac/changeEmail.tmpl"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ],
                tag: "Console"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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

            Tenant.prototype.listConsoleTenants = (data, cb) => {
                return cb(null, consoleTenant);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.listConsole(soajsClient, {negate: true}, (err, records) => {
                assert.ok(records);
                done();
            });
        });

        it("Fails - List console tenants - error", (done) => {
            BL.modelObj = {
                listConsoleTenants: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.listConsole(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - List console tenants - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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

            Tenant.prototype.listConsoleTenants = (data, cb) => {
                return cb(true, null);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;
            BL.listConsole(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });
    });

    describe("Testing get tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            id: 'anID',
        };

        let tenants = [];

        it("Success - get tenant - data - id", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };

            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, tenantRecord);
                }
            };
            BL.get(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - get tenant - data - id - client tenant", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.get(soajsClient, inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Success - get tenant - data - code", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            let data = {
                code: 'TEST'
            };
            BL.modelObj = {
                getTenant: (data, cb) => {
                    return cb(null, tenantRecord);
                }
            };
            BL.get(soajs, data, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - get tenant - data - code - client tenant", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            let data = {
                code: 'TEST'
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.get(soajsClient, data, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - get tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.get(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 474,
                    msg: soajs.config.errors[474]
                });
                done();
            });
        });

        it("Fails - get tenant - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        423: "An id must be provided",
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        474: "Missing required field: either id or code",
                        601: "Model not found"
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
            BL.get(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 474,
                    msg: soajs.config.errors[474]
                });
                done();
            });
        });

    });

    describe("Testing update tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            _id: "5c0e74ba9acc3c5a84a51259",
            name: 'Updated Name',
            description: 'Tenant after Update',
            type: 'client'
        };

        it("Success - update tenant - data", (done) => {
            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, {
                        "code": "test 2",
                        "name": "Test 2 Tenant",
                        "description": "this is a description for test 2 tenant"
                    });
                },
                updateTenant: (inputmaskData, cb) => {
                    return cb(null, true);
                }
            };
            BL.update(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - update tenant - data - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, {
                    "code": "test 2",
                    "name": "Test 2 Tenant",
                    "description": "this is a description for test 2 tenant"
                });
            };
            Tenant.prototype.updateTenant = (data, cb) => {
                return cb(null, true);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.update(soajsClient, inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - update tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.update(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - update tenant - null data - updateTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(null, {
                        "code": "test 2",
                        "name": "Test 2 Tenant",
                        "description": "this is a description for test 2 tenant"
                    });
                },
                updateTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.update(soajs, inputmaskData, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 421,
                    msg: soajs.config.errors[421]
                });
                done();
            });
        });

        it.skip("Fails - update tenant - null data - tenant locked error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(null, {
                        "code": "test 2",
                        "name": "Test 2 Tenant",
                        "description": "this is a description for test 2 tenant",
                        "locked": "true",
                        "console": "true"
                    });
                },
                updateTenant: (nullObject, cb) => {
                    return cb(null, null);
                }
            };
            BL.update(soajs, inputmaskData, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        }); //TODO: Check how to do this

        it("Fails - update tenant - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        473: "Missing required fields",
                        601: "Model not found"
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
            BL.update(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

    });

    describe("Testing get oauth of tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            id: 'anID',
        };

        it("Success - get oauth of tenant - data - id", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                }
            };

            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, tenantRecord);
                }
            };
            BL.getOAuth(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - get oauth of tenant - data - id - client tenant", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                }
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.getOAuth(soajsClient, inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - get oauth of tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.getOAuth(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

        it("Fails - get oauth of tenant - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        423: "An id must be provided",
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
            BL.getOAuth(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

    });

    describe("Testing list all applications of tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            id: 'anID',
        };

        it("Success - list all applications of tenant - data - id", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };

            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, tenantRecord);
                }
            };
            BL.listApplications(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - list all applications of tenant - data - id - client tenant", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.listApplications(soajsClient, inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - list all applications of tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.listApplications(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

        it("Fails - get tenant - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        423: "An id must be provided",
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
            BL.listApplications(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

    });

    describe("Testing delete oauth from tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            id: "5c0e74ba9acc3c5a84a51259",
        };

        it("Success - delete oauth from tenant - data", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, tenantRecord);
                },
                updateTenant: (inputmaskData, cb) => {
                    return cb(null, true);
                }
            };
            BL.deleteOAuth(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - delete oauth from tenant - data - client tenant", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.updateTenant = (data, cb) => {
                return cb(null, true);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.deleteOAuth(soajsClient, inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - delete oauth from tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.deleteOAuth(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

        it("Fails - delete oauth from tenant - null data - updateTenant error", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(null, tenantRecord);
                },
                updateTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.deleteOAuth(soajs, inputmaskData, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 421,
                    msg: soajs.config.errors[421]
                });
                done();
            });
        });

        it.skip("Fails - delete oauth from tenant - tenant locked error", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                locked: "true",
                console: "true",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(null, tenantRecord);
                },
                updateTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.update(soajs, inputmaskData, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - delete oauth - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
            Tenant.prototype.updateTenant = (data, cb) => {
                return cb(true, null);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;
            BL.deleteOAuth(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

    });

    describe("Testing get app keys from tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            id: 'anID',
            "appId": '5d64f93639d30a3e79d82895'
        };

        it("Success - get app keys from tenant - data", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                ],
                tag: "testing"
            };
            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, tenantRecord);
                }
            };
            BL.getApplicationKeys(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - get app keys from tenant - data - client tenant", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    }
                ],
                tag: "testing"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.getApplicationKeys(soajsClient, inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - get app keys from tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.getApplicationKeys(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

    });

    describe("Testing delete app key from tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            id: '5c0e74ba9acc3c5a84a51259',
            appId: '5d64f93639d30a3e79d82895',
            key: '2b32c3eb5169d3ecd105c86d18840c6b'
        };

        it("Success - delete app key from tenant - data", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                ],
                tag: "testing"
            };
            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, tenantRecord);
                },
                updateTenant: (inputmaskData, cb) => {
                    return cb(null, true);
                }
            };
            BL.deleteApplicationKey(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - delete app key from tenant - data - client tenant", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    }
                ],
                tag: "testing"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.updateTenant = (data, cb) => {
                return cb(null, true);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.deleteApplicationKey(soajsClient, inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - delete app key from tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.deleteApplicationKey(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - delete app key from tenant - null data - updateTenant error", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(null, {
                        key: "2b32c3eb5169d3ecd105c86d18840c6b",
                        extKeys: [
                            {
                                extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                device: {},
                                geo: {},
                                env: "DEV",
                                dashboardAccess: false,
                                label: "newKey",
                                expDate: 1567285200000.0
                            }
                        ],
                        config: {}
                    });
                },
                updateTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.deleteApplicationKey(soajs, inputmaskData, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 421,
                    msg: soajs.config.errors[421]
                });
                done();
            });
        });

        it.skip("Fails - delete app key from tenant - tenant locked error", (done) => {
            let tenantRecord = {
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                locked: "true",
                console: "true",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(null, tenantRecord);
                },
                updateTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.update(soajs, inputmaskData, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - delete app key - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        423: "An id must be provided",
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
            Tenant.prototype.updateTenant = (data, cb) => {
                return cb(true, null);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;
            BL.deleteOAuth(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });
    });

    describe("Testing list application external keys of tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            id: "5c0e74ba9acc3c5a84a51259",
        };

        it("Success - list application external keys of tenant - data - id", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                locked: "true",
                console: "true",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };


            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, tenantRecord);
                }
            };
            BL.listApplicationExtKeys(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - list application external keys of tenant - data - id - client tenant", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                locked: "true",
                console: "true",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.listApplicationExtKeys(soajsClient, inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - list application external keys of tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.listApplicationExtKeys(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

        it("Fails - list application external keys - get tenant - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        423: "An id must be provided",
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
            BL.listApplicationExtKeys(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

    });

    describe("Testing list application config of tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            id: 'anID',
        };

        it("Success - list application config of tenant - data - id", (done) => {

            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                locked: "true",
                console: "true",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };

            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, tenantRecord);
                }
            };
            BL.listApplicationConfig(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - list application config of tenant - data - id - client tenant", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                locked: "true",
                console: "true",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.listApplicationConfig(soajsClient, inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - list application config of tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.listApplicationConfig(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

        it("Fails - list application config - get tenant - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        423: "An id must be provided",
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
            BL.listApplicationConfig(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 423,
                    msg: soajs.config.errors[423]
                });
                done();
            });
        });

    });

    describe("Testing list dashboard keys of tenant", () => {

        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        let inputmaskData = {
            id: 'anID',
        };

        it("Success - list dashboard keys of tenant - data - id", (done) => {

            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };

            BL.modelObj = {
                getTenant: (inputmaskData, cb) => {
                    return cb(null, tenantRecord);
                }
            };
            BL.listDashboardKeys(soajs, inputmaskData, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - list dashboard keys of tenant - data - id - client tenant", (done) => {
            let tenantRecord = {
                _id: "5c0e74ba9acc3c5a84a51259",
                type: "product",
                code: "TEST",
                name: "test",
                description: "to tesst",
                oauth: {
                    secret: "this is a secret",
                    redirectURI: "http://domain.com",
                    grants: [
                        "password",
                        "refresh_token"
                    ],
                    disabled: 1,
                    type: 2,
                    loginMode: "oauth"
                },
                applications: [
                    {
                        product: "TPROD",
                        package: "TPROD_TEST",
                        appId: "5d64f93639d30a3e79d82895",
                        description: "Test",
                        _TTL: 21600000,
                        keys: [
                            {
                                key: "2b32c3eb5169d3ecd105c86d18840c6b",
                                extKeys: [
                                    {
                                        extKey: "449998078d44edb6025bb5f521bd40cbef74f2cb0e4d8d2419c8cd2073e0e664691ea16293f5792e62beaa4a70b3fe8ec7f203960f86e5afc9ea9870d8a0343e82b5118b7c47190c70e3f5335113b00c654fd358eb7e4b756e7408a443ae5ee5",
                                        device: {},
                                        geo: {},
                                        env: "DEV",
                                        dashboardAccess: false,
                                        label: "newKey",
                                        expDate: 1567285200000.0
                                    }
                                ],
                                config: {}
                            }
                        ]
                    },
                    {
                        product: "OTHER",
                        package: "OTHER_PACK1",
                        appId: "5d6516c1b151143ec5f41d2e",
                        description: null,
                        _TTL: 21600000,
                        keys: []
                    }
                ],
                tag: "testing"
            };
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        601: "Model not found"
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
                return cb(null, tenantRecord);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.listDashboardKeys(soajsClient, inputmaskData, (err, records) => {
                assert.ok(records);
                done();
            });
        });

        it("Fails - list dashboard keys of tenant - null data - getTenant error", (done) => {
            BL.modelObj = {
                getTenant: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.listDashboardKeys(soajs, null, (err, result) => {
                assert.ok(err);
                assert.equal(result, null);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - list dashboard keys - get tenant - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        436: "Unable to find tenants",
                        473: "Missing required fields",
                        601: "Model not found"
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
            BL.listDashboardKeys(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

    });
});
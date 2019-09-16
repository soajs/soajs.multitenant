"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/tenant.js');
const assert = require('assert');

describe("Unit test for: BL - tenant", () => {
    let soajs = {
        config: {
            "errors": {
                400: "Business logic required data are missing.",

                450: "Unable to find tenant",
                461: "Unable to find packages.",
                466: "You are not allowed to remove the product you are currently logged in with.",
                467: "Package already exists",
                468: "Product already exists.",

                470: "Unable to update product.",

                500: "You cannot modify or delete a locked record.",

                601: "Model not found.",
                602: "Model error: ",
            },
            "console": {
                "product": "DSBRD"
            },
        },
        tenant: {
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
                console.log("recordas", records);
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

        it("Fails - List tenants - no records", (done) => {
            BL.modelObj = {
                listTenants: (nullObject, cb) => {
                    return cb(null, null);
                }
            };
            BL.list(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {code: 450, msg: soajs.config.errors[450]});
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
                        400: "Business logic required data are missing."
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
                        400: "Business logic required data are missing."
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
                        400: "Business logic required data are missing."
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

});
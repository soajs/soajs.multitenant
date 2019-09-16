"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/product.js');
const assert = require('assert');

describe("Unit test for: BL - product", () => {

    let soajs = {
        config: {
            "errors": {
                400: "Business logic required data are missing.",

                460: "Unable to find product.",
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

    describe("Testing list Products", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - List products - null data", (done) => {
            BL.modelObj = {
                listProducts: (nullObject, cb) => {
                    return cb(null, []);
                }
            };
            BL.list(soajs, null, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Fails - List products - null data", (done) => {
            BL.modelObj = {
                listProducts: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.list(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Success - List products - null data - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.listProducts = (nullObject, cb) => {
                return cb(null, []);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.list(soajsClient, null, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Fails - List products - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.listProducts = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.list(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });
    });

    describe("Testing list console Products", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - List console products - null data", (done) => {
            BL.modelObj = {
                listConsoleProducts: (nullObject, cb) => {
                    return cb(null, []);
                }
            };
            BL.listConsole(soajs, null, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Fails - List console products - null data", (done) => {
            BL.modelObj = {
                listConsoleProducts: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.listConsole(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Success - List console products - null data - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.listConsoleProducts = (data, cb) => {
                return cb(null, []);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.listConsole(soajsClient, null, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Fails - List console products - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.listConsoleProducts = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.listConsole(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });
    });

    describe("Testing Get product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - Get product - code", (done) => {
            let inputMask = {
                code: "DSBRT"
            };

            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "DSBRT",
                        "name": "not Console UI Product",
                        "description": "This is the main Console UI Product.",
                    });
                }
            };
            BL.get(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "not Console UI Product");
                done();
            });
        });

        it("Success - Get product - id", (done) => {
            let inputMask = {
                id: "testid"
            };

            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "testid",
                        "name": "not Console UI Product",
                        "description": "This is the main Console UI Product.",
                    });
                }
            };
            BL.get(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "not Console UI Product");
                done();
            });
        });

        it("Fails - Get product - null data", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, null);
                }
            };
            BL.get(soajs, null, (err, record) => {
                assert.ok(err);
                assert.equal(err.code, 400);
                done();
            });
        });

        it("Success - Get product - code - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.getProduct = (data, cb) => {
                return cb(null, {
                    "code": "DSBRT",
                    "name": "not Console UI Product",
                    "description": "This is the main Console UI Product.",
                });
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            let inputMask = {
                code: "DSBRT"
            };

            BL.get(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "not Console UI Product");
                done();
            });
        });

        it("Success - Get product - id - client tenant", (done) => {
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

            Product.prototype.getProduct = (inputMask, cb) => {
                return cb(null, {
                    "_id": "testid",
                    "name": "Console UI Product",
                    "description": "This is the main Console UI Product.",
                });
            };

            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            let inputMask = {
                id: "testid"
            };

            BL.get(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "Console UI Product");
                done();
            });
        });

        it("Fail - Get product - null data - client tenant", (done) => {
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

            Product.prototype.getProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.get(soajsClient, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 400);
                done();
            });
        });

        it("Fail - Get product - null record - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.getProduct = (data, cb) => {
                return cb(null, null);
            };
            Product.prototype.closeConnection = () => {
            };

            BL.model = Product;

            BL.get(soajsClient, {id: "notfound"}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 460);
                done();
            });
        });

        it("Fail - Get product - mongo error when getting product", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.getProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };

            BL.model = Product;

            BL.get(soajsClient, {id: "found"}, (err, record) => {
                assert.deepEqual(err.code, 602);
                assert.ok(err);
                done();
            });
        });
    });

    describe("Testing Add Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - Add product - data with no scope", (done) => {
            let inputMask = {
                code: "TESTP",
                name: "Test Product",
                description: 'Some Test Description'
            };

            BL.modelObj = {
                addProduct: (inputMask, cb) => {
                    return cb(null, true);
                },
                checkIfExist: (inputMask, cb) => {
                    return cb(null, 0);
                }
            };
            BL.add(soajs, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Success - Add product - data with scope", (done) => {
            let inputMask = {
                code: "TESTP2",
                name: "Test 2 Product",
                description: 'Some Test Description',
                scope: {
                    acl: {
                        dashboard: {
                            multitenant: {
                                1: {
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
                            }
                        }
                    }
                }
            };

            BL.modelObj = {
                addProduct: (inputMask, cb) => {
                    return cb(null, true);
                },
                checkIfExist: (inputMask, cb) => {
                    return cb(null, 0);
                }
            };
            BL.add(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, true);
                done();
            });
        });

        it("Fails - Add product - Product Already Exist", (done) => {
            let inputMask = {
                code: 'DSBRT',
                name: 'not Main Product',
                description: 'Some Test Description'
            };

            BL.modelObj = {
                addProduct: (inputMask, cb) => {
                    return cb(null, true);
                },
                checkIfExist: (inputMask, cb) => {
                    return cb(null, 1);
                }
            };
            BL.add(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 468);
                done();
            });
        });

        it("Fails - Add product - Product Already Exist - client tenant", (done) => {
            let inputMask = {
                code: 'DSBRT',
                name: 'not Main Product',
            };
            let soajsClient = {
                config: {
                    "errors": {
                        468: "Product already exists",
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.addProduct = (data, cb) => {
                return cb(null, true);
            };
            Product.prototype.checkIfExist = (data, cb) => {
                return cb(null, 1);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.add(soajsClient, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 468);
                done();
            });
        });

        it("Fails - Add product - mongo error check if exists - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
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
            let inputMask = {
                code: 'DSBRT',
                name: 'not Main Product',
            };

            function Product() {
                console.log("Product");
            }

            Product.prototype.addProduct = (data, cb) => {
                return cb(null, true);
            };
            Product.prototype.checkIfExist = (data, cb) => {
                return cb(true);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.add(soajsClient, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Add product - mongo error when adding product - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
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
            let inputMask = {
                code: 'DSBRT',
                name: 'not Main Product',
            };

            function Product() {
                console.log("Product");
            }

            Product.prototype.addProduct = (data, cb) => {
                return cb(true);
            };
            Product.prototype.checkIfExist = (data, cb) => {
                return cb(null, 0);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.add(soajsClient, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Add product - null Data", (done) => {
            BL.modelObj = {
                addProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                checkIfExist: (inputMask, cb) => {
                    return cb(true, null);
                }
            };
            BL.add(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 400);
                done();
            });
        });

        it("Success - Add product - code - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.addProduct = (data, cb) => {
                return cb(null, true);
            };
            Product.prototype.checkIfExist = (data, cb) => {
                return cb(null, 0);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            let inputMask = {
                code: "TESTR",
                name: "Test 2 Product"
            };

            BL.add(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });
    });

    describe("Testing Update Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - update product - id", (done) => {
            let inputMask = {
                _id: "SOMEID",
                name: "Some Name",
                description: "A desc to update product",
                scope: {}
            };

            BL.modelObj = {
                updateProduct: (inputMask, cb) => {
                    return cb(null, true);
                },
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "SOMEID",
                        "name": "Some Product",
                        "description": "This is Some Product.",
                    });
                }
            };
            BL.update(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, true);
                done();
            });
        });

        it("Fails - Update product - get product error", (done) => {
            let inputMask = {};

            BL.modelObj = {
                updateProduct: (inputMask, cb) => {
                    return cb(null, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(true, null);
                }
            };
            BL.update(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Update product - null Data", (done) => {
            BL.modelObj = {
                updateProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                checkIfExist: (inputMask, cb) => {
                    return cb(true, null);
                }
            };
            BL.update(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 400);
                done();
            });
        });

        it("Fails - Update product - update error", (done) => {
            BL.modelObj = {
                getProduct: (inputmask, cb) => {
                    return cb(null, {});
                },
                updateProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                checkIfExist: (inputMask, cb) => {
                    return cb(null, 0);
                }
            };
            BL.update(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 400);
                done();
            });
        });

        it("Fails - Update product - no record", (done) => {
            BL.modelObj = {
                getProduct: (inputmask, cb) => {
                    return cb(null, null);
                },
                updateProduct: (inputMask, cb) => {
                    return cb(null, null);
                }
            };
            BL.update(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });

        it("Fails - Update product - locked", (done) => {
            BL.modelObj = {
                getProduct: (inputmask, cb) => {
                    return cb(null, {
                        locked: true,
                        console: true
                    });
                },
                updateProduct: (inputMask, cb) => {
                    return cb(null, null);
                }
            };
            BL.update(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - Update product - update error", (done) => {
            BL.modelObj = {
                getProduct: (inputmask, cb) => {
                    return cb(null, {
                        locked: false,
                        console: false
                    });
                },
                updateProduct: (inputMask, cb) => {
                    return cb(true, null);
                }
            };
            BL.update(soajs, {}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 470,
                    msg: soajs.config.errors[470]
                });
                done();
            });
        });

    });

    describe("Testing purge Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            id: "SomeProductID",
            description: "Pack Description after update",
        };

        it("Success - purge product - data", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                saveProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.purge(soajs, inputMask, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - purge product  - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.getProduct = (inputMask, cb) => {
                return cb(null, {
                    "code": "TPROD",
                    "name": "Test Product",
                    "description": "this is a description for test product",
                    "packages": [
                        {
                            "code": "TPROD_BASIC",
                            "name": "basic package",
                            "description": "this is a description for test product basic package",
                            "acl": {
                                "urac": {},
                                "multitenant": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        }
                    ]
                });
            };

            Product.prototype.saveProduct = (data, cb) => {
                return cb(null, true);
            };

            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.purge(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - purge product - null data", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                },
                saveProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.purge(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - purge product - save product err", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, {
                        packages: [
                            {
                                name: "totestonly"
                            }
                        ]
                    });
                },
                saveProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.purge(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602
                );
                done();
            });
        });

        it("Fails - purge product - save product err", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.purge(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602
                );
                done();
            });
        });

        it("Fails - purge product - no record err", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, null);
                },
                saveProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.purge(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 460
                );
                done();
            });
        });

        it("Fails - purge product - locked record err", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, {
                        locked: true
                    });
                },
                saveProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.purge(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - purge product - error - client tenant", (done) => {
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

            Product.prototype.getProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.saveProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.purge(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajsClient.config.errors[400]
                });
                done();
            });
        });

    });

    describe("Testing Update Scope Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            id: "DummyID",
            scope: {
                acl: {
                    dashboard: {
                        multitenant: {
                            1: {
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
                        }
                    }
                }
            }
        };

        it("Fails - update product scope - null data", (done) => {
            BL.modelObj = {};
            BL.updateScope(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Success - update product scope - data", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.updateScope(soajs, inputMask, (err, result) => {
                assert.ok(result);
                assert.deepEqual(result, true);
                done();
            });
        });

        it("Fails - update product scope - getProduct error", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(true, null);
                }
            };
            BL.updateScope(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - update product scope - no record error", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, null);
                }
            };
            BL.updateScope(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });

        it("Fails - update product scope - locked record error", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        locked: true,
                        console: true
                    });
                }
            };
            BL.updateScope(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - update product scope - updateProduct error", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.updateScope(soajs, inputMask, (err, result) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 470,
                    msg: soajs.config.errors[470]
                });
                done();
            });
        });

    });

    describe("Testing Delete Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - Delete product - code", (done) => {
            let inputMask = {
                code: "TESTP",
            };

            BL.modelObj = {
                deleteProduct: (inputMask, cb) => {
                    return cb(null, true);
                },
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "name": "Some Product",
                        "description": "This is Some Product.",
                    });
                }
            };
            BL.delete(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, true);
                done();
            });
        });

        it("Fails - Delete product - valid id", (done) => {
            let inputMask = {
                id: "someID",
            };

            BL.modelObj = {
                deleteProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(true, null);
                }
            };
            BL.delete(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Delete product - valid id no record", (done) => {
            let inputMask = {
                id: "someID",
            };

            BL.modelObj = {
                deleteProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(null, null);
                }
            };
            BL.delete(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });

        it("Fails - Delete product - null Data", (done) => {
            BL.modelObj = {
                addProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                checkIfExist: (inputMask, cb) => {
                    return cb(true, null);
                }
            };
            BL.delete(soajs, null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - Delete product - code no record", (done) => {
            let inputMask = {
                code: "someCode",
            };

            BL.modelObj = {
                deleteProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(null, null);
                }
            };
            BL.delete(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });

        let soajs2 = {
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
                    601: "Model not found",
                    602: "Model error: ",
                },
                "console": {
                    "product": "DSBRD"
                },
            },
            tenant: {
                application: {
                    product: "DSBRD",
                    package: "DSBRD_TEST",
                }
            },
            log: {
                error: () => {
                    console.log();
                }
            }
        };

        it("Fails - Delete product - Tenant product", (done) => {
            let inputMask = {
                code: "DSBRD",
            };

            BL.modelObj = {
                deleteProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        code: "DSBRD"
                    });
                }
            };
            BL.delete(soajs2, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 466,
                    msg: soajs.config.errors[466]
                });
                done();
            });
        });

        it("Fails - Delete product - locked record", (done) => {
            let inputMask = {
                code: "someCode",
            };

            BL.modelObj = {
                deleteProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        locked: true,
                        console: true
                    });
                }
            };
            BL.delete(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - Delete product - not valid id", (done) => {
            let inputMask = {
                id: "NOTVALID",
            };

            BL.modelObj = {
                deleteProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(null, null);
                }
            };
            BL.delete(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });

        it("Fails - Delete product - no code and id", (done) => {
            let inputMask = {};

            BL.modelObj = {
                deleteProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(true, null);
                }
            };
            BL.delete(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - Delete product - delete product error", (done) => {
            let inputMask = {
                code: 'some'
            };

            BL.modelObj = {
                deleteProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(null, {});
                }
            };
            BL.delete(soajs, inputMask, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

    });

    describe("Testing list all packages inside Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            id: "ID"
        };

        let inputMaskTwo = {
            code: "SOME"
        };

        it("Success - List packages - id", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                }
            };
            BL.getPackages(soajs, inputMask, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Success - List packages - code", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                }
            };
            BL.getPackages(soajs, inputMaskTwo, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Success - List packages  - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        423: "An id must be provided",
                        460: "Unable to find product",
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

            let inputMask = {
                id: "ID"
            };

            function Product() {
                console.log("Product");
            }

            Product.prototype.getProduct = (inputMask, cb) => {
                return cb(null, {
                    "code": "TPROD",
                    "name": "Test Product",
                    "description": "this is a description for test product",
                    "packages": [
                        {
                            "code": "TPROD_BASIC",
                            "name": "basic package",
                            "description": "this is a description for test product basic package",
                            "acl": {
                                "urac": {},
                                "multitenant": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        },
                        {
                            "code": "TPROD_EXAMPLE03",
                            "name": "example03 package",
                            "description": "this is a description for test product example03 package",
                            "acl": {
                                "urac": {},
                                "example03": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        }
                    ]
                });
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.getPackages(soajsClient, inputMask, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Fails - List packages - null data", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.getPackages(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 400);
                done();
            });
        });

        it("Fails - List packages - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        423: "An id must be provided",
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.getProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.getPackages(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 400);
                done();
            });
        });

        it("Fails - List packages - getProduct err", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.getPackages(soajs, inputMask, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - List packages - no record", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, null);
                }
            };
            BL.getPackages(soajs, inputMask, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 461);
                done();
            });
        });

    });

    describe("Testing get package inside Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            packageCode: "TPROD_BASIC",
            code: "TPROD",
        };

        it("Success - get package - null data", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                }
            };
            BL.getPackage(soajs, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Success - get package  - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.getProduct = (inputMask, cb) => {
                return cb(null, {
                    "code": "TPROD",
                    "name": "Test Product",
                    "description": "this is a description for test product",
                    "packages": [
                        {
                            "code": "TPROD_BASIC",
                            "name": "basic package",
                            "description": "this is a description for test product basic package",
                            "acl": {
                                "urac": {},
                                "multitenant": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        },
                        {
                            "code": "TPROD_EXAMPLE03",
                            "name": "example03 package",
                            "description": "this is a description for test product example03 package",
                            "acl": {
                                "urac": {},
                                "example03": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        }
                    ]
                });
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.getPackage(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - get package - null data", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.getPackage(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 400);
                done();
            });
        });

        it("Fails - get package - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        400: "Business logic required data are missing.",
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

            Product.prototype.getProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.getPackage(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 400);
                done();
            });
        });

        it("Fails - get package - getProduct err", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.getPackage(soajs, inputMask, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - get package - no record", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, null);
                }
            };
            BL.getPackage(soajs, inputMask, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 461);
                done();
            });
        });

    });

    describe("Testing add package inside Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            "code": "NEW",
            "id": "SomeProductID",
            "name": "PACK_NAME2",
            "description": "Pack Description new",
            "_TTL": 12,
            "tags": [
                "some", "to", "test"
            ]
        };

        it("Success - add package - data", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.addPackage(soajs, inputMask, (err, result) => {
                assert.ok(result);
                assert.deepEqual(result, "TPROD_NEW");
                done();
            });
        });

        it("Success - add package - data - no packages in record", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product"
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.addPackage(soajs, inputMask, (err, result) => {
                assert.ok(result);
                assert.deepEqual(result, "TPROD_NEW");
                done();
            });
        });

        it("Success - add package  - client tenant", (done) => {
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

            Product.prototype.getProduct = (inputMask, cb) => {
                return cb(null, {
                    "code": "TPROD",
                    "name": "Test Product",
                    "description": "this is a description for test product",
                    "packages": [
                        {
                            "code": "TPROD_BASIC",
                            "name": "basic package",
                            "description": "this is a description for test product basic package",
                            "acl": {
                                "urac": {},
                                "multitenant": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        },
                        {
                            "code": "TPROD_EXAMPLE03",
                            "name": "example03 package",
                            "description": "this is a description for test product example03 package",
                            "acl": {
                                "urac": {},
                                "example03": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        }
                    ]
                });
            };

            Product.prototype.updateProduct = (data, cb) => {
                return cb(null, true);
            };

            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.addPackage(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, "TPROD_NEW");
                done();
            });
        });

        it("Fails - add package - null data", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                },
                updateProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.addPackage(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - add package - error - client tenant", (done) => {
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

            Product.prototype.getProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.updateProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.addPackage(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajsClient.config.errors[400]
                });
                done();
            });
        });

        it("Fails - add package - getProduct error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, null);
                }
            };
            BL.addPackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });

        it("Fails - add package - no record error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.addPackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - add package - locked record error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, {
                        locked: true,
                        console: true
                    });
                }
            };
            BL.addPackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - add package - data - package found", (done) => {
            let inputmaskData = {
                "code": "BASIC",
                "id": "SomeProductID",
                "name": "PACK_NAME2",
                "description": "Pack Description new",
                "_TTL": 12,
                "tags": [
                    "some", "to", "test"
                ]
            };
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.addPackage(soajs, inputmaskData, (err, result) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 467,
                    msg: soajs.config.errors[467]
                });
                done();
            });
        });

        it("Fails - add package - updateProduct error", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.addPackage(soajs, inputMask, (err, result) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

    });

    describe("Testing update package inside Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            "code": "EXAMPLE03",
            "id": "SomeProductID",
            "name": "PACK_NAME3",
            "description": "Pack Description after update",
            "_TTL": 86400000,
            "acl": {},
            "tags": [
                "some", "to", "test"
            ]
        };

        it("Success - update package - data", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.updatePackage(soajs, inputMask, (err, result) => {
                assert.ok(result);
                assert.deepEqual(result, "product package EXAMPLE03 updated successfully");
                done();
            });
        });

        it("Success - update package  - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.getProduct = (inputMask, cb) => {
                return cb(null, {
                    "code": "TPROD",
                    "name": "Test Product",
                    "description": "this is a description for test product",
                    "packages": [
                        {
                            "code": "TPROD_BASIC",
                            "name": "basic package",
                            "description": "this is a description for test product basic package",
                            "acl": {
                                "urac": {},
                                "multitenant": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        },
                        {
                            "code": "TPROD_EXAMPLE03",
                            "name": "example03 package",
                            "description": "this is a description for test product example03 package",
                            "acl": {
                                "urac": {},
                                "example03": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        }
                    ]
                });
            };

            Product.prototype.updateProduct = (data, cb) => {
                return cb(null, true);
            };

            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.updatePackage(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record, "product package EXAMPLE03 updated successfully");
                done();
            });
        });

        it("Fails - update package - data - no packages in record", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product"
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.updatePackage(soajs, inputMask, (err, result) => {
                assert.ok(err, {
                    code: 461,
                    msg: soajs.config.errors[461]
                });
                done();
            });
        });

        it("Fails - update package - null data", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                },
                updateProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.updatePackage(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - update package - error - client tenant", (done) => {
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

            Product.prototype.getProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.updateProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.updatePackage(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajsClient.config.errors[400]
                });
                done();
            });
        });

        it("Fails - update package - getProduct error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, null);
                }
            };
            BL.updatePackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });

        it("Fails - update package - no record error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.updatePackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - update package - locked record error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, {
                        locked: true,
                        console: true
                    });
                }
            };
            BL.updatePackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - update package - data - package not found", (done) => {
            let inputmaskData = {
                "code": "NOTFND",
                "id": "SomeProductID",
                "name": "PACK_NAME2",
                "description": "Pack Description new",
                "_TTL": 12,
                "tags": [
                    "some", "to", "test"
                ]
            };
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.updatePackage(soajs, inputmaskData, (err, result) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 461,
                    msg: soajs.config.errors[461]
                });
                done();
            });
        });

        it("Fails - update package - updateProduct error", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.updatePackage(soajs, inputMask, (err, result) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

    });

    describe("Testing delete package inside Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            id: "Some",
            packageCode: "TPROD_EXAMPLE03",
        };

        it("Success - delete package - data", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "_id": "Some",
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.deletePackage(soajs, inputMask, (err, result) => {
                assert.ok(result);
                assert.deepEqual(result, "product package TPROD_EXAMPLE03 deleted successfully");
                done();
            });
        });

        it("Success - delete package  - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find product",
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

            function Product() {
                console.log("Product");
            }

            Product.prototype.getProduct = (inputMask, cb) => {
                return cb(null, {
                    "code": "TPROD",
                    "name": "Test Product",
                    "description": "this is a description for test product",
                    "packages": [
                        {
                            "code": "TPROD_BASIC",
                            "name": "basic package",
                            "description": "this is a description for test product basic package",
                            "acl": {
                                "urac": {},
                                "multitenant": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        },
                        {
                            "code": "TPROD_EXAMPLE03",
                            "name": "example03 package",
                            "description": "this is a description for test product example03 package",
                            "acl": {
                                "urac": {},
                                "example03": {}
                            },
                            "_TTL": 86400000 // 24 hours
                        }
                    ]
                });
            };

            Product.prototype.updateProduct = (data, cb) => {
                return cb(null, true);
            };

            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.getPackage(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - delete package - null data", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                },
                updateProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.deletePackage(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajs.config.errors[400]
                });
                done();
            });
        });

        it("Fails - delete package - error - client tenant", (done) => {
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

            Product.prototype.getProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.updateProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.deletePackage(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 400,
                    msg: soajsClient.config.errors[400]
                });
                done();
            });
        });

        it("Fails - delete package - getProduct error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, null);
                }
            };
            BL.deletePackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });

        it("Fails - delete package - no record error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.deletePackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err.code, 602);
                done();
            });
        });

        it("Fails - delete package - record no packages error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, {
                        "_id": "sd"
                    });
                }
            };
            BL.deletePackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 461,
                    msg: soajs.config.errors[461]
                });
                done();
            });
        });

        it("Fails - delete package - locked record error", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(null, {
                        locked: true,
                        console: true
                    });
                }
            };
            BL.deletePackage(soajs, {}, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 500,
                    msg: soajs.config.errors[500]
                });
                done();
            });
        });

        it("Fails - delete package - data - package not found", (done) => {
            let inputmaskData = {
                "code": "NOTFND",
                "id": "SomeProductID",
                "name": "PACK_NAME2",
                "description": "Pack Description new",
                "_TTL": 12,
                "tags": [
                    "some", "to", "test"
                ]
            };
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(null, true);
                }
            };
            BL.deletePackage(soajs, inputmaskData, (err, result) => {
                assert.ok(err);
                assert.deepEqual(err, {
                    code: 461,
                    msg: soajs.config.errors[461]
                });
                done();
            });
        });

        it("Fails - delete package - updateProduct error", (done) => {
            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "TPROD",
                        "name": "Test Product",
                        "description": "this is a description for test product",
                        "packages": [
                            {
                                "code": "TPROD_BASIC",
                                "name": "basic package",
                                "description": "this is a description for test product basic package",
                                "acl": {
                                    "urac": {},
                                    "multitenant": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            },
                            {
                                "code": "TPROD_EXAMPLE03",
                                "name": "example03 package",
                                "description": "this is a description for test product example03 package",
                                "acl": {
                                    "urac": {},
                                    "example03": {}
                                },
                                "_TTL": 86400000 // 24 hours
                            }
                        ]
                    });
                },
                updateProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.deletePackage(soajs, inputMask, (err, result) => {
                assert.ok(err);
                assert.deepEqual(err.code, 602);
                done();
            });
        });
    });

});
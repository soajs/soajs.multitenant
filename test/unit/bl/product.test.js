"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/product.js');
const assert = require('assert');

let products;

describe("Unit test for: BL - product", () => {

    let soajs = {
        config: {
            "errors": {
                400: "Business logic required data are missing.",

                460: "Unable to find product.",
                461: "Unable to find packages.",
                466: "You are not allowed to remove the product you are currently logged in with.",
                468: "Product already exists.",
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

        it("Fails - List products - null config", (done) => {
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

        it("Fails - List console products - null config", (done) => {
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
                code: "DSBRD"
            };

            BL.modelObj = {
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "code": "DSBRD",
                        "name": "Console UI Product",
                        "description": "This is the main Console UI Product.",
                    });
                }
            };
            BL.get(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "Console UI Product");
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
                        "name": "Console UI Product",
                        "description": "This is the main Console UI Product.",
                    });
                }
            };
            BL.get(soajs, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "Console UI Product");
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
                    "code": "DSBRD",
                    "name": "Console UI Product",
                    "description": "This is the main Console UI Product.",
                });
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            let inputMask = {
                code: "DSBRD"
            };

            BL.get(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                assert.deepEqual(record.name, "Console UI Product");
                done();
            });
        });

        it("Success - Get product - id - client tenant", (done) => {
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

    describe.skip("Testing Add Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - Add product - code, name", (done) => {
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

        it("Fails - Add product - Product Already Exist", (done) => {
            let inputMask = {
                code: 'DSBRT',
                name: 'Some Product',
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
                console.log(err);
                assert.deepEqual(err.code, 468);
                done();
            });
        });

        it("Fails - Add product - Product Already Exist - client tenant", (done) => {
            let inputMask = {
                code: 'DSBRD',
                name: 'Main Product'
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
                code: 'DSBRD',
                name: 'Main Product'
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
                        469: "Unable to add the product record",
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
                code: 'DSBRD',
                name: 'Main Product'
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
                assert.deepEqual(err.code, 469);
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
                assert.deepEqual(err.code, 474);
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
                code: "TEST2",
                name: "Test 2 Product"
            };

            BL.add(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });
    });

    describe.skip("Testing Delete Product", () => {
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
                assert.deepEqual(err.code, 474);
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
                    return cb(null, {});
                }
            };
            BL.delete(soajs2, inputMask, (err, record) => {
                assert.ok(err);
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
                assert.deepEqual(err.code, 500);
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
                done();
            });
        });
    });

    describe.skip("Testing Update Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        it("Success - update product - id", (done) => {
            let inputMask = {
                id: "SOMEID",
                name: "Some Name",
                description: "A desc to update product"
            };

            BL.modelObj = {
                updateProduct: (inputMask, cb) => {
                    return cb(null, true);
                },
                getProduct: (inputMask, cb) => {
                    return cb(null, {
                        "name": "Some Product",
                        "description": "This is Some Product.",
                    });
                }
            };
            BL.update(soajs, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - Update product - no data", (done) => {
            let inputMask = {};

            BL.modelObj = {
                updateProduct: (inputMask, cb) => {
                    return cb(true, null);
                },
                getProduct: (inputMask, cb) => {
                    return cb(true, null);
                }
            };
            BL.update(soajs, inputMask, (err, record) => {
                assert.ok(err);
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
                assert.deepEqual(err.code, 473);
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
                assert.deepEqual(err.code, 473);
                done();
            });
        });

    });

    describe.skip("Testing Update Scope Product", () => {
    	afterEach((done) => {
    		BL.modelObj = null;
    		done();
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

        it("Fails - List packages - null config", (done) => {
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

        it("Fails - get package - null config", (done) => {
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

    describe.skip("Testing add package inside Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            "code": "NEW",
            "id": "SomeProductID",
            "name": "PACK_NAME2",
            "description": "Pack Description new",
            "_TTL": 86400000,
            "acl": {}
        };

        it("Success - add package - null data", (done) => {
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
                },
                listEnvironments: (data, cb) => {
                    return cb(null, []);
                }
            };
            BL.addPackage(soajs, inputMask, (err, result) => {
                assert.ok(result);
                done();
            });
        });

        it("Success - add package  - client tenant", (done) => {
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


            Product.prototype.listEnvironments = (data, cb) => {
                return cb(null, []);
            };

            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.addPackage(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - add package - null config", (done) => {
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
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - delete package - error - client tenant", (done) => {
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
                    code: 473,
                    msg: soajsClient.config.errors[473]
                });
                done();
            });
        });

    });

    describe.skip("Testing update package inside Product", () => {
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
            "acl": {}
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
                },
                listEnvironments: (data, cb) => {
                    return cb(null, []);
                }
            };
            BL.updatePackage(soajs, inputMask, (err, result) => {
                assert.ok(result);
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

            Product.prototype.listEnvironments = (data, cb) => {
                return cb(null, []);
            };

            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.updatePackage(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - update package - null config", (done) => {
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
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - update package - error - client tenant", (done) => {
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
                    code: 473,
                    msg: soajsClient.config.errors[473]
                });
                done();
            });
        });

    });

    describe.skip("Testing delete package inside Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            packageCode: "EXAMPLE03",
            productCode: "TPROD",
        };

        it("Success - delete package - null data", (done) => {
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
            BL.deletePackage(soajs, inputMask, (err, result) => {
                assert.ok(result);
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

        it("Fails - delete package - null config", (done) => {
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
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - delete package - error - client tenant", (done) => {
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
                    code: 473,
                    msg: soajsClient.config.errors[473]
                });
                done();
            });
        });

    });

    describe.skip("Testing purge Product", () => {
        afterEach((done) => {
            BL.modelObj = null;
            done();
        });

        let inputMask = {
            id: "SomeProductID",
            description: "Pack Description after update",
        };

        it("Success - purge product - null data", (done) => {
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
            BL.purgeProduct(soajs, inputMask, (err, result) => {
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

            Product.prototype.updateProduct = (data, cb) => {
                return cb(null, true);
            };

            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.purgeProduct(soajsClient, inputMask, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it("Fails - purge product - null config", (done) => {
            BL.modelObj = {
                getProduct: (nullObject, cb) => {
                    return cb(true, null);
                },
                updateProduct: (data, cb) => {
                    return cb(true, null);
                }
            };
            BL.purgeProduct(soajs, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajs.config.errors[473]
                });
                done();
            });
        });

        it("Fails - purge product - error - client tenant", (done) => {
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
            Product.prototype.updateProduct = (data, cb) => {
                return cb(true, null);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;
            BL.purgeProduct(soajsClient, null, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 473,
                    msg: soajsClient.config.errors[473]
                });
                done();
            });
        });

    });
});
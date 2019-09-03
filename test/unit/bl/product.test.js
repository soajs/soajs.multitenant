"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/product.js');
const assert = require('assert');

describe("Unit test for: BL - product", () => {

    let soajs = {
        config: {
            "errors": {
                460: "Unable to find products",
                601: "Model not found"
            },
        },
        log: {
            error: () => { console.log() }
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
            BL.list(soajs, null, soajs.config, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Success - List products - null data - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find products",
                        601: "Model not found"
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => { console.log() }
                }
            };
            function Product() {
                console.log("Product");
            }
            Product.prototype.listProducts = (data, cb) => {
                return cb(null, []);
            };
            Product.prototype.closeConnection = () => {
            };
            BL.model = Product;

            BL.list(soajsClient, null, soajsClient.config, (err, records) => {
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
            BL.list(soajs, null, soajs.config, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });

        it("Fails - List products - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        460: "Unable to find products",
                        601: "Model not found"
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => { console.log() }
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
            BL.list(soajsClient, null, soajsClient.config, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 460,
                    msg: soajs.config.errors[460]
                });
                done();
            });
        });
    });
});
"use strict";

const helper = require("../../../helper.js");
const Product = helper.requireModule('model/mongo/tenant.js');
const assert = require('assert');

describe("Unit test for: Model - tenant - indexes", () => {
    let model;
    let service = {
        config: {
            "errors": {},
        },
        log: {
            error: () => {
                console.log();
            },
            debug: () => {
                console.log();
            }
        },
        registry: {
            get: () => {
                return {
                    coreDB: {
                        provision: {
                            "name": "core_provision",
                            "prefix": '',
                            "servers": [
                                {
                                    "host": "127.0.0.1",
                                    "port": 27017
                                }
                            ],
                            "credentials": null,
                            "URLParam": {
                                "poolSize": 5,
                                "autoReconnect": true
                            }
                        }
                    }
                };
            }
        }
    };

    before((done) => {
        model = new Product(service);
        done();
    });

    afterEach((done) => {
        done();
    });

    it('Fails - Add Tenant - Code Exists - Index unique', (done) => {
        model.addProduct({
            name: "Console Tenant",
            code: "DBTN"
        }, (err, record) => {
            assert.deepEqual(err.name, 'MongoError');
            assert.deepEqual(err.message, 'E11000 duplicate key error collection: core_provision.products index: code_1 dup key: { : "DSBRD" }');
            assert.ok(err);
            done();
        });
    });

    it('Fails - Add Tenant - Code null - Index unique', (done) => {
        model.addProduct({
            name: "Console Tenant",
            code: null
        }, (err, record) => {
            assert.ok(err);
            done();
        });
    });

    it("Success - closeConnection", (done) => {
        model.closeConnection();
        done();
    });
});
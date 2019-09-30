
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../../helper.js");
const Product = helper.requireModule('model/mongo/product.js');
const assert = require('assert');

describe("Unit test for: Model - product - indexes", () => {
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

    it('Fails - Add Product - Code Exists - Index unique', (done) => {
        model.addProduct({
            name: "Console UI Product",
            code: "DSBRD"
        }, (err) => {
            assert.deepEqual(err.name, 'MongoError');
            assert.deepEqual(err.message, 'E11000 duplicate key error collection: core_provision.products index: code_1 dup key: { : "DSBRD" }');
            assert.ok(err);
            done();
        });
    });

    it('Fails - Add Product - Code null - Index unique', (done) => {
        model.addProduct({
            name: "Console UI Product",
            code: null
        }, (err) => {
            assert.ok(err);
            done();
        });
    });

    it("Success - closeConnection", (done) => {
        model.closeConnection();
        done();
    });
});
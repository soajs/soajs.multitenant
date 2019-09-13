"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let updateScopeSchema = require("../schemas/updateScope.js");

describe("Testing update product API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let prods = [];
    it("Success - will return all product records", (done) => {
        let params = {};
        requester('/products', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            prods = body.data;
            assert.ok(body.data.length > 0);
            done();
        });
    });
    it.skip("Success - will update scope", (done) => {
        let params = {
            qs: {
                id: prods[1]._id
            },
            body: {
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
            }
        };
        requester('/product/scope', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            // assert.ok(body.data);
            // let check = validator.validate(body, updateScopeSchema);
            // assert.deepEqual(check.valid, true);
            // assert.deepEqual(check.errors, []);
            // assert.deepEqual(body.data, 1);
            done();

        });
    });

    it.skip("Fails - will not update scope - prod not found", (done) => {
        let params = {
            qs: {
                id: "5512867be603d7e01ab1666d"
            },
            body: {
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
            }
        };
        requester('/product/scope', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors);
            assert.deepEqual(body.errors.codes[0], 460);
            let check = validator.validate(body, updateScopeSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();

        });
    });

    it("Fail - will not update scope - no params", (done) => {
        let params = {};
        requester('/product', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, updateScopeSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});

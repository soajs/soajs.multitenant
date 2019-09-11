"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing add product API", () => {
    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will add product ", (done) => {
        let params = {
            form: {
                name: 'SOME',
                code: 'SOMEC',
                description: 'Will add due test',
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
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            done();
        });
    });

    it("Success - will add product no scope", (done) => {
        let params = {
            form: {
                name: 'SOME2',
                code: 'SOME2',
                description: 'Will add due test 2'
            }
        };
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.deepEqual(body.data.scope, {acl: {}});
            done();
        });
    });

    it("Fail - will not add - wrong object", (done) => {
        let params = {
            form: {
                product: "{\n" +
                    "            code: 'CODET',\n" +
                    "            description: 'Will not add due to input error'\n" +
                    "        }"
            }
        };
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });

    it("Fail - will not add - no name", (done) => {
        let params = {
            form: {
                code: 'CODET',
                description: 'Will not add due to non-existance of name'
            }
        };
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });

    it("Fail - will not add - no data", (done) => {
        let params = {};
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});

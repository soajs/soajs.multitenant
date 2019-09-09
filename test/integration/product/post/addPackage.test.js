"use strict";
const assert = require('assert');
const requester = require('../../requester');


describe("Testing Add Package API", () => {

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
            prods = body.data;
            assert.ok(body.data);
            prods = body.data;
            assert.ok(body.data.length > 0);
            done();
        });
    });
    it("Success - will add product package", (done) => {
        let params = {
            qs: {
                id: prods[0]._id
            },
            form: {
                name: "PACK_NAME",
                code: "NEWS",
                description: "Pack Description",
                acl: {
                    urac: {
                        access: false,
                    },
                    dashboard: {
                        access: [
                            "devop"
                        ],
                        apis: {}
                    }
                },
                _TTL: 48
            }
        };
        requester('/product/package', 'post', params, (error, body) => {
            console.log("Some error:", body.errors);
            assert.ifError(error);
            assert.ok(body);
            console.log("Anything", body.errors);
            // assert.ok(body.data);
            // assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Fail - will not add package to product - no params", (done) => {
        let params = {};
        requester('/product/package', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});

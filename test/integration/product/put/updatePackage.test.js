"use strict";
const assert = require('assert');
const requester = require('../../requester');

/*describe("Testing Update Package API", () => {

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
    it("Success - will update product package", (done) => {
        let params = {
            qs: {
                id: prods[0]._id,
                code: "TPROD_PACK_NAME"
            },
            form: {
                name: "PACK_NAME2",
                description: "Pack Description after update",
                _TTL: 86400000,
                acl: {
                    urac: {
                        access: false,
                        apis: {

                        }
                    },
                    dashboard: {
                        access: [
                            "devop"
                        ],
                        apis: {

                        }
                    }
                }
            }
        };
        requester('/product/package', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Fail - will not add package to product - no params", (done) => {
        let params = {};
        requester('/product/package', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});*/

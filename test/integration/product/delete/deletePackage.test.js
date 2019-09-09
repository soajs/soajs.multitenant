"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing delete Package API", () => {

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
    it("Success - will delete package from product ", (done) => {
        let params = {
            qs: {
                id: prods[1]._id,
                packageCode: 'TEST'
            }
        };
        requester('/product/package', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            done();
        });
    });

    it("Fail - will not delete package from product - no params", (done) => {
        let params = {};
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});

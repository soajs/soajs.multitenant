"use strict";
const assert = require('assert');
const requester = require('../../requester');

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
    it("Success - will update ", (done) => {
        let params = {
            qs: {
                id: prods[1]._id
            }
        };
        requester('/product', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            done();
        });
    });

    it("Fail - will not update - no params", (done) => {
        let params = {};
        requester('/product', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});

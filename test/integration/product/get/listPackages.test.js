"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing List Packages API", () => {

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
    it("Success - will return all packages of product records ", (done) => {
        let params = {
            qs: {
                id: prods[0]._id
            }
        };
        requester('/product/packages', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            done();
        });
    });

    it("Fail - will not will return all packages of product records - no params", (done) => {
        let params = {};
        requester('/product', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
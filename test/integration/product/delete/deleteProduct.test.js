"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing delete product API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let prods = [];

    it("Success - will delete - code", (done) => {
        let params = {
            qs: {
                code: 'SOMEC'
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            console.log("Something: ", JSON.stringify(body, null, 2));
            assert.ifError(error);
            assert.ok(body);
            done();
        });
    });

    it("Success - will return all product records", (done) => {
        let params = {};
        requester('/products', 'get', params, (error, body) => {
            prods = body.data;
            done();
        });
    });

    it("Success - will delete - id", (done) => {

        let params = {
            qs: {
                id: prods[2]._id
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            done();
        });
    });

    it("Fail - will not delete - no params", (done) => {
        let params = {};
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
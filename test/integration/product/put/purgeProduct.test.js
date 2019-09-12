"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let purgeProductSchema = require("../schemas/purgeProduct.js");

describe("Testing purge product API", () => {

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
            assert.ok(body.data.length > 0);
            done();
        });
    });
    it("Success - will purge product", (done) => {
        let params = {
            qs: {
                id: prods[2]._id,
            }
        };
        requester('/product/purge', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            let check = validator.validate(body, purgeProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            assert.deepEqual(body.data, true);
            done();
        });
    });

    it("Fails - will not purge product - invalid id", (done) => {
        let params = {
            qs: {
                id: "invalidID",
            }
        };
        requester('/product/purge', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors);
            let check = validator.validate(body, purgeProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not purge product - no params", (done) => {
        let params = {};
        requester('/product/purge', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, purgeProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
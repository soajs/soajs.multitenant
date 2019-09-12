"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let updateProductSchema = require("../schemas/updateProduct.js");

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
            },
            form: {
                name: "SomeName"
            }
        };
        requester('/product', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            let check = validator.validate(body, updateProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            assert.deepEqual(body.data, 1);
            done();

        });
    });

    it("Fails - will not update - prod not found", (done) => {
        let params = {
            qs: {
                id: "5512867be603d7e01ab1666d"
            },
            form: {
                name: "NOTANAME"
            }
        };
        requester('/product', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors);
            assert.deepEqual(body.errors.codes[0], 460);
            let check = validator.validate(body, updateProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();

        });
    });

    it("Fail - will not update - no params", (done) => {
        let params = {};
        requester('/product', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, updateProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});

"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let getPackagesSchema = require("../schemas/getPackages.js");
let listProductsSchema = require("../schemas/listProducts.js");

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
            let check = validator.validate(body, listProductsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
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
            let check = validator.validate(body, getPackagesSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
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
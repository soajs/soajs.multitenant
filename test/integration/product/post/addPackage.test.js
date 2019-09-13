"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let addPackagesSchema = require("../schemas/addPackage.js");
let listProductsSchema = require("../schemas/listProducts.js");

describe("Testing Add Package API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let prods = [];
    let selectedProd;
    it("Success - will return all product records", (done) => {
        let params = {};
        requester('/products', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            prods = body.data;
            prods.forEach(prod => {
               if(prod.code === 'TEST2') {
                   selectedProd = prod;
               }
            });
            assert.ok(body.data.length > 0);
            let check = validator.validate(body, listProductsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
    it("Success - will add product package", (done) => {
        let params = {
            qs: {
                id: selectedProd._id
            },
            body: {
                name: "PACK_NAME",
                code: "ELAS",
                description: "Pack Description",
                acl: {},
                _TTL: "24"
            }
        };
        requester('/product/package', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, "TEST2_ELAS");
            let check = validator.validate(body, addPackagesSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not add package to product - no params", (done) => {
        let params = {};
        requester('/product/package', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, addPackagesSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});

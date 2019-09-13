"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let updatePackagesSchema = require("../schemas/updatePackage.js");
let listProductsSchema = require("../schemas/listProducts.js");

describe("Testing Update Package API", () => {

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
    it("Success - will update product package", (done) => {
        let params = {
            qs: {
                id: selectedProd._id,
            },
            body: {
                code: "NEWS",
                name: "PACK_NAME2",
                description: "Pack Description after update",
                _TTL: "24",
                acl: {} // TODO: edit after FINISHING acl schema
            }
        };
        requester('/product/package', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, "product package NEWS updated successfully");
            let check = validator.validate(body, updatePackagesSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not add package to product - no params", (done) => {
        let params = {};
        requester('/product/package', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, updatePackagesSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});

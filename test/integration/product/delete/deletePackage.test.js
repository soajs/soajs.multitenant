
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let deletePackagesSchema = require("../schemas/deletePackage.js");
let listProductsSchema = require("../schemas/listProducts.js");
let getProductsSchema = require("../schemas/getProduct.js");

describe("Testing delete Package API", () => {

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
    it("Success - will delete package from product ", (done) => {
        let params = {
            qs: {
                id: selectedProd._id,
                code: 'TEST2_NEWS'
            }
        };
        requester('/product/package', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.deepEqual(body.data, 'product package TEST2_NEWS deleted successfully');
            let check = validator.validate(body, deletePackagesSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
	
	it("Success - will delete package from product ", (done) => {
		let params = {
			qs: {
				id: "5512867be603d7e01ab1688d",
				code: 'DSBRD_ELAS'
			}
		};
		requester('/product/console/package', 'delete', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.deepEqual(body.data, 'product package DSBRD_ELAS deleted successfully');
			let check = validator.validate(body, deletePackagesSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

    it("Fails - will get product", (done) => {
        let params = {
            qs: {
                id: selectedProd._id
            }
        };
        requester('/product', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            let found  = false;
            let packFound  =null;
            body.data.packages.forEach((pack)=>{
                if (pack.code === "TEST2_NEWS"){
                    found = true;
                    packFound = pack;
                }
            });
            assert.deepEqual(found, false);
            let check = validator.validate(body, getProductsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not delete package from product - no params", (done) => {
        let params = {};
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, deletePackagesSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});

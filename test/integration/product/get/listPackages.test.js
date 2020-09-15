
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
let getPackagesSchema = require("../schemas/getPackages.js");

describe("Testing List Packages API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let prods = [];
    let selectedProd;
    let selectedconsoleProd;
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
            done();
        });
    });
    it("Success - will return all packages of product records ", (done) => {
        let params = {
            qs: {
                id: selectedProd._id
            }
        };
        requester('/product/packages', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
	        assert.ok(body.data);
            let check = validator.validate(body, getPackagesSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
    
	it("Success - will return all packages of console product records ", (done) => {
		let params = {
			qs: {
				id: "5512867be603d7e01ab1688d"
			}
		};
		requester('/product/console/packages', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let check = validator.validate(body, getPackagesSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

    it("Fail - will not return all packages of product records - no params", (done) => {
        let params = {};
        requester('/product', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, getPackagesSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});

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
let getProductSchema = require("../schemas/getProduct.js");

describe("Testing get product API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return product record by code", (done) => {
        let params = {
            qs: {
                code: 'TPROD'
            }
        };
        requester('/product', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.name, 'Test Product');
            assert.deepEqual(body.data.code, 'TPROD');
            let check = validator.validate(body, getProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
	
	it("Success - will return product record by id", (done) => {
		let params = {
			qs: {
				id: '5f575ec295bb89628f3221d1'
			}
		};
		requester('/product', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data.name, 'Test 2 Product');
			assert.deepEqual(body.data.code, 'TEST2');
			let check = validator.validate(body, getProductSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

    it("Fail - will not return product record - wrong request", (done) => {
        let params = {};
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, getProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
	
	it("Success - will return console product record", (done) => {
		let params = {
			qs: {
				code: 'DSBRD'
			}
		};
		requester('/product/console', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data.code, 'DSBRD');
			let check = validator.validate(body, getProductSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
});
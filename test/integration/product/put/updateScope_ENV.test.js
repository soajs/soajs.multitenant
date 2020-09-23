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
let updateScopeSchema = require("../schemas/updateScope.js");

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
	it("Success - will update scope", (done) => {
		let params = {
			qs: {
				id: prods[1]._id,
				env: "dev"
			},
			body: {
				"acl": {
					"multitenant": {
						"1": {
							"access": false,
							"get": [
								{
									"/product": {
										"access": false
									},
									"group": 'Product'
								}
							]
						}
					}
				}
			}
		};
		requester('/product/scope/env', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let check = validator.validate(body, updateScopeSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			assert.deepEqual(body.data, 1);
			done();
			
		});
	});
	
	it("Success - will update console scope", (done) => {
		let params = {
			qs: {
				id: "5512867be603d7e01ab1688d",
				env: "dev"
			},
			body: {
				"acl": {
					"multitenant": {
						"1": {
							"access": false,
							"get": [
								{
									"/product": {
										"access": false
									},
									"group": 'Product'
								}
							]
						}
					}
				}
			}
		};
		requester('/product/console/scope/env', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let check = validator.validate(body, updateScopeSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			assert.deepEqual(body.data, 1);
			done();
			
		});
	});
	
});

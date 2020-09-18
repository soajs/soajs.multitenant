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

describe("Testing get Package API", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will get a product package acl in raw form", (done) => {
		let params = {
			qs: {
				id: '5f575ec295bb89628f3221d1',
				package: "TEST2_NEWS"
			}
		};
		requester('/product/package/acl/raw', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	
	
	it("Fail - will get a product package acl in raw form", (done) => {
		let params = {
			qs: {
				id: '5f575ec295bb89628f3221d1',
				package: 'DSBRD_GUEST'
			}
		};
		requester('/product/package/acl/raw', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.errors.codes);
			done();
		});
	});
	
	it("Success - will get a console product package acl in raw form", (done) => {
		let params = {
			qs: {
				id: '5512867be603d7e01ab1688d',
				package: 'DSBRD_GUEST'
			}
		};
		requester('/product/console/package/acl/raw', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});

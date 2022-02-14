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
let updateProfileSchema = require("../schemas/updateProfile.js");
let listTenantsSchema = require("../schemas/listTenants.js");
let getTenantSchema = require("../schemas/getTenant");

let extKey = 'aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25';

describe("Testing update tenant profile API", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	let tenants = [];
	let selectedTenant;
	
	it("Success - will return all tenant records - no input", (done) => {
		let params = {};
		requester('/tenants', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.ok(body.data.items);
			assert.ok(body.data.items.length > 0);
			let check = validator.validate(body, listTenantsSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			tenants = body.data.items;
			tenants.forEach(tenant => {
				if (tenant.code === 'test2') {
					selectedTenant = tenant;
				}
			});
			done();
		});
	});
	
	it("Success - will update tenant profile - id", (done) => {
		let params = {
			qs: {
				id: selectedTenant._id
			},
			body: {
				profile: {
					"test": "profile"
				}
			}
		};
		requester('/admin/tenant/profile', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data, 1);
			let check = validator.validate(body, updateProfileSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	
	it("Success - will update tenant console profile - id", (done) => {
		let params = {
			qs: {
				id: "5c0e74ba9acc3c5a84a51259"
			},
			body: {
				profile: {
					"test": "profile"
				}
			}
		};
		requester('/tenant/console/profile', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data, 1);
			let check = validator.validate(body, updateProfileSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will return product record - id", (done) => {
		let params = {
			qs: {
				id: selectedTenant._id
			}
		};
		requester('/admin/tenant', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data.name, 'test 2 tenant');
			assert.deepEqual(body.data.code, 'test2');
			assert.deepEqual(body.data.description, 'this is a description for test tenant');
			assert.deepEqual(body.data.profile, {
				"test": "profile"
			});
			let check = validator.validate(body, getTenantSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will update tenant profile - no code no id", (done) => {
		let params = {
			qs: {},
			headers: {
				access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
				key: extKey
			},
			body: {
				profile: {
					"test2": "profile no code no id"
				}
			}
		};
		requester('/tenant/profile', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data, 1);
			let check = validator.validate(body, updateProfileSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will return product record - id", (done) => {
		let params = {
			headers: {
				access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
				key: extKey
			}
		};
		setTimeout(() => {
			requester('/tenant', 'get', params, (error, body) => {
				assert.ifError(error);
				assert.ok(body);
				assert.ok(body.data);
				assert.deepEqual(body.data.name, 'test 2 tenant');
				assert.deepEqual(body.data.code, 'test2');
				assert.deepEqual(body.data.description, 'this is a description for test tenant');
				assert.deepEqual(body.data.profile, {
					"test2": "profile no code no id"
				});
				let check = validator.validate(body, getTenantSchema);
				assert.deepEqual(check.valid, true);
				assert.deepEqual(check.errors, []);
				done();
			});
		}, 50);
		
	});
	
	it("Fail - will not return tenant record - no params", (done) => {
		let params = {};
		requester('/tenant/profile', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.errors.codes);
			let check = validator.validate(body, updateProfileSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
});

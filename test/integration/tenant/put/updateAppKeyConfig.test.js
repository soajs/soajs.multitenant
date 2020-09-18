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

let extKeyTest = 'aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25';

describe("Testing update tenant app key config API", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will update tenant app key config - id", (done) => {
		let params = {
			qs: {
				id: "5e348418ed5e433de5bea716",
				appId: "30d2cb5fc04ce51e06000002",
				key: "695d3456de70fddc9e1e60a6d85b97d3",
			},
			body: {
				envCode: "dev",
				config: {}
			}
		};
		requester('/admin/tenant/application/key/config', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	
	
	it("Success - will update app key config - no id", (done) => {
		let params = {
			headers: {
				access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
				key: extKeyTest
			},
			qs: {
				appId: "30d2cb5fc04ce51e06000002",
				key: "695d3456de70fddc9e1e60a6d85b97d3",
			},
			body: {
				envCode: "dev",
				config: {
					"infra": {"SOAJS": {"THROTTLING": {"publicAPIStrategy":"null", "privateAPIStrategy": "--inherit--"}}},
					"oauth": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}},
					"urac": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}},
					"multitenant": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}},
					"repositories": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}},
					"controller": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}},
					"marketplace": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}},
					"soamonitor": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}},
					"soaanalytics": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}},
					"console": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}},
					"dashboard": {"SOAJS": {"THROTTLING": {"privateAPIStrategy": "--inherit--"}}}
				}
			}
		};
		requester('/tenant/application/key/config', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	
	it("Success - will update console tenant app key config", (done) => {
		let params = {
			qs: {
				id: "5c0e74ba9acc3c5a84a51259",
				appId: "5c0e74ba9acc3c5a84a5125a",
				key: "a139786a6e6d18e48b4987e83789430b",
			},
			body: {
				envCode: "dashboard",
				config: {
				
				}
				
			}
		};
		requester('/tenant/console/application/key/config', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});
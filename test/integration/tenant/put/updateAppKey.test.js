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
let updateAppKeySchema = require("../schemas/updateAppKey.js");
let listTenantsSchema = require("../schemas/listTenants.js");
let getTenantSchema = require("../schemas/getTenant");

let extKeyTest = 'aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25';

describe("Testing update app key of tenant API", () => {
	
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
	
	it("Success - will update tenant application key - id", (done) => {
		let params = {
			qs: {
				id: selectedTenant._id
			},
			body: {
				appId: '30d2cb5fc04ce51e06000003',
				key: 'ff7b65bb252201121f1be95adc08f44a',
				config: {
					"dashboard": {
						"commonFields": {},
						"urac": {
							"hashIterations": 12, //used by hasher
							"tokenExpiryTTL": 2 * 24 * 3600 * 1000
						}
					}
				}
			}
		};
		requester('/admin/tenant/application/key', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data, 1);
			let check = validator.validate(body, updateAppKeySchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will update tenant console application key - id", (done) => {
		let params = {
			qs: {
				id: "5c0e74ba9acc3c5a84a51259"
			},
			body: {
				appId: '5c0e74ba9acc3c5a84a5125a',
				key: 'a139786a6e6d18e48b4987e83789430b',
				config: {
					dashboard: {
						oauth: {
							loginMode: "urac"
						},
						commonFields: {
							mail: {
								from: "me@localhost.com",
								transport: {
									type: "sendmail",
									options: {}
								}
							}
						},
						urac: {
							hashIterations: 12,
							link: {
								addUser: "http://dashboard.soajs.org:80/#/setNewPassword",
								changeEmail: "http://dashboard.soajs.org:80/#/changeEmail/validate",
								forgotPassword: "http://dashboard.soajs.org:80/#/resetPassword",
								join: "http://dashboard.soajs.org:80/#/join/validate"
							},
							tokenExpiryTTL: 172800000,
							validateJoin: true,
							mail: {
								join: {
									subject: "Welcome to SOAJS",
									path: "undefined/soajs/node_modules/soajs.urac/mail/urac/join.tmpl"
								},
								forgotPassword: {
									subject: "Reset Your Password at SOAJS",
									path: "undefined/soajs/node_modules/soajs.urac/mail/urac/forgotPassword.tmpl"
								},
								addUser: {
									subject: "Account Created at SOAJS",
									path: "undefined/soajs/node_modules/soajs.urac/mail/urac/addUser.tmpl"
								},
								changeUserStatus: {
									subject: "Account Status changed at SOAJSs",
									path: "undefined/soajs/node_modules/soajs.urac/mail/urac/changeUserStatus.tmpl"
								},
								changeEmail: {
									subject: "Change Account Email at SOAJS",
									path: "undefined/soajs/node_modules/soajs.urac/mail/urac/changeEmail.tmpl"
								}
							}
						}
					}
				}
			}
		};
		requester('/tenant/console/application/key', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data, 1);
			let check = validator.validate(body, updateAppKeySchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will return tenant record - id", (done) => {
		let params = {
			qs: {
				id: selectedTenant._id
			}
		};
		requester('/admin/tenant', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			body.data.applications.forEach(app => {
				if (app.appId === "30d2cb5fc04ce51e06000003") {
					app.keys.forEach(k => {
						if (k.key === 'ff7b65bb252201121f1be95adc08f44a') {
							assert.deepEqual(k.config, {
								"dashboard": {
									"commonFields": {},
									"urac": {
										"hashIterations": 12, //used by hasher
										"tokenExpiryTTL": 2 * 24 * 3600 * 1000
									}
								}
							});
						}
					});
				}
			});
			let check = validator.validate(body, getTenantSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will update tenant application key - no id", (done) => {
		let params = {
			headers: {
				access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
				key: extKeyTest
			},
			body: {
				appId: '30d2cb5fc04ce51e06000003',
				key: 'ff7b65bb252201121f1be95adc08f44a',
				config: {
					"test": {
						"urac": {
							"hashIterations": 12, //used by hasher
							"tokenExpiryTTL": 2 * 24 * 3600 * 1000
						}
					}
				}
			}
		};
		requester('/tenant/application/key', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data, 1);
			let check = validator.validate(body, updateAppKeySchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will return tenant record - id", (done) => {
		let params = {
			headers: {
				access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
				key: extKeyTest
			}
		};
		requester('/tenant', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			body.data.applications.forEach(app => {
				if (app.appId === "30d2cb5fc04ce51e06000003") {
					app.keys.forEach(k => {
						if (k.key === 'ff7b65bb252201121f1be95adc08f44a') {
							assert.deepEqual(k.config, {
								"test": {
									"urac": {
										"hashIterations": 12, //used by hasher
										"tokenExpiryTTL": 2 * 24 * 3600 * 1000
									}
								}
							});
						}
					});
				}
			});
			let check = validator.validate(body, getTenantSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Fail - will not update tenant application key - no params - admin", (done) => {
		let params = {};
		requester('/admin/tenant/application/key', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.errors.codes);
			let check = validator.validate(body, updateAppKeySchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Fail - will not update tenant application key - no params", (done) => {
		let params = {};
		requester('/tenant/application/key', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.errors.codes);
			let check = validator.validate(body, updateAppKeySchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
});

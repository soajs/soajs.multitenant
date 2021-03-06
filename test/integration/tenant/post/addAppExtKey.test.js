
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
let addAppKeySchema = require("../schemas/addApplicationKey.js");
let getTenantsSchema = require("../schemas/getTenant.js");
let listTenantsSchema = require("../schemas/listTenants.js");

let extKeyTest = 'aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25';

describe("Testing add application external key API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

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
	        let tenants = body.data.items;
	        tenants.forEach(tenant => {
		        if (tenant.code === 'test2') {
			        selectedTenant = tenant;
		        }
	        });
	        done();
        });
    });

    it("Success - will add application ext key - input (admin)", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            },
            body: {
                key: 'ff7b65bb252201121f1be95adc08f44a',
                appId: '30d2cb5fc04ce51e06000003',
                label: 'Label for Key one',
                env: 'dashboard',
                expDate: '2019-09-27T14:43:24Z',
                device: {},
                geo: {}
            }
        };
        requester('/admin/tenant/application/key/ext', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, addAppKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
	
	it("Success - will add application ext key - console", (done) => {
		let params = {
			qs: {
				id: "5c0e74ba9acc3c5a84a51259"
			},
			body: {
				key: 'a139786a6e6d18e48b4987e83789430b',
				appId: '5c0e74ba9acc3c5a84a5125a',
				label: 'Label for Key one',
				env: 'dashboard',
				expDate: '2019-09-27T14:43:24Z',
				device: {},
				geo: {}
			}
		};
		requester('/tenant/console/application/key/ext', 'post', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data, 1);
			let check = validator.validate(body, addAppKeySchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	
	it("Success - will add application ext key - input", (done) => {
        let params = {
            headers: {
	            access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
                key: extKeyTest
            },
            body: {
                appId: '30d2cb5fc04ce51e06000002',
                key: '695d3456de70fddc9e1e60a6d85b97d3',
                label: 'Label for Key two',
                env: 'dev',
                expDate: '2019-09-27T14:43:24Z',
                device: {},
                geo: {}
            }
        };
        requester('/tenant/application/key/ext', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, addAppKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return record - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            }
        };
        requester('/admin/tenant', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            
	        for (let i = 0; i < body.data.applications.length; i++) {
		        let app = body.data.applications[i];
		        if (app.appId === "30d2cb5fc04ce51e06000002" || app.appId === "30d2cb5fc04ce51e06000003") {
			        assert.deepEqual(app.keys.length, 2);
		        }
	        }
	        
            let check = validator.validate(body, getTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fails - will not add application ext key - no input", (done) => {
        let params = {};

        requester('/tenant/application/key/ext', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            let check = validator.validate(body, addAppKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
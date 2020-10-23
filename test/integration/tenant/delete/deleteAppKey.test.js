
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
let deleteAppKeySchema = require("../schemas/deleteAppKey.js");
let getTenantsSchema = require("../schemas/getTenant.js");
let listTenantsSchema = require("../schemas/listTenants.js");

describe("Testing delete application key API", () => {

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

    it("Success - will delete application key - input", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id,
                appId: '30d2cb5fc04ce51e06000003',
                key: "ff7b65bb252201121f1be95adc08f44a"
            }
        };
        requester('/tenant/application/key', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, deleteAppKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
	
	it("Success - will delete application key console - input", (done) => {
		let params = {
			qs: {
				id: "5c0e74ba9acc3c5a84a51259",
				appId: '30d2cb5fc04ce51e06000003',
				key: "ff7b65bb252201121f1be95adc08f44a"
			}
		};
		requester('/tenant/console/application/key', 'delete', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			done();
		});
	});

    it("Success - will delete application key - input", (done) => {
        let params = {
            qs: {
                code: selectedTenant.code,
                appId: '30d2cb5fc04ce51e06000002',
                key: '695d3456de70fddc9e1e60a6d85b97d3'
            }
        };
        requester('/tenant/application/key', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, deleteAppKeySchema);
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
			        assert.deepEqual(app.keys[0].extKeys.length, 1);
		        }
	        }
	        
            let check = validator.validate(body, getTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fails - will not delete application key - no input", (done) => {
        let params = {};

        requester('/tenant/application/key', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            let check = validator.validate(body, deleteAppKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
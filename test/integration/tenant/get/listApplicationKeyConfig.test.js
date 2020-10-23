
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
let listTenantsSchema = require("../schemas/listTenants.js");

describe("Testing list application key config API", () => {

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

    it("Success - will return all tenant application key config - id (admin)", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id,
	            appId: selectedTenant.applications[0].appId,
	            key: selectedTenant.applications[0].keys[0].key,
            }
        };
        requester('/admin/tenant/application/key/config', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            done();
        });
    });

    it("Success - will return all tenant application key config- no id", (done) => {
		let params = {
			qs: {
				appId: selectedTenant.applications[0].appId,
				key: selectedTenant.applications[0].keys[0].key,
			},
			headers: {
				access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
				key: "aa39b5490c4a4ed0e56d7ec1232a428f7ad78ebb7347db3fc9875cb10c2bce39bbf8aabacf9e00420afb580b15698c04ce10d659d1972ebc53e76b6bbae0c113bee1e23062800bc830e4c329ca913fefebd1f1222295cf2eb5486224044b4d0c"
			}
		};
		requester('/tenant/application/key/config', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	
	it("Success - will return all tenant console application key config", (done) => {
		let params = {
			qs: {
				id: "5c0e74ba9acc3c5a84a51259",
				appId: "5c0e74ba9acc3c5a84a5125a",
				key: "a139786a6e6d18e48b4987e83789430b"
			}
		};
		requester('/tenant/console/application/key/config', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});

    it("Fail - will not return all tenant application key config - no params", (done) => {
        let params = {};
        requester('/admin/tenant/application/key/config', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
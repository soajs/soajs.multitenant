
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
let getApplicationsSchema = require("../schemas/getApplications.js");
let listTenantsSchema = require("../schemas/listTenants.js");

describe("Testing get applications API", () => {

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
            tenants = body.data;
            body.data.forEach(tenant => {
                if (tenant.code === 'test2') {
                    selectedTenant = tenant;
                }
            });
            assert.ok(body.data.length > 0);
            let check = validator.validate(body, listTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return tenant application - id (admin)", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id,
                appId: '30d2cb5fc04ce51e06000002'
            }
        };
        requester('/admin/tenant/application', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.product, 'TPROD');
            assert.deepEqual(body.data.package, 'TPROD_BASIC');
            assert.deepEqual(body.data.appId, '30d2cb5fc04ce51e06000002');
            let check = validator.validate(body, getApplicationsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return tenant application - no id", (done) => {
        let params = {
            qs: {
                appId: '30d2cb5fc04ce51e06000002'
            },
            headers: {
	            access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
                key: "aa39b5490c4a4ed0e56d7ec1232a428f7ad78ebb7347db3fc9875cb10c2bce39bbf8aabacf9e00420afb580b15698c04ce10d659d1972ebc53e76b6bbae0c113bee1e23062800bc830e4c329ca913fefebd1f1222295cf2eb5486224044b4d0c"
            }
        };
        requester('/tenant/application', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.product, 'TPROD');
            assert.deepEqual(body.data.package, 'TPROD_BASIC');
            assert.deepEqual(body.data.appId, '30d2cb5fc04ce51e06000002');
            let check = validator.validate(body, getApplicationsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not return tenant application - no params", (done) => {
        let params = {};
        requester('/tenant/application', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, getApplicationsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
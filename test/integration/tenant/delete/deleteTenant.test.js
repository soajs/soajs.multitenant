
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
let deleteTenantSchema = require("../schemas/deleteTenant.js");
let listTenantsSchema = require("../schemas/listTenants.js");

describe("Testing delete tenant API", () => {

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
            body.data.forEach(tenant => {
                if (tenant.code === 'test2') {
                    selectedTenant = tenant;
                }
            });
            let check = validator.validate(body, listTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will delete tenant record - input", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            }
        };
        requester('/tenant', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            let check = validator.validate(body, deleteTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fails - will not delete tenant record - no input", (done) => {
        let params = {};

        requester('/tenant', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.deepEqual(body.errors.codes, [602]);
            let check = validator.validate(body, deleteTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
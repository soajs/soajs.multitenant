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
                if (tenant.code === 'test') {
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
                appId: '30d2cb5fc04ce51e06000003'
            }
        };
        requester('/admin/tenant/application', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.product, 'TPROD');
            assert.deepEqual(body.data.package, 'TPROD_EXAMPLE03');
            assert.deepEqual(body.data.appId, '30d2cb5fc04ce51e06000003');
            let check = validator.validate(body, getApplicationsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return tenant application - no id", (done) => {
        let params = {
            qs: {
                appId: '30d2cb5fc04ce51e06000003'
            },
            headers: {
                key: "aa39b5490c4a4ed0e56d7ec1232a428f771e8bb83cfcee16de14f735d0f5da587d5968ec4f785e38570902fd24e0b522b46cb171872d1ea038e88328e7d973ff47d9392f72b2d49566209eb88eb60aed8534a965cf30072c39565bd8d72f68ac"
            }
        };
        requester('/tenant/application', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.product, 'TPROD');
            assert.deepEqual(body.data.package, 'TPROD_EXAMPLE03');
            assert.deepEqual(body.data.appId, '30d2cb5fc04ce51e06000003');
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
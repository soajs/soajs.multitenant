"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let deleteAppKeySchema = require("../schemas/deleteAppKey.js");
let getTenantsSchema = require("../schemas/getTenant.js");
let listTenantsSchema = require("../schemas/listTenants.js");

describe("Testing add application key API", () => {

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
                if (tenant.code === 'test') {
                    selectedTenant = tenant;
                }
            });
            let check = validator.validate(body, listTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will add application key - input", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            },
            body: {
                appId: '30d2cb5fc04ce51e06000003'
            }
        };
        requester('/admin/tenant/application/key', 'post', params, (error, body) => {
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

    it.skip("Success - will delete application key - input", (done) => {
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

    it.skip("Success - will return record - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            }
        };
        requester('/admin/tenant', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.applications[1].keys.length, 0);
            assert.deepEqual(body.data.applications[2].keys.length, 0);
            let check = validator.validate(body, getTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it.skip("Fails - will not delete application key - no input", (done) => {
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
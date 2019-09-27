"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let deleteAppExtKeysSchema = require("../schemas/deleteAppExtKeys.js");
let getTenantsSchema = require("../schemas/getTenant.js");
let listTenantsSchema = require("../schemas/listTenants.js");

describe("Testing delete application external keys API", () => {

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

    it("Success - will delete application extenal key - input", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id,
                appId: '30d2cb5fc04ce51e06000003',
                key: "ff7b65bb252201121f1be95adc08f44a",
                extKey: 'aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25'
            }
        };
        requester('/tenant/application/key/ext', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, true);
            let check = validator.validate(body, deleteAppExtKeysSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will delete application extenal key - input", (done) => {
        let params = {
            qs: {
                code: selectedTenant.code,
                appId: '30d2cb5fc04ce51e06000002',
                key: '695d3456de70fddc9e1e60a6d85b97d3',
                extKey: 'aa39b5490c4a4ed0e56d7ec1232a428f7ad78ebb7347db3fc9875cb10c2bce39bbf8aabacf9e00420afb580b15698c04ce10d659d1972ebc53e76b6bbae0c113bee1e23062800bc830e4c329ca913fefebd1f1222295cf2eb5486224044b4d0c'
            }
        };
        requester('/tenant/application/key/ext', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, deleteAppExtKeysSchema);
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
            assert.deepEqual(body.data.applications[1].keys[0].extKeys.length, 0);
            assert.deepEqual(body.data.applications[2].keys[0].extKeys.length, 0);
            let check = validator.validate(body, getTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fails - will not delete application extenal key - no input", (done) => {
        let params = {};

        requester('/tenant/application/key/ext', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            let check = validator.validate(body, deleteAppExtKeysSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let addAppKeySchema = require("../schemas/addApplicationKey.js");
let getTenantsSchema = require("../schemas/getTenant.js");
let listTenantsSchema = require("../schemas/listTenants.js");

let extKeyTest = 'aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25';

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

    it("Success - will add application key - input (admin)", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            },
            body: {
                appId: '30d2cb5fc04ce51e06000003',
                extKey: {
                    label: 'Label for Key',
                    env: 'dashboard',
                    expDate: '2019-09-27T14:43:24Z',
                    device: {},
                    geo: {}
                }
            }
        };
        requester('/admin/tenant/application/key', 'post', params, (error, body) => {
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

    it("Success - will add application key - input", (done) => {
        let params = {
            headers: {
                key: extKeyTest
            },
            body: {
                appId: '30d2cb5fc04ce51e06000002',
                extKey: {
                    label: 'Label for Key',
                    env: 'dev',
                    expDate: '2019-09-27T14:43:24Z',
                    device: {},
                    geo: {}
                }
            }
        };
        requester('/tenant/application/key', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            console.log(body.errors, "flags1");
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
            assert.deepEqual(body.data.applications[1].keys.length, 2);
            assert.deepEqual(body.data.applications[2].keys.length, 2);
            let check = validator.validate(body, getTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fails - will not delete application key - no input", (done) => {
        let params = {};

        requester('/tenant/application/key', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            let check = validator.validate(body, addAppKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
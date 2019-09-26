"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let listAppExtKeysSchema = require("../schemas/listAppExtKeys.js");
let listTenantsSchema = require("../schemas/listTenants.js");

describe("Testing list application external keys API", () => {

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

    it("Success - will return all application external keys - id (admin)", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id,
                appId: "30d2cb5fc04ce51e06000003",
                key: "ff7b65bb252201121f1be95adc08f44a"
            }
        };
        requester('/admin/tenant/application/key/ext', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(Array.isArray(body.data));
            let check = validator.validate(body, listAppExtKeysSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return all application external keys - no id", (done) => {
        let params = {
            qs: {
                appId: "30d2cb5fc04ce51e06000003",
                key: "ff7b65bb252201121f1be95adc08f44a"
            },
            headers: {
                key: "aa39b5490c4a4ed0e56d7ec1232a428f771e8bb83cfcee16de14f735d0f5da587d5968ec4f785e38570902fd24e0b522b46cb171872d1ea038e88328e7d973ff47d9392f72b2d49566209eb88eb60aed8534a965cf30072c39565bd8d72f68ac"
            }
        };
        requester('/tenant/application/key/ext', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(Array.isArray(body.data));
            let check = validator.validate(body, listAppExtKeysSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not return all application external keys - no params", (done) => {
        let params = {};
        requester('/tenant/application/key/ext', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, listAppExtKeysSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not return all application external keys - admin - no params", (done) => {
        let params = {};
        requester('/admin/tenant/application/key/ext', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, listAppExtKeysSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
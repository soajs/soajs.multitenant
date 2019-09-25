"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let updateAppKeySchema = require("../schemas/updateAppKey.js");
let listTenantsSchema = require("../schemas/listTenants.js");
let getTenantSchema = require("../schemas/getTenant");

describe("Testing update app key of tenant API", () => {

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

    it("Success - will update tenant application key - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            },
            body: {
                appId: '30d2cb5fc04ce51e06000003',
                key: 'ff7b65bb252201121f1be95adc08f44a',
                config: {
                    "dashboard": {
                        "commonFields": {},
                        "urac": {
                            "hashIterations": 1024, //used by hasher
                            "seedLength": 32, //used by hasher
                            "tokenExpiryTTL": 2 * 24 * 3600 * 1000
                        }
                    }
                }
            }
        };
        requester('/admin/tenant/application/key', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, updateAppKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return tenant record - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            }
        };
        requester('/admin/tenant', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            body.data.applications.forEach(app => {
                if(app.appId === "30d2cb5fc04ce51e06000003") {
                    app.keys.forEach(k => {
                        if(k.key === 'ff7b65bb252201121f1be95adc08f44a') {
                            assert.deepEqual(k.config, {
                                "dashboard": {
                                    "commonFields": {},
                                    "urac": {
                                        "hashIterations": 1024, //used by hasher
                                        "seedLength": 32, //used by hasher
                                        "tokenExpiryTTL": 2 * 24 * 3600 * 1000
                                    }
                                }
                            });
                        }
                    });
                }
            });
            let check = validator.validate(body, getTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not update tenant application key - no params - admin", (done) => {
        let params = {};
        requester('/admin/tenant/application/key', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, updateAppKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not update tenant application key - no params", (done) => {
        let params = {};
        requester('/tenant/application/key', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, updateAppKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});

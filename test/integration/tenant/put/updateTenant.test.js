"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let updateTenantSchema = require("../schemas/updateTenant.js");
let listTenantsSchema = require("../schemas/listTenants.js");
let getTenantSchema = require("../schemas/getTenant");

describe("Testing update tenant API", () => {

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

    it("Success - will update tenant - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            },
            body: {
                name: 'test2 updated',
                code: 'test2',
                description: "Updated Description",
                tag: "Updated Tag"
            }
        };
        requester('/tenant', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, updateTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return product record - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            }
        };
        requester('/tenant', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.name, 'test2 updated');
            assert.deepEqual(body.data.code, 'test');
            assert.deepEqual(body.data.description, "Updated Description");
            let check = validator.validate(body, getTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will update tenant profile - code", (done) => {
        let params = {
            qs: {
                code: 'test'
            },
            body: {
                name: 'test3 updated',
                description: "Updated Description 2",
                tag: "Updated Tag 2"
            }
        };
        requester('/tenant', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, updateTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will update tenant profile - no code no id", (done) => {
        let params = {
            qs: {
            },
            headers: {
                key: "aa39b5490c4a4ed0e56d7ec1232a428f771e8bb83cfcee16de14f735d0f5da587d5968ec4f785e38570902fd24e0b522b46cb171872d1ea038e88328e7d973ff47d9392f72b2d49566209eb88eb60aed8534a965cf30072c39565bd8d72f68ac"
            },
            body: {
                name: 'main updated',
                description: "main Description 2",
                tag: "main Tag 2"
            }
        };
        requester('/tenant', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, updateTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return product record - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            }
        };
        requester('/tenant', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.name, 'main updated');
            assert.deepEqual(body.data.code, 'test');
            assert.deepEqual(body.data.description, "main Description 2");
            assert.deepEqual(body.data.tag, "main Tag 2");
            let check = validator.validate(body, getTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not return tenant record - no params", (done) => {
        let params = {};
        requester('/tenant', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, updateTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
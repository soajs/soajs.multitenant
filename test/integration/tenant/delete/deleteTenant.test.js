"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let deleteTenantSchema = require("../schemas/deleteTenant.js");
let getTenantsSchema = require("../schemas/getTenant.js");

describe("Testing delete tenant API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will delete tenant record - input", (done) => {
        let params = {};
        requester('/tenant', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            let check = validator.validate(body, deleteTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return product record - code", (done) => {
        let params = {
            qs: {
                code: ''
            }
        };
        requester('/tenant', 'get', params, (error, body) => {
            assert.ok(error);
            let check = validator.validate(body, getTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fails - will not delete tenant record - no input", (done) => {
        let params = {};

        requester('/tenant', 'delete', params, (error, body) => {
            assert.ok(error);

            let check = validator.validate(body, deleteTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
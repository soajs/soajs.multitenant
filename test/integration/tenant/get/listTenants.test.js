"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let listTenantsSchema = require("../schemas/listTenants.js");

describe("Testing list tenants API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return all tenant records - no input", (done) => {
        let params = {};
        requester('/tenants', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            let check = validator.validate(body, listTenantsSchema);
            console.log("chika", check);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return all tenant records - input", (done) => {
        let params = {
            qs: {
                type: 'product'
            }
        };
        requester('/tenants', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            let check = validator.validate(body, listTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
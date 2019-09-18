"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let addTenantSchema = require("../schemas/addTenant.js");
let getTenantsSchema = require("../schemas/getTenant.js");

describe("Testing add tenant API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will add tenant record - tenant only ", (done) => {
        let params = {
            body: {
                "name": "tenant only",
                "code": "ttoc",
                "description": "3221",
                "type": "product",
                "profile": {},
                "tag": "tag"
            }
        };
        requester('/tenant', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            let check = validator.validate(body, addTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return tenant record - code", (done) => {
        let params = {
            qs: {
                code: 'ttoc'
            }
        };
        requester('/tenant', 'get', params, (error, body) => {
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.oauth, {
                "secret": "this is a secret",
                "redirectURI": "http://domain.com",
                "grants": [
                    "password",
                    "refresh_token"
                ],
                "disabled": 1,
                "type": 2,
                "loginMode": "urac"
            });
            let check = validator.validate(body, getTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });


    it("Fails - will not add tenant record - no input", (done) => {
        let params = {};

        requester('/tenant', 'post', params, (error, body) => {
            assert.ok(error);

            let check = validator.validate(body, addTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
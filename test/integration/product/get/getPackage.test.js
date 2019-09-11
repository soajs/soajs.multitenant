"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let getPackageSchema = require("../schemas/getPackage.js");


describe("Testing get Package API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will get a product package ", (done) => {
        let params = {
            qs: {
                packageCode: 'DSBRD_GUEST',
                productCode: 'DSBRD'
            }
        };
        requester('/product/package', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            let check = validator.validate(body, getPackageSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not get a product package - no params", (done) => {
        let params = {};
        requester('/product', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});

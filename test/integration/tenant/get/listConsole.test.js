"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing list console tenants API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return all console tenant records", (done) => {
        let params = {
            qs: {
                type: "admin",
                negate: false
            }
        };
        requester('/tenants/console', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Fail - will not return all console tenant records - no data", (done) => {
        let params = {};
        requester('/tenants/console', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing delete oauth of tenant API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let tenants = [];

    it("Success - will list all tenant records", (done) => {
        let params = {};
        requester('/tenants', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            tenants = body.data;
            assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Success - will delete oauth of tenant", (done) => {
        let params = {
            qs: {
                id: tenants[0]._id
            }
        };
        requester('/tenant/oauth', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Fail - will not delete oauth of tenant - no data", (done) => {
        let params = {};
        requester('/tenant/oauth', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
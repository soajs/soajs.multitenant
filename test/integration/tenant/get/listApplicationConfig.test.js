"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing list application config of tenant API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let tenants = [];

    it("Success - will return all tenant records", (done) => {
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

    it("Success - will return application config of a tenant key", (done) => {
        let params = {
            qs: {
                id: tenants[0]._id,
                appId: "5d64f93639d30a3e79d82895",
                key: "2b32c3eb5169d3ecd105c86d18840c6b"
            }
        };
        requester('/tenant/application/key/config', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Fail - will not return application config of a tenant key - no data", (done) => {
        let params = {};
        requester('/tenant/application/key/config', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
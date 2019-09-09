"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing update tenant API", () => {

    before((done) => {
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

    it("Success - will update tenant ", (done) => {
        let params = {
            qs: {
                id: tenants[2]._id,
            },
            form: {
                name: 'Updated Name',
                description: 'Tenant after Update',
                type: 'client'
            }
        };
        requester('/tenant', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            done();
        });
    });

    it("Fails - will not update - no params", (done) => {
        let params = {};
        requester('/tenant', 'put', params, (error, body) => {
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
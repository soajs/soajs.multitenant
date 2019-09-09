"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing list dashboard keys of tenant API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let tenants = [];

    it("Success - will return dashboard keys of the dashboard tenant record", (done) => {
        let inputmaskData = {
            code: 'DBTN'
        };
        requester('/tenant/dashboard/keys', 'get', inputmaskData, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Fail - will not return dashboard keys of the dashboard tenant record - no data", (done) => {
        let params = {};
        requester('/tenant/dashboard/keys', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
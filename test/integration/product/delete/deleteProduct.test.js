"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing delete product API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will delete ", (done) => {
        let params = {
            qs: {
                code: 'SOMEC'
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            done();
        });
    });

    it("Fail - will not delete - no params", (done) => {
        let params = {};
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
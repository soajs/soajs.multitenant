"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing get product API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return product record", (done) => {
        let params = {
            qs: {
                code: 'DSBRD'
            }
        };
        requester('/product', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            done();
        });
    });

    it("Fail - will not return product record - wrong request", (done) => {
        let params = {};
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});
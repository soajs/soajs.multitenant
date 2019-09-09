"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing list products API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return all product records", (done) => {
        let params = {};
        requester('/products', 'get', params, (error, body) => {
            console.log(JSON.stringify(body, null, 2));
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Fail - will not return all product records - wrong request - no params", (done) => {
        let params = {};
        requester('/products', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});

describe("Testing list console products API", () => {
    it("Success - will return all console product records", (done) => {
        let params = {};
        requester('/products/console', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Fail - will not return all product records - wrong request - no params", (done) => {
        let params = {};
        requester('/products/console', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});


"use strict";
const assert = require('assert');
const requester = require('../../requester');

describe("Testing add product API", () => {
    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return ", (done) => {
        let params = {
            form: {
                name: 'SOME',
                code: 'SOMEC'
            }
        };
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            done();
        });
    });

    it("Fail - will not return - no name", (done) => {
        let params = {};
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
});

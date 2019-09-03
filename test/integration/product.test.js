"use strict";
const assert = require('assert');
let request = require("request");

let extKey = '';

function requester(apiName, method, params, cb) {
    let options = {
        uri: 'http://127.0.0.1:4004' + apiName,
        headers: {
            key: extKey
        },
        method: method.toUpperCase(),
        json: true
    };

    if (params.headers) {
        for (let header in params.headers) {
            if (Object.hasOwnProperty.call(params.headers, header)) {
                options.headers[header] = params.headers[header];
            }
        }
    }
    if (params.form) {
        options.form = params.form;
    }
    if (params.qs) {
        options.qs = params.qs;
    }
    if (method === 'delete') {
        request.del(options, function (error, response, body) {
            assert.ifError(error);
            assert.ok(body);
            return cb(null, body);
        });
    } else {
        request[method](options, function (error, response, body) {
            assert.ifError(error);
            assert.ok(body);
            return cb(null, body);
        });
    }
}

describe("starting product integration tests", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    describe("Testing list products API", () => {
        it("Success - will return all product records", (done) => {
            let params = {};
            requester('/products', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.data);
                assert.ok(body.data.length > 0);
                done();
            });
        });

        it("Fail - will not return all product records - wrong request", (done) => {
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

        it("Fail - will not return all product records - wrong request", (done) => {
            let params = {};
            requester('/products/console', 'post', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

    describe("Testing get product API", () => {
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

});
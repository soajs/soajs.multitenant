"use strict";
const assert = require('assert');
let request = require("request");

let extKey = 'aa39b5490c4a4ed0e56d7ec1232a428f771e8bb83cfcee16de14f735d0f5da587d5968ec4f785e38570902fd24e0b522b46cb171872d1ea038e88328e7d973ff47d9392f72b2d49566209eb88eb60aed8534a965cf30072c39565bd8d72f68ac';

function requester(apiName, method, params, cb) {
    let options = {
        uri: 'http://127.0.0.1:4000/multitenant' + apiName,
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
            } else {
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

describe("starting Tenant integration tests", () => {

    before(function (done) {
       done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    describe("Testing list tenants API", () => {
        it("Success - will return all tenant records", (done) => {
            let params = {};
            requester('/tenants', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.data);
                assert.ok(body.data.length > 0);
                done();
            });
        });

        it("Fail - will not return all tenant records - wrong request", (done) => {
            let params = {};
            requester('/tenants', 'post', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

});
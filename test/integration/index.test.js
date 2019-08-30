"use strict";
const assert = require('assert');
const imported = require("../data/import.js");

let soajs = require('soajs');
let request = require("request");
let helper = require("../helper.js");

let Mongo = soajs.mongo;
let dbConfig = require("./db.config.test.js");

let sessionConfig = dbConfig();
sessionConfig.name = "core_session";
let mongoSession = new Mongo(sessionConfig);

let multitenancyConfig = dbConfig();
multitenancyConfig.name = "test_multitenancy";
let mongo = new Mongo(multitenancyConfig);


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

describe("starting integration tests", () => {

    before(function (done) {
        mongoSession.dropDatabase(function () {
            console.log('starting tests ....');
            setTimeout(function () {
                done();
            }, 500);
        });
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("do import", (done) => {
        let rootPath = process.cwd();
        imported(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/provision/", (err, msg) => {
            if (err)
                console.log(err);
            if (msg)
                console.log(msg);

            done();
        });
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

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const assert = require('assert');
const requester = require('../../requester');

let params = {
    body: {
        "name": "tenant ddd1",
        "code": "ddd1",
        "description": "tenant delete",
        "type": "product",
        "profile": {},
        "tag": "tag",
        "oauth": {
            "secret": "this is a secret test",
            "redirectURI": "http://domain.com",
            "grants": [
                "password",
                "refresh_token"
            ],
            "disabled": 0,
            "type": 1,
            "loginMode": "urac"
        }
    }
};
let ids = [];

describe("Testing delete tenants API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will add ddd1 ", (done) => {
        params.body.name = "tenant ddd1";
        params.body.code = "ddd1";

        requester('/tenant', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            ids.push(body.data._id);
            done();
        });
    });
    it("Success - will add ddd2 ", (done) => {
        params.body.name = "tenant ddd2";
        params.body.code = "ddd2";

        requester('/tenant', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            ids.push(body.data._id);
            done();
        });
    });
    it("Success - will add ddd3 ", (done) => {
        params.body.name = "tenant ddd3";
        params.body.code = "ddd3";

        requester('/tenant', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            ids.push(body.data._id);
            done();
        });
    });

    it("Success - delete tenants ", (done) => {
        let params1 = { "qs": { "ids": ids } };
        requester('/tenants', 'delete', params1, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.strictEqual(body.data.deletedCount, 3);
            done();
        });
    });

});
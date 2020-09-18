
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

describe("Testing get product Scope Raw", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	
	it("Success - will return product Scope Raw by id", (done) => {
		let params = {
			qs: {
				id: '5f575ec295bb89628f3221d1'
			}
		};
		requester('/product/acl/scope/raw', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});

    it("Fail - will not return product scope", (done) => {
        let params = {
	        qs: {
		        id: '123'
	        }
        };
        requester('/product/acl/scope/raw', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
	
	it("Success - will return console product scope", (done) => {
		let params = {
			qs: {
				id: '5512867be603d7e01ab1688d'
			}
		};
		requester('/product/console/acl/scope/raw', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});
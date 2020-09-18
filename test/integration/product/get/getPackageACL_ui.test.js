
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

describe("Testing get product package UI", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	
	it("Success - will return product package UI by env", (done) => {
		let params = {
			qs: {
				id: '5f575ec295bb89628f3221d1',
				package: 'TEST2_NEWS',
				config: {
					envs: ['dashboard'],
					type: "granular"
				}
			}
		};
		requester('/product/package/acl/ui', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	
	it("Success - will return product package UI by env", (done) => {
		let params = {
			qs: {
				id: '5f575ec295bb89628f3221d1',
				package: 'TEST2_NEWS',
				config: {
					envs: ['dashboard'],
					type: "apiGroup"
				}
			}
		};
		requester('/product/package/acl/ui', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});

    it("Fail - will not return product package UI", (done) => {
        let params = {
	        qs: {
		        id: '123',
		        package: 'TEST2_NEWS',
		        config: {
			        envs: ['dashboard'],
			        type: "apiGroup"
		        }
	        }
        };
        requester('/product/package/acl/ui', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
	
	it("Success - will return console package product", (done) => {
		let params = {
			qs: {
				id: '5512867be603d7e01ab1688d',
				package: 'DSBRD_GUEST',
				config: {
					envs: ['dashboard'],
					type: "apiGroup"
				}
			}
		};
		requester('/product/console/package/acl/ui', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});
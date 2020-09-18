
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

describe("Testing get product package service", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	
	it("Success - will return product package service by env", (done) => {
		let params = {
			qs: {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEWS',
				mainEnv: 'dev',
				secEnv: 'stage',
			}
		};
		requester('/product/package/acl/service', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});

    it("Fail - will not return product package service", (done) => {
        let params = {
	        qs: {
		        productCode: '123123',
		        packageCode: 'TEST2_NEWS',
		        mainEnv: 'dev',
		        secEnv: 'stage',
	        }
        };
        requester('/product/package/acl/service', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
	
	it("Success - will return console package product", (done) => {
		let params = {
			qs: {
				productCode: 'DSBRD',
				packageCode: 'DSBRD_GUEST',
				mainEnv: 'dev',
				secEnv: 'stage',
			}
		};
		requester('/product/console/package/acl/service', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});
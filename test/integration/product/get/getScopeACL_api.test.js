
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

describe("Testing get product api", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	
	it("Success - will return product api by env", (done) => {
		let params = {
			qs: {
				productCode: 'TEST2',
				mainEnv: 'dev',
				secEnv: 'stage',
			}
		};
		requester('/product/acl/scope/api', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});

    it("Fail - will not return product api", (done) => {
        let params = {
	        qs: {
		        productCode: '123123',
		        mainEnv: 'dev',
		        secEnv: 'stage',
	        }
        };
        requester('/product/acl/scope/api', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            done();
        });
    });
	
	it("Success - will return console product", (done) => {
		let params = {
			qs: {
				productCode: 'DSBRD',
				mainEnv: 'dev',
				secEnv: 'stage',
			}
		};
		requester('/product/console/acl/scope/api', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});
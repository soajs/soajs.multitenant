
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

let extKeyTest = 'aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25';

describe("Testing update tenant oauth API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will update tenant oauth - id", (done) => {
        let params = {
        	qs: {
		        id: "5e348418ed5e433de5bea716",
	        },
            body: {
	            type: 2,
	            oauthType: "miniurac",
	            redirectURI: "http://domain.com",
	            grants: [
		            "password",
		            "refresh_token"
	            ],
	            secret: "this is a secret",
	            availableEnv: ["dashboard"]
            }
        };
        requester('/admin/tenant/oauth', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            done();
        });
    });
	
	
	it("Success - will update tenant - no id", (done) => {
		let params = {
			headers: {
				access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
				key: extKeyTest
			},
			body: {
				type: 2,
				oauthType: "miniurac",
				redirectURI: "http://domain.com",
				grants: [
					"password",
					"refresh_token"
				],
				secret: "this is a secret too",
				availableEnv: ["dashboard"]
			}
		};
		requester('/tenant/oauth', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
    it("Fail - will not update tenant record", (done) => {
		let params = {
			qs: {
				id: "123",
			},
			body: {
				type: 1,
				oauthType: "urac",
				redirectURI: "http://domain.com",
				grants: [
					"password",
					"refresh_token"
				],
				secret: "this is a secret",
				pin: {
					DSBRD: {
						enabled: false
					}
				},
			}
		};
		requester('/tenant/console/oauth', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.errors.codes);
			done();
		});
	});
	
	it("fail - will update console tenant oauth", (done) => {
		let params = {
			qs: {
				id: "5c0e74ba9acc3c5a84a51259"
			},
			body: {
				type: 0,
				oauthType: "urac",
				redirectURI: "http://domain.com",
				grants: [
					"password",
					"refresh_token"
				],
				secret: "this is a secret",
				availableEnv: ["dashboard"],
				pin: {
					DSBRD: {
						enabled: false
					}
				},
			}
		};
		requester('/tenant/console/oauth', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.errors.codes);
			done();
		});
	});
	it("Success - will update console tenant oauth", (done) => {
		let params = {
			qs: {
				id: "5c0e74ba9acc3c5a84a51259"
			},
			body: {
				type: 2,
				oauthType: "urac",
				redirectURI: "http://domain.com",
				grants: [
					"password",
					"refresh_token"
				],
				secret: "this is a secret too",
				availableEnv: ["dashboard"],
				pin: {
					DSBRD: {
						enabled: false
					}
				},
			}
		};
		requester('/tenant/console/oauth', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});
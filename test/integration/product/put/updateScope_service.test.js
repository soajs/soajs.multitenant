
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

describe("Testing update product service", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will update scope service", (done) => {
        let params = {
            qs: {
	            productCode: "TEST2",
	            env: "dev",
            },
            body: {
                "acl": [
	                {
		                "service": "urac",
		                "version": "3",
		                "envs": {
			                "dev": true
		                },
		                "restriction": {
			                "dev": true
		                },
		                "access": {
			                "dev": true
		                },
	                },
	                {
		                "service": "multitenant",
		                "version": "1",
		                "envs": {
			                "dev": false
		                },
		                "restriction": {
			                "dev": true
		                },
		                "access": {
			                "dev": true
		                },
	                }
                ]
                
            }
        };
        requester('/product/acl/scope/service', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            done();

        });
    });

    it("Fails - will not update", (done) => {
	    let params = {
		    qs: {
			    productCode: "TEST232",
			    env: "dev",
		    },
		    body: {
			    "acl": [
				    {
					    "service": "urac",
					    "version": "3",
					    "envs": {
						    "dev": true
					    },
					    "restriction": {
						    "dev": true
					    },
					    "access": {
						    "dev": true
					    },
				    },
				    {
					    "service": "multitenant",
					    "version": "1",
					    "envs": {
						    "dev": false
					    },
					    "restriction": {
						    "dev": true
					    },
					    "access": {
						    "dev": true
					    },
				    }
			    ]
			
		    }
	    };
	    requester('/product/acl/scope/service', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors);
            done();

        });
    });
	it("Success - will update console scope service", (done) => {
		let params = {
			qs: {
				productCode: "DSBRD",
				env: "dev",
			},
			body: {
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dev": true
						},
						"restriction": {
							"dev": true
						},
						"access": {
							"dev": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dev": false
						},
						"restriction": {
							"dev": true
						},
						"access": {
							"dev": true
						},
					}
				]
				
			}
		};
		requester('/product/console/acl/scope/service', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});

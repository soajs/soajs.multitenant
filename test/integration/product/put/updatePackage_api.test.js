
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

describe("Testing update product API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will update package api", (done) => {
        let params = {
            qs: {
	            productCode: "TEST2",
	            packageCode: "TEST2_NEWS",
	            env: "dev",
            },
            body: {
                "acl": [
	                {
		                "service": "urac",
		                "version": "3",
		                "group": "My account guest",
		                "method": "get",
		                "api": "/password/forgot",
		                "envs": {
			                "dev": true
		                },
		                "access": {
			                "dev": false
		                },
		                "restriction": {
			                "dev": true
		                },
	                },
	                {
		                "service": "urac",
		                "version": "3",
		                "group": "My account guest",
		                "method": "get",
		                "api": "/emailToken",
		                "envs": {
			                "dev": true
		                },
		                "access": {
			                "dev": true
		                },
		                "restriction": {
			                "dev": true
		                },
	                },
	                {
		                "service": "urac",
		                "version": "3",
		                "group": "My account guest",
		                "method": "get",
		                "api": "/validate/changeEmail",
		                "envs": {
			                "dev": true
		                },
		                "access": {
			                "dev": true
		                },
		                "restriction": {
			                "dev": true
		                },
	                }
                ]
                
            }
        };
        requester('/product/package/acl/api', 'put', params, (error, body) => {
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
			    packageCode: "DSBRD_GUEST",
			    env: "dev",
		    },
		    body: {
			    "acl": [
				    {
					    "service": "urac",
					    "version": "3",
					    "group": "My account guest",
					    "method": "get",
					    "api": "/password/forgot",
					    "envs": {
						    "dev": true
					    },
					    "access": {
						    "dev": false
					    },
					    "restriction": {
						    "dev": true
					    }
				    },
				    {
					    "service": "urac",
					    "version": "3",
					    "group": "My account guest",
					    "method": "get",
					    "api": "/emailToken",
					    "envs": {
						    "dev": true
					    },
					    "access": {
						    "dev": true
					    },
					    "restriction": {
						    "dev": true
					    },
				    },
				    {
					    "service": "urac",
					    "version": "3",
					    "group": "My account guest",
					    "method": "get",
					    "api": "/validate/changeEmail",
					    "envs": {
						    "dev": true
					    },
					    "access": {
						    "dev": true
					    },
					    "restriction": {
						    "dev": true
					    },
				    }
			    ]
			
		    }
	    };
	    requester('/product/package/acl/api', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors);
            done();

        });
    });
	it("Success - will update console scope api", (done) => {
		let params = {
			qs: {
				productCode: "DSBRD",
				packageCode: "DSBRD_GUEST",
				env: "dev",
			},
			body: {
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/password/forgot",
						"envs": {
							"dev": true
						},
						"access": {
							"dev": false
						},
						"restriction": {
							"dev": true
						},
					},
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/emailToken",
						"envs": {
							"dev": true
						},
						"access": {
							"dev": true
						},
						"restriction": {
							"dev": true
						},
					},
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/validate/changeEmail",
						"envs": {
							"dev": true
						},
						"access": {
							"dev": true
						},
						"restriction": {
							"dev": true
						},
					}
				]
				
			}
		};
		requester('/product/console/package/acl/api', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});

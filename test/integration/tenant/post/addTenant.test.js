"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let addTenantSchema = require("../schemas/addTenant.js");
let getTenantsSchema = require("../schemas/getTenant.js");

describe("Testing add tenant API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	let product;
    it("Success - will add product tenant record - tenant only ", (done) => {
        let params = {
            body: {
                "name": "tenant product only",
                "code": "ttoc",
                "description": "tenant product only",
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
        requester('/tenant', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
	        product = body.data;
            let check = validator.validate(body, addTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return tenant record - code", (done) => {
        let params = {
            qs: {
                code: 'ttoc'
            }
        };
        requester('/tenant', 'get', params, (error, body) => {
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.oauth, {
	            "secret": "this is a secret test",
	            "redirectURI": "http://domain.com",
	            "grants": [
		            "password",
		            "refresh_token"
	            ],
	            "disabled": 0,
	            "type": 1,
	            "loginMode": "urac"
            });
            let check = validator.validate(body, getTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
	
	it("Success - will add client tenant record - tenant only ", (done) => {
		let params = {
			body: {
				"name": "tenant client only",
				"description": "tenant client only",
				"mainTenant": product._id.toString(),
				"type": "client"
			}
		};
		requester('/tenant', 'post', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let check = validator.validate(body, addTenantSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will add client tenant record - with application ", (done) => {
		let params = {
			body: {
				"name": "tenant product with application",
				"description": "tenant product with application",
				"type": "product",
				"application": {
					"productCode": "tyrv",
					"packageCode": "packageCode",
					"description" : "123",
					"_TTL": "6",
				}
			}
		};
		requester('/tenant', 'post', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let check = validator.validate(body, addTenantSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will add client tenant record - with application and app key", (done) => {
		let params = {
			body: {
				"name": "tenant product with application with key",
				"description": "tenant product with application with key",
				"type": "product",
				"application": {
					"productCode": "tyrv",
					"packageCode": "packageCode",
					"description" : "123",
					"_TTL": "6",
					"appKey": {
					}
				}
			}
		};
		requester('/tenant', 'post', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let check = validator.validate(body, addTenantSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will add client tenant record - with application and app key and ext key", (done) => {
		let params = {
			body: {
				"name": "tenant product with application with ext key",
				"description": "tenant product with application with ext",
				"type": "product",
				"application": {
					"productCode": "tyrv",
					"packageCode": "packageCode",
					"description" : "123",
					"_TTL": "6",
					"appKey": {
						"extKey" :{
							"label": "ttestkeylabel",
							"env": "dashbaord"
						}
					}
				}
			}
		};
		requester('/tenant', 'post', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let check = validator.validate(body, addTenantSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
    it.skip("Fails - will not add tenant record - no input", (done) => {
        let params = {};

        requester('/tenant', 'post', params, (error, body) => {
            assert.ok(error);

            let check = validator.validate(body, addTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
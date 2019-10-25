
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

let core = require('soajs').core;
let validator = new core.validator.Validator();
let addTenantSchema = require("../schemas/addTenant.js");
let getTenantsSchema = require("../schemas/getTenant.js");
let listTenantsSchema = require("../schemas/listTenants.js");

let extKey = 'aa39b5490c4a4ed0e56d7ec1232a428f7ad78ebb7347db3fc9875cb10c2bce39bbf8aabacf9e00420afb580b15698c04ce10d659d1972ebc53e76b6bbae0c113bee1e23062800bc830e4c329ca913fefebd1f1222295cf2eb5486224044b4d0c';

describe("Testing add tenant API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	let product;
	let client;
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

    it("Success - will return product tenant record - id", (done) => {
        let params = {
            qs: {
                id: product._id
            }
        };
        requester('/admin/tenant', 'get', params, (error, body) => {
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
			client = body.data;
			let check = validator.validate(body, addTenantSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

    it("Success - will check for client tenant record", (done) => {
        let params = {};
        requester('/tenants', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            let found;
            body.data.forEach(tenant => {
               if (tenant.name === "tenant client only" && tenant.name === client.name) {
                   found = true;
               }
            });
            assert.ok(found);
            assert.ok(body.data.length > 0);
            let check = validator.validate(body, listTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

	it("Success - will add client tenant record - no maintenant", (done) => {
		let params = {
			body: {
				"name": "tenant client no main",
				"description": "tenant client only",
				"type": "client"
			},
			headers: {
				key: extKey
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

	it("Success - will check for client tenant record - no maintenant", (done) => {
		let params = {};
		requester('/tenants', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let found;
			body.data.forEach(tenant => {
				if (tenant.name === "tenant client no main") {
					found = true;
				}
			});
			assert.ok(found);
			assert.ok(body.data.length > 0);
			let check = validator.validate(body, listTenantsSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

	it("Success - will add client tenant record - no maintenant", (done) => {
		let params = {
			body: {
				"name": "tenant product no main",
				"description": "tenant client only",
				"type": "product"
			},
			headers: {
				key: extKey
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

	it("Success - will check for client tenant record - no maintenant", (done) => {
		let params = {};
		requester('/tenants', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let found;
			body.data.forEach(tenant => {
				if (tenant.name === "tenant product no main") {
					found = true;
				}
			});
			assert.ok(found);
			assert.ok(body.data.length > 0);
			let check = validator.validate(body, listTenantsSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

	it("Success - will add product tenant record - with application ", (done) => {
		let params = {
			body: {
				"name": "tenant product with application",
				"description": "tenant product with application",
				"type": "product",
				"application": {
					"productCode": "tyrv",
					"packageCode": "PaaK",
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

	it("Success - will check client tenant record - with application", (done) => {
		let params = {};
		requester('/tenants', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let found;
			body.data.forEach(tenant => {
				if (tenant.name === "tenant product with application") {
					found = true;
				}
			});
			assert.ok(found);
			assert.ok(body.data.length > 0);
			let check = validator.validate(body, listTenantsSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - will add product tenant record - with application and app key", (done) => {
		let params = {
			body: {
				"name": "tenant product with application with key",
				"description": "tenant product with application with key",
				"type": "product",
				"application": {
					"productCode": "tyrv",
					"packageCode": "PACK",
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

	it("Success - will check client tenant record - with application and app key", (done) => {
		let params = {};
		requester('/tenants', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let found;
			body.data.forEach(tenant => {
				if (tenant.name === "tenant product with application with key") {
					found = true;
				}
			});
			assert.ok(found);
			assert.ok(body.data.length > 0);
			let check = validator.validate(body, listTenantsSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});


    it("Success - will add product tenant record - with application and app key and ext key", (done) => {
		let params = {
			body: {
				"name": "tenant product with application with ext key",
				"description": "tenant product with application with ext",
				"type": "product",
				"application": {
					"productCode": "prod",
					"packageCode": "pack",
					"description" : "123",
					"_TTL": "6",
					"appKey": {
						"extKey" :{
							"label": "ttestkeylabel",
							"env": "DEV"
						}
					}
				},
				"oauth": {
					"secret": "secret",
					"redirectURI": "http://localhost.com",
					"grants": [
						"password",
					],
					"disabled": 0,
					"type": 2,
					"loginMode": "urac",
					"pin": {
						"test": {
							"enabled": false
						}
					},
				},
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

	it("Success - will check client tenant record - with application and app key", (done) => {
		let params = {};
		requester('/tenants', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			let found;
			body.data.forEach(tenant => {
				if (tenant.name === "tenant product with application with ext key") {
					found = true;
				}
			});
			assert.ok(found);
			assert.ok(body.data.length > 0);
			let check = validator.validate(body, listTenantsSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});


    it("Fails - will not add tenant record - no input", (done) => {
        let params = {};

        requester('/tenant', 'post', params, (error, body) => {
            assert.ok(body);
			assert.ok(body.errors);
            let check = validator.validate(body, addTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
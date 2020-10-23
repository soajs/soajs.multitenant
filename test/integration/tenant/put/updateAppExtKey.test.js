
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
let updateAppExtKeySchema = require("../schemas/updateAppExtKey.js");
let listTenantsSchema = require("../schemas/listTenants.js");
let getTenantSchema = require("../schemas/getTenant");

let extKeyTest = 'aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25';

describe("Testing update app external key of tenant API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let tenants = [];
    let selectedTenant;

    it("Success - will return all tenant records - no input", (done) => {
        let params = {};
        requester('/tenants', 'get', params, (error, body) => {
	        assert.ifError(error);
	        assert.ok(body);
	        assert.ok(body.data);
	        assert.ok(body.data.items);
	        assert.ok(body.data.items.length > 0);
	        let check = validator.validate(body, listTenantsSchema);
	        assert.deepEqual(check.valid, true);
	        assert.deepEqual(check.errors, []);
	        let tenants = body.data.items;
	        tenants.forEach(tenant => {
		        if (tenant.code === 'test2') {
			        selectedTenant = tenant;
		        }
	        });
	        done();
        });
    });

    it("Success - will update tenant application external key - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            },
            body: {
                appId: '30d2cb5fc04ce51e06000003',
                key: 'ff7b65bb252201121f1be95adc08f44a',
                extKey: "aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25",
                expDate: '2019-12-23T18:25:43.511Z',
                device: {},
                geo: {},
                label: "labelUdate",
                extKeyEnv: "DASHBOARD",
            }
        };
        requester('/admin/tenant/application/key/ext', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, updateAppExtKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
	
	it("Success - will update tenant console application external key - id", (done) => {
		let params = {
			qs: {
				id: "5c0e74ba9acc3c5a84a51259"
			},
			body: {
				appId: '5c0e74ba9acc3c5a84a5125a',
				key: 'a139786a6e6d18e48b4987e83789430b',
				extKey: "3d90163cf9d6b3076ad26aa5ed58556348069258e5c6c941ee0f18448b570ad1c5c790e2d2a1989680c55f4904e2005ff5f8e71606e4aa641e67882f4210ebbc5460ff305dcb36e6ec2a2299cf0448ef60b9e38f41950ec251c1cf41f05f3ce9",
				expDate: '2043-12-23T18:25:43.511Z',
				device: {},
				geo: {},
				label: "labelUdate",
				extKeyEnv: "DASHBOARD",
			}
		};
		requester('/tenant/console/application/key/ext', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data, 1);
			let check = validator.validate(body, updateAppExtKeySchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

    it("Success - will return tenant record - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            }
        };
        requester('/admin/tenant', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            body.data.applications.forEach(app => {
                if(app.appId === "30d2cb5fc04ce51e06000003") {
                    app.keys.forEach(k => {
                        k.extKeys.forEach(extK => {
                            if (extK.extKey === "aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25") {
                                assert.deepEqual(extK.label, 'labelUdate');
                            }
                        });
                    });
                }
            });
            let check = validator.validate(body, getTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will update tenant application external key - no id", (done) => {
        let params = {
            headers: {
	            access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
                key: extKeyTest
            },
            body: {
                appId: '30d2cb5fc04ce51e06000003',
                key: 'ff7b65bb252201121f1be95adc08f44a',
                extKey: "aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25",
                expDate: '2019-12-23T18:25:43.511Z',
                device: {},
                geo: {},
                label: "updateExternal",
                extKeyEnv: "dev",
            }
        };
        requester('/tenant/application/key/ext', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, updateAppExtKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return tenant record", (done) => {
        let params = {
            headers: {
	            access_token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
                key: extKeyTest
            }
        };
        requester('/tenant', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            body.data.applications.forEach(app => {
                if(app.appId === "30d2cb5fc04ce51e06000003") {
                    app.keys.forEach(k => {
                        k.extKeys.forEach(extK => {
                            if (extK.extKey === "aa39b5490c4a4ed0e56d7ec1232a428f1c5b5dcabc0788ce563402e233386738fc3eb18234a486ce1667cf70bd0e8b08890a86126cf1aa8d38f84606d8a6346359a61678428343e01319e0b784bc7e2ca267bbaafccffcb6174206e8c83f2a25") {
                                assert.deepEqual(extK.label, 'updateExternal');
                            }
                        });
                    });
                }
            });
            let check = validator.validate(body, getTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not update tenant application external key - no params - admin", (done) => {
        let params = {};
        requester('/admin/tenant/application/key/ext', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, updateAppExtKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not update tenant application external key - no params", (done) => {
        let params = {};
        requester('/tenant/application/key/ext', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, updateAppExtKeySchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
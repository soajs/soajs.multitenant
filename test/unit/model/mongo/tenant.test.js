/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../../helper.js");
const Tenant = helper.requireModule('model/mongo/tenant.js');
const assert = require('assert');

describe("Unit test for: Model - tenant", () => {
	let model;
	let tenantTest;
	let service = {
		config: {
			"errors": {},
		},
		log: {
			error: () => {
				console.log();
			},
			debug: () => {
				console.log();
			}
		},
		registry: {
			get: () => {
				return {
					coreDB: {
						provision: {
							"name": "core_provision",
							"prefix": '',
							"servers": [
								{
									"host": "127.0.0.1",
									"port": 27017
								}
							],
							"credentials": null,
							"URLParam": {
								"useUnifiedTopology": true
							}
						}
					}
				};
			}
		}
	};
	
	describe("Testing tenant no instance", () => {
		before((done) => {
			model = new Tenant(service);
			done();
		});
		
		afterEach((done) => {
			done();
		});
	});
	
	describe("Testing tenant with db config", () => {
		before((done) => {
			model = new Tenant(service, {
				"name": "core_provision",
				"prefix": '',
				"servers": [
					{
						"host": "127.0.0.1",
						"port": 27017
					}
				],
				"credentials": null,
				"URLParam": {
					"useUnifiedTopology": true
				}
			}, null);
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success - validateId", (done) => {
			model.validateId('5d7bad57b06cdd344d81b5ed', (err, id) => {
				assert.ok(id);
				done();
			});
		});
		
		it("Fails -  null validateId", (done) => {
			model.validateId(null, (err, id) => {
				assert.ok(err);
				assert.deepEqual(id, null);
				done();
			});
		});
		
		it("Fails - validateId", (done) => {
			model.validateId(123, (err, id) => {
				assert.ok(err);
				assert.deepEqual(id, null);
				done();
			});
		});
		
		it("Success - listProducts - empty object", (done) => {
			model.listTenants({}, (err, records) => {
				assert.ok(records);
				assert.deepEqual(Array.isArray(records.items), true);
				assert.deepEqual(records.items.length, 2);
				done();
			});
		});
		
		it("Success - listProducts - client type", (done) => {
			model.listTenants({type: 'client'}, (err, records) => {
				assert.ok(records);
				assert.deepEqual(Array.isArray(records.items), true);
				done();
			});
		});
		
		// it("Success - listProducts - null object", (done) => {
		//     model.listTenants(null, (err, records) => {
		//         assert.ok(err);
		//         done();
		//     });
		// });
		
		it("Success - getTenant code", (done) => {
			model.getTenant({code: "test"}, (err, record) => {
				assert.ifError(err);
				assert.ok(record);
				tenantTest = record;
				assert.deepEqual(record.name, 'Test Tenant');
				assert.deepEqual(record.description, 'this is a description for test tenant');
				done();
			});
		});
		
		it("Success - getTenant id", (done) => {
			let selectedTenant;
			model.listTenants({}, (err, records) => {
				records.items.forEach(record => {
					if (record.code === 'test') {
						selectedTenant = record;
					}
				});
				model.getTenant({id: selectedTenant._id}, (err, record) => {
					assert.ifError(err);
					assert.ok(record);
					assert.deepEqual(record.name, 'Test Tenant');
					assert.deepEqual(record.description, 'this is a description for test tenant');
					assert.deepEqual(typeof record, "object");
					done();
				});
			});
		});
		
		it("Success - getTenant - null", (done) => {
			model.getTenant(null, (err) => {
				assert.ok(err);
				assert.deepEqual(err, new Error("id, code, or name is required."));
				done();
			});
		});
		
		it("Fail - getTenant - empty object", (done) => {
			model.getTenant({}, (err) => {
				assert.ok(err);
				assert.deepEqual(err, new Error("id, code, or name is required."));
				done();
			});
		});
		
		it("Fail - getTenant - bad id", (done) => {
			model.getTenant({id: "Qweq3234"}, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Success - listAllTenants - null data", (done) => {
			model.listAllTenants(null, (err, records) => {
				assert.ok(records);
				assert.ok(records.length > 0);
				done();
			});
		});
		
		it("Success - listAllTenants - data", (done) => {
			model.listAllTenants({
				fields: [
					'code'
				]
			}, (err, records) => {
				assert.ok(records);
				assert.ok(records.length > 0);
				done();
			});
		});
		
		it("Fails - countTenants - null data", (done) => {
			model.countTenants(null, (err) => {
				assert.ok(err);
				assert.deepEqual(err, new Error("name is required."));
				done();
			});
		});
		
		it("Success - countTenants - data", (done) => {
			model.countTenants({name: 'Console Tenant', code: 'DBTN'}, (err, count) => {
				assert.ok(count);
				assert.deepEqual(count, 1);
				done();
			});
		});
		
		it("Success - generateId", (done) => {
			let id = model.generateId(() => {
			});
			assert.ok(id);
			done();
		});
		
		let addedRecord;
		
		it("Success - addTenant - data", (done) => {
			let inputmaskData = {
				name: 'test2',
				code: 'test2'
			};
			model.addTenant(inputmaskData, (err, record) => {
				assert.ok(record);
				addedRecord = record;
				done();
			});
		});
		
		it("Success - updateTenant - data", (done) => {
			let inputmaskData = {
				_id: addedRecord._id,
				name: 'test2 updated',
				code: 'test2',
				description: "Updated Description",
				tag: "Updated Tag"
			};
			model.updateTenant(inputmaskData, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record, 1);
				done();
			});
		});
		
		it("Success - updateTenant - profile", (done) => {
			let inputmaskData = {
				_id: addedRecord._id,
				profile: {
					"test": "update"
				}
			};
			model.updateTenant(inputmaskData, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record, 1);
				done();
			});
		});
		
		it("Fails - updateTenant - profile no id", (done) => {
			let inputmaskData = {
				profile: {
					"test": "update"
				}
			};
			model.updateTenant(inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err, new Error("_id is required."));
				done();
			});
		});
		
		it("Success - updateTenant - nothing to update", (done) => {
			model.updateTenant({_id: addedRecord._id}, (err, record) => {
				assert.deepEqual(record, 0);
				done();
			});
		});
		
		it("fail - addTenant - null", (done) => {
			model.addTenant(null, (err) => {
				assert.ok(err);
				assert.deepEqual(err, new Error("name and code are required."));
				done();
			});
		});
		
		it("Fails - removeApplicationKey - null", (done) => {
			model.removeApplicationKey(null, (err) => {
				assert.ok(err);
				assert.deepEqual(err, new Error("_id, appId, and key are required."));
				done();
			});
		});
		
		it("Success - removeApplicationKey - id", (done) => {
			let inputmaskData = {
				_id: tenantTest._id,
				appId: '30d2cb5fc04ce51e06000003',
				key: 'ff7b65bb252201121f1be95adc08f44a'
			};
			model.removeApplicationKey(inputmaskData, (err, result) => {
				assert.ok(result);
				assert.deepEqual(result, 1);
				done();
			});
		});
		
		it("fail - removeApplicationKey - appId", (done) => {
			let inputmaskData = {
				_id: tenantTest._id,
				appId: 'wewe2',
				key: 'ff7b65bb252201121f1be95adc08f44a'
			};
			model.removeApplicationKey(inputmaskData, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - removeApplication - null", (done) => {
			model.removeApplication(null, (err) => {
				assert.ok(err);
				assert.deepEqual(err, new Error("_id and appId are required."));
				done();
			});
		});
		
		it("Success - removeApplication - id", (done) => {
			let inputmaskData = {
				_id: tenantTest._id,
				appId: '30d2cb5fc04ce51e06000003',
			};
			model.removeApplication(inputmaskData, (err, result) => {
				assert.ok(result);
				assert.deepEqual(result, 1);
				done();
			});
		});
		
		it("fail - removeApplication - id", (done) => {
			let inputmaskData = {
				_id: tenantTest._id,
				appId: 'rwe32',
			};
			model.removeApplication(inputmaskData, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Success - deleteTenant - id", (done) => {
			let inputmaskData = {
				_id: addedRecord._id
			};
			model.deleteTenant(inputmaskData, (err, result) => {
				assert.ok(result);
				assert.notDeepStrictEqual(result.result, {deletedCount: 1, ok: true});
				done();
			});
		});
		
		it("Success - deleteTenant - code", (done) => {
			let inputmaskData = {
				code: 'test'
			};
			model.deleteTenant(inputmaskData, (err, result) => {
				assert.ok(result);
				assert.notDeepStrictEqual(result.result, {deletedCount: 1, ok: true});
				done();
			});
		});
		
		it("Fails - deleteTenant - null", (done) => {
			model.deleteTenant(null, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Success - closeConnection", (done) => {
			model.closeConnection();
			done();
		});
	});
	
	describe("Testing tenant with instance", () => {
		it("Success", (done) => {
			model = new Tenant(service, null, true);
			done();
		});
		
		it("Success", (done) => {
			model = new Tenant(service, {
				"name": "core_provision",
				"prefix": '',
				"servers": [
					{
						"host": "127.0.0.1",
						"port": 27017
					}
				],
				"index": "test",
				"credentials": null,
				"URLParam": {
					"useUnifiedTopology": true
				},
			}, null);
			model.closeConnection();
			done();
		});
		
		it("Success", (done) => {
			model = new Tenant(service, {
				"name": "core_provision",
				"prefix": '',
				"servers": [
					{
						"host": "127.0.0.1",
						"port": 27017
					}
				],
				"index": "test",
				"credentials": null,
				"URLParam": {
					"useUnifiedTopology": true
				},
				"dbConfig": {}
			}, null);
			done();
		});
	});
});

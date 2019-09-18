"use strict";

const helper = require("../../../helper.js");
const Tenant = helper.requireModule('model/mongo/tenant.js');
const assert = require('assert');

describe("Unit test for: Model - tenant", () => {
    let model;
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
                                "poolSize": 5,
                                "autoReconnect": true
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
                    "poolSize": 5,
                    "autoReconnect": true
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

        it("Fails - validateId", (done) => {
            model.validateId(null, (err, id) => {
                assert.ok(err);
                assert.deepEqual(id, null);
                done();
            });
        });

        it("Success - listProducts - empty object", (done) => {
            model.listTenants({}, (err, records) => {
                assert.ok(records);
                assert.deepEqual(Array.isArray(records), true);
                assert.deepEqual(records.length, 2);
                done();
            });
        });

        it("Success - listProducts - client type", (done) => {
            model.listTenants({type: 'client'}, (err, records) => {
                assert.ok(records);
                assert.deepEqual(Array.isArray(records), true);
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
                assert.deepEqual(record.name, 'Test Tenant');
                assert.deepEqual(record.description, 'this is a description for test tenant');
                done();
            });
        });

        it("Success - getTenant id", (done) => {
            let selectedTenant;
            model.listTenants({}, (err, records) => {
                records.forEach(record => {
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
            model.getTenant(null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, new Error("id or code is required."));
                done();
            });
        });

        it("Success - getTenant - empty object", (done) => {
            model.getTenant({}, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, new Error("id or code is required."));
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
            model.countTenants(null, (err, count) => {
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
            let id = model.generateId(() => {});
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

        it("Success - addTenant - null", (done) => {
            model.addTenant(null, (err, record) => {
                assert.ok(err);
                assert.deepEqual(err, new Error("name and code are required."));
                done();
            });
        });

        it("Success - deleteTenant - id", (done) => {
            let inputmaskData = {
                _id: addedRecord._id
            };
            model.deleteTenant(inputmaskData, (err, result) => {
                assert.ok(result);
                assert.deepEqual(result.result, { n: 1, ok: 1 });
                done();
            });
        });

        it("Success - deleteTenant - code", (done) => {
            let inputmaskData = {
                code: 'test'
            };
            model.deleteTenant(inputmaskData, (err, result) => {
                assert.ok(result);
                assert.deepEqual(result.result, { n: 1, ok: 1 });
                done();
            });
        });

        it("Fails - deleteTenant - null", (done) => {
            model.deleteTenant(null, (err, record) => {
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
    });
});
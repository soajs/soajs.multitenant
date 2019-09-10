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
        let tenants = [];
        let consoleTenants = [];

        it("Success - list Tenants", (done) => {
            model.listTenants(null, (err, records) => {
                tenants = records;
                assert.ok(records);
                done();
            });
        });

        it('Success - list Console Tenants', (done) => {
            model.listConsoleTenants({negate: true, type: "client"}, (err, records) => {
                consoleTenants = records;
                assert.ifError(err);
                assert.ok(records);
                done();
            });
        });

        it('Fails - list Console Tenants - no data', (done) => {
            model.listConsoleTenants(null, (err, records) => {
                assert.ok(err);
                done();
            });
        });

        it.skip("Success - get Tenant", (done) => {
            let inputmaskData = {
                id: consoleTenants[0]._id
            };

            model.getTenant(inputmaskData, (err, record) => {
                assert.ok(record);
                done();
            });
        });

        it('Fails - get Tenant - no data', (done) => {
            model.getTenant(null, (err, record) => {
                assert.ok(err);
                done();
            });
        });

        it('Success - update Tenants', (done) => {
            let inputmaskData = {
                id: tenants[1]._id,
                description: "New Desc",
                name: "New Name",
                type: "client"
            };
            model.getTenant(inputmaskData, (err, record) => {
                record.description = inputmaskData.description;
                record.name = inputmaskData.name;
                record.type = inputmaskData.type;
                model.updateTenant(record, (err, result) => {
                    assert.ifError(err);
                    assert.ok(result);
                    done();
                });
            });
        });

        it('Fails - update Tenants - no data', (done) => {
            model.updateTenant(null, (err, records) => {
                assert.ok(err);
                done();
            });
        });

        it("Success - closeConnection", (done) => {
            model.closeConnection();
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
        let tenants = [];

        it("Success - list Tenants", (done) => {
            model.listTenants(null, (err, records) => {
                tenants = records;
                assert.ok(records);
                done();
            });
        });

        it('Success - list Console Tenants', (done) => {
            model.listConsoleTenants({negate: true, type: "client"}, (err, records) => {
                assert.ifError(err);
                assert.ok(records);
                done();
            });
        });

        it('Fails - list Console Tenants - no data', (done) => {
            model.listConsoleTenants(null, (err, records) => {
                assert.ok(err);
                done();
            });
        });

        it("Success - get Tenant - id", (done) => {
            let inputmaskData = {
                id: tenants[0]._id
            };

            model.getTenant(inputmaskData, (err, record) => {
                assert.ifError(err);
                assert.ok(record);
                done();
            });
        });

        it("Success - get Tenant - code", (done) => {
            let inputmaskData = {
                code: 'DBTN'
            };

            model.getTenant(inputmaskData, (err, record) => {
                assert.ifError(err);
                assert.ok(record);
                done();
            });
        });

        it('Fails - get Tenant - no data', (done) => {
            model.getTenant(null, (err, record) => {
                assert.ok(err);
                done();
            });
        });

        it('Success - update Tenants', (done) => {
            let inputmaskData = {
                id: tenants[1]._id,
                description: "New Desc 2",
                name: "New Name 2",
                type: "client"
            };
            model.getTenant(inputmaskData, (err, record) => {
                record.description = inputmaskData.description;
                record.name = inputmaskData.name;
                record.type = inputmaskData.type;
                model.updateTenant(record, (err, result) => {
                    assert.ifError(err);
                    assert.ok(result);
                    done();
                });
            });
        });

        it('Fails - update Tenants - no data', (done) => {
            model.updateTenant(null, (err, records) => {
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
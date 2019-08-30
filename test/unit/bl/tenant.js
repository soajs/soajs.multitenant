"use strict";

const coreModules = require("soajs.core.modules");
const core = coreModules.core;
const helper = require("../../helper.js");
const BL = helper.requireModule('bl/tenant.js');
const assert = require('assert');

describe("Unit test for: BL - tenant", () => {

    let soajs = {
        config: {
            "errors": {
                430: "Tenant not found for this user.",
                601: "Model not found"
            },
        },
        log: {
            error: () => { console.log() }
        }
    };

    describe("Testing list tenant", () => {
        afterEach((done) => {
            BL.modelObj = null;
            BL.model = null;
            done();
        });

        it("Success - List tenants - null data", (done) => {
            BL.modelObj = {
                listTenants: (nullObject, cb) => {
                    return cb(null, []);
                }
            };
            BL.list(soajs, null, soajs.config, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Success - List tenants - null data - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        601: "Model not found"
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => { console.log() }
                }
            };
            function Tenant() {
                console.log("Tenant");
            }
            Tenant.prototype.listTenants = (data, cb) => {
                return cb(null, []);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;

            BL.list(soajsClient, null, soajsClient.config, (err, records) => {
                assert.ok(records);
                assert(Array.isArray(records));
                done();
            });
        });

        it("Fails - List tenants - error", (done) => {
            BL.modelObj = {
                listTenants: (nullObject, cb) => {
                    return cb(true, null);
                }
            };
            BL.list(soajs, null, soajs.config, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 430,
                    msg: soajs.config.errors[430]
                });
                done();
            });
        });

        it("Fails - List tenants - error - client tenant", (done) => {
            let soajsClient = {
                config: {
                    "errors": {
                        430: "Tenant not found for this user.",
                        601: "Model not found"
                    },
                },
                tenant: {
                    type: "client",
                    dbConfig: {}
                },
                log: {
                    error: () => { console.log() }
                }
            };
            function Tenant() {
                console.log("Tenant");
            }
            Tenant.prototype.listTenants = (data, cb) => {
                return cb(true, null);
            };
            Tenant.prototype.closeConnection = () => {
            };
            BL.model = Tenant;
            BL.list(soajsClient, null, soajsClient.config, (err, records) => {
                assert.ok(err);
                assert.equal(records, null);
                assert.deepEqual(err, {
                    code: 430,
                    msg: soajs.config.errors[430]
                });
                done();
            });
        });
    });
});
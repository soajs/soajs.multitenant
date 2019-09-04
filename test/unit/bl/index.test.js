"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/index.js');


describe("Unit test for: BL - product", () => {

    let soajs = {
        config: {
            "errors": {
                460: "Unable to find product",
                601: "Model not found"
            },
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
                    "coreDB": {
                        "provision": {
                            "name": "core_provision",
                            "prefix": "",
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

    describe("Unit test index init", () => {
        it("Success - init", (done) => {
            BL.init(soajs, soajs.config, (err, records) => {
                done();
            });
        });
    });

});
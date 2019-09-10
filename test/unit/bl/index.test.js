"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/index.js');


describe("Unit test for: BL - product", () => {

    let soajs = {
        config: {
            "errors": {
                421: "Unable to update the tenant record",
                423: "An id must be provided",
                426: 'Invalid Product ID provided',
                430: "Tenant not found for this user",
                436: "Unable to find tenants",
                437: "Unable to get the environment records",
                460: "Unable to find products",
                461: "Unable to find package",
                464: "You are not allowed to remove the key you are currently logged in with",
                466: "You are not allowed to remove the product you are currently logged in with",
                467: "Package already exists",
                468: "Product already exists",
                469: "Unable to add the product record",
                473: "Missing required fields",
                474: "Missing required field: either id or code",
                475: "Unable to remove product record",
                476: "Unable to update product record",
                477: "Invalid product code provided",
                500: "This record is locked. You cannot modify or delete it",
                601: "Model not found",
                602: "Model error: ",
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
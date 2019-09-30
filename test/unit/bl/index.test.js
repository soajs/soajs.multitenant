
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/index.js');


describe("Unit test for: BLs", () => {

    let soajs = {
        config: {
            "errors": {
                400: "Business logic required data are missing",
                450: "Unable to find tenant",
                451: "Tenant already exists",
                452: "Main Tenant id is required!",
                453: "Main Tenant is not found!",
                454: "Unable to add tenant application",
                455: "Unable to add a new key to the tenant application",
                456: "Unable to add the tenant application ext Key",
                457: "Unable to find application",

                460: "Unable to find product",
                461: "Unable to find package",
                462: "You are not allowed to remove the tenant you are currently logged in with",
                463: "Invalid product code or package code provided",

                466: "You are not allowed to remove the product you are currently logged in with",
                467: "Package already exists",
                468: "Product already exists",

                470: "Unable to update product",
                471: "Unable to update tenant",
                472: "Unable to get the tenant application",
                473: "Unable to get the tenant application key",
                500: "You cannot modify or delete a locked record",
                501: "Environment record not found!",

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
            BL.init(soajs, soajs.config, () => {
                done();
            });
        });
    });

});
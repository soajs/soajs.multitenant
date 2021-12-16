
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
let deleteProductSchema = require("../schemas/deleteProduct.js");

describe("Testing delete product API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let prods = [];

    it("Success - will delete - code", (done) => {
        let params = {
            qs: {
                code: 'SOMEC'
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            let check = validator.validate(body, deleteProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
	
	it("Success - will delete console- code", (done) => {
		let params = {
			qs: {
				code: 'lucky'
			}
		};
		requester('/product/console/', 'delete', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			let check = validator.validate(body, deleteProductSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

    it("Fails - will not delete - invalid", (done) => {
        let params = {
            qs: {
                code: true
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            let check = validator.validate(body, deleteProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    let selectedProd;
    it("Success - will return all product records", (done) => {
        let params = {};
        requester('/products', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            prods = body.data;
            prods.forEach(prod => {
                if(prod.code === 'TPROD') {
                    selectedProd = prod;
                }
            });
            assert.ok(body.data.length > 0);
            done();
        });
    });

    it("Success - will delete - id", (done) => {

        let params = {
            qs: {
                id: selectedProd._id
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.strictEqual(body.data.acknowledged, true);
            let check = validator.validate(body, deleteProductSchema);
            assert.strictEqual(check.valid, true);
            assert.deepStrictEqual(check.errors, []);
            done();
        });
        
    });
	it("Success - will not return deleted product record", (done) => {
		let params = {
			qs: {
				id: selectedProd._id
			}
		};
		requester('/product', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.deepEqual(body, {
				"result": false,
				"errors": {
					"codes": [
						460
					],
					"details": [
						{
							"code": 460,
							"message": "Unable to find product"
						}
					]
				}
			});
			done();
		});
	});
    it("Fails - will not delete - prod not found", (done) => {
        let params = {
            qs: {
                id: "5512867be603d7e01ab1666d"
            },
            body: {
                name: "NOTANAME"
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors);
            assert.deepEqual(body.errors.codes[0], 460);
            let check = validator.validate(body, deleteProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();

        });
    });

    it("Fail - will not delete - no params", (done) => {
        let params = {};
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, deleteProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});

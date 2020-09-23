
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
let listProductsSchema = require("../schemas/listProducts.js");

describe("Testing Update Package API", () => {

before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let prods = [];
    let selectedProd;
    it("Success - will return all product records", (done) => {
        let params = {};
        requester('/products', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            prods = body.data;
            prods.forEach(prod => {
                if(prod.code === 'TEST2') {
                    selectedProd = prod;
                }
            });
            assert.ok(body.data.length > 0);
            assert.equal(selectedProd.packages.length, 3);
            let check = validator.validate(body, listProductsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
	it("Success - will update product package", (done) => {
		let params = {
			qs: {
				id: selectedProd._id,
				env: "dev",
				code: "TEST2_NEWS",
			},
			body: {
				acl: {}
			}
		};
		requester('/product/package/acl/env', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	
	it("Success - will update product package console", (done) => {
		let params = {
			qs: {
				id: "5512867be603d7e01ab1688d",
				env: "dev",
				code: "DSBRD_ELAS",
			},
			body: {
				acl: {}
			}
		};
		requester('/product/console/package/acl/env', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});

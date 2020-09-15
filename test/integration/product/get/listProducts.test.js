
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

describe("Testing list products API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return all product records", (done) => {
        let params = {};
        requester('/products', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
	        let nonConsole = true;
	        body.data.forEach((prod)=>{
		        if (prod.console){
			        nonConsole = prod.console;
		        }
	        });
	        assert.ok(nonConsole);
            let check = validator.validate(body, listProductsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});


describe("Testing list console products API", () => {
    it("Success - will return all console product records", (done) => {
        let params = {};
        requester('/products/console', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.ok(body.data.length > 0);
            let console = true;
            body.data.forEach((prod)=>{
            	if (!prod.console){
		            console = !prod.console;
	            }
            });
            assert.ok(console);
            let check = validator.validate(body, listProductsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});


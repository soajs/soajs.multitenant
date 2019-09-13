"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let purgeProductSchema = require("../schemas/purgeProduct.js");
let getProductSchema = require("../schemas/getProduct.js");

describe("Testing purge product API", () => {

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
                if(prod.code === 'TPROD') {
                    selectedProd = prod;
                }
            });
            assert.ok(body.data.length > 0);
            done();
        });
    });
    it("Success - will purge product", (done) => {
        let params = {
            qs: {
                id: selectedProd._id,
            }
        };
        requester('/product/purge', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            let check = validator.validate(body, purgeProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            assert.deepEqual(body.data, true);
            done();
        });
    });
    
	it("Success - will get purged product", (done) => {
		let params = {
			qs: {
				id: selectedProd._id,
			}
		};
		requester('/product/', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.deepEqual(body.data.scope, {acl :{}})
			body.data.packages.forEach((pack)=>{
				assert.deepEqual(pack.acl, {});
			});
			let check = validator.validate(body, getProductSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

    it("Fails - will not purge product - invalid id", (done) => {
        let params = {
            qs: {
                id: "invalidID",
            }
        };
        requester('/product/purge', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors);
            let check = validator.validate(body, purgeProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not purge product - no params", (done) => {
        let params = {};
        requester('/product/purge', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, purgeProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
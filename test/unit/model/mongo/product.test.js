"use strict";

const coreModules = require("soajs.core.modules");
const helper = require("../../../helper.js");
const product = helper.requireModule('model/mongo/product.js');
const assert = require('assert');

describe("Unit test for: BL - product", () => {
	let model;
	let service = {
		config: {
			"errors": {},
		},
		log: {
			error: () => { console.log() },
			debug: () => { console.log() }
		},
		registry : {
			get : ()=>{
				return {
					coreDB: {
						provision : {
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
				}
			}
		}
	};
	
	describe("Testing product no instance", () => {
		before((done) => {
			model = new product(service);
			done();
		});
		
		afterEach((done) => {
			done();
		});
		it("Success - listProducts", (done) => {
			model.listProducts(null, ()=>{
				done();
			});
		});
		
		it("Success - closeConnection", (done) => {
			model.closeConnection();
			done();
		});
	});
	
	describe("Testing product with db config", () => {
		before((done) => {
			model = new product(service, {
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
		it("Success - listProducts", (done) => {
			model.listProducts(null, ()=>{
				done();
			});
		});
		
		it("Success - closeConnection", (done) => {
			model.closeConnection();
			done();
		});
	});
	
	describe("Testing product with instance", () => {
		it("Success", (done) => {
			model = new product(service, null, true);
			done();
		});
	});
});
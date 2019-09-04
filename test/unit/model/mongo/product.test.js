"use strict";

const coreModules = require("soajs.core.modules");
const helper = require("../../../helper.js");
const Product = helper.requireModule('model/mongo/product.js');
const assert = require('assert');

describe("Unit test for: Model - product", () => {
	let model;
	let service = {
		config: {
			"errors": {},
			"console": {
				"product": "DSBRD"
			},
		},
		log: {
			error: () => { console.log(); },
			debug: () => { console.log(); }
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
				};
			}
		}
	};
	
	describe("Testing product no instance", () => {
		before((done) => {
			model = new Product(service);
			done();
		});
		
		afterEach((done) => {
			done();
		});

		it("Success - validateId", (done) => {
			model.validateId({id: ''}, () =>{
				done();
			});
		});

		it("Success - listProducts", (done) => {
			model.listProducts(service.config, () =>{
				done();
			});
		});

		it("Success - listConsoleProducts", (done) => {
			model.listConsoleProducts(service.config, () =>{
				done();
			});
		});

		it("Success - getProduct code", (done) => {
			model.getProduct({code: 'DSBRD'}, () =>{
				done();
			});
		});

		it("Success - getProduct id", (done) => {
			model.getProduct({id: ''}, () =>{
				done();
			});
		});

		it("Success - getProduct id", (done) => {
			model.addProduct({}, () =>{
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
			model = new Product(service, {
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

		it("Success - validateId", (done) => {
			model.validateId({id: ''}, () =>{
				done();
			});
		});

		it("Success - listProducts", (done) => {
			model.listProducts(service.config, () =>{
				done();
			});
		});

		it("Success - listConsoleProducts", (done) => {
			model.listConsoleProducts(service.config, () =>{
				done();
			});
		});

		it("Success - getProduct code", (done) => {
			model.getProduct({code: 'DSBRD'}, () =>{
				done();
			});
		});

		it("Success - getProduct id", (done) => {
			model.getProduct({id: ''}, () =>{
				done();
			});
		});

		it("Success - getProduct id", (done) => {
			model.addProduct({}, () =>{
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
			model = new Product(service, null, true);
			done();
		});
	});
});
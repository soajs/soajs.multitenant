"use strict";

const coreModules = require("soajs.core.modules");
const helper = require("../../../helper.js");
const tenant = helper.requireModule('model/mongo/tenant.js');
const assert = require('assert');

describe("Unit test for: BL - tenant", () => {
	let model;
	let service = {
		config: {
			"errors": {
			},
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
	
	describe("Testing tenant no instance", () => {
		before((done) => {
			model = new tenant(service);
			done();
		});
		
		afterEach((done) => {
			done();
		});
		it("Success - list Tenants", (done) => {
			model.listTenants(null, ()=>{
				done();
			});
		});
		
		it("Success - closeConnection", (done) => {
			model.closeConnection();
			done();
		});
	});
	
	describe("Testing tenant with db config", () => {
		before((done) => {
			model = new tenant(service, {
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
		it("Success - list Tenants", (done) => {
			model.listTenants(null, ()=>{
				done();
			});
		});
		
		it("Success - closeConnection", (done) => {
			model.closeConnection();
			done();
		});
	});
	
	describe("Testing tenant with instance", () => {
		it("Success", (done) => {
			model = new tenant(service, null, true);
			done();
		});
	});
});
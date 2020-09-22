/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/product.js');
const assert = require('assert');
const nock = require('nock');

describe("Unit test for: BL - product", () => {
	
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
				
				460: "Unable to find product",
				461: "Unable to find package",
				462: "You are not allowed to remove the tenant you are currently logged in with",
				466: "You are not allowed to remove the product you are currently logged in with",
				467: "Package already exists",
				468: "Product already exists",
				
				470: "Unable to update product",
				471: "Unable to update tenant",
				
				500: "You cannot modify or delete a locked record",
				501: "Environment record not found!",
				
				601: "Model not found",
				602: "Model error: ",
			},
			"console": {
				"product": "DSBRD"
			},
		},
		tenant: {
			application: {
				product: "TPROD",
				package: "TPROD_TEST",
			}
		},
		log: {
			error: () => {
				console.log();
			},
			debug: () => {
				console.log();
			}
		},
		awareness: {
			connect: (service, version, cb) => {
				return cb({
					headers: {},
					host: "www.example.com"
				});
			}
		}
	};
	
	describe("Testing list Products", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - List products - null data", (done) => {
			BL.modelObj = {
				listProducts: (nullObject, cb) => {
					return cb(null, []);
				}
			};
			BL.list(soajs, null, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Fails - List products - null data", (done) => {
			BL.modelObj = {
				listProducts: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.list(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Success - List products - null data - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.listProducts = (nullObject, cb) => {
				return cb(null, []);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.list(soajsClient, null, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Fails - List products - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: ",
						
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.listProducts = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.list(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing list console Products", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - List console products - null data", (done) => {
			BL.modelObj = {
				listConsoleProducts: (nullObject, cb) => {
					return cb(null, []);
				}
			};
			BL.listConsole(soajs, null, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Fails - List console products - null data", (done) => {
			BL.modelObj = {
				listConsoleProducts: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.listConsole(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Success - List console products - null data - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.listConsoleProducts = (data, cb) => {
				return cb(null, []);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.listConsole(soajsClient, null, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Fails - List console products - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.listConsoleProducts = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.listConsole(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing Get product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - Get product - code", (done) => {
			let inputMask = {
				code: "DSBRT"
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "DSBRT",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			BL.get(soajs, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "not Console UI Product");
				done();
			});
		});
		
		it("Success - Get product - id", (done) => {
			let inputMask = {
				id: "testid"
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"_id": "testid",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			BL.get(soajs, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "not Console UI Product");
				done();
			});
		});
		
		it("Fails - Get product - null data", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.get(soajs, null, (err) => {
				assert.ok(err);
				assert.equal(err.code, 400);
				done();
			});
		});
		
		it("Success - Get product - code - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: ",
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(null, {
					"code": "DSBRT",
					"name": "not Console UI Product",
					"description": "This is the main Console UI Product.",
				});
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			let inputMask = {
				code: "DSBRT"
			};
			
			BL.get(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "not Console UI Product");
				done();
			});
		});
		
		it("Success - Get product - id - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"_id": "testid",
					"name": "Console UI Product",
					"description": "This is the main Console UI Product.",
				});
			};
			
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			let inputMask = {
				id: "testid"
			};
			
			BL.get(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Console UI Product");
				done();
			});
		});
		
		it("Fail - Get product - null data - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.get(soajsClient, null, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 400);
				done();
			});
		});
		
		it("Fail - Get product - null record - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(null, null);
			};
			Product.prototype.closeConnection = () => {
			};
			
			BL.model = Product;
			
			BL.get(soajsClient, {id: "notfound"}, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 460);
				done();
			});
		});
		
		it("Fail - Get product - mongo error when getting product", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			
			BL.model = Product;
			
			BL.get(soajsClient, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing Add Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - Add product - data with no scope", (done) => {
			let inputMask = {
				code: "TESTP",
				name: "Test Product",
				description: 'Some Test Description'
			};
			
			BL.modelObj = {
				addProduct: (inputMask, cb) => {
					return cb(null, true);
				},
				checkIfExist: (inputMask, cb) => {
					return cb(null, 0);
				}
			};
			BL.add(soajs, inputMask, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("Success - Add product - data with scope", (done) => {
			let inputMask = {
				code: "TESTP2",
				name: "Test 2 Product",
				description: 'Some Test Description',
				scope: {
					acl: {
						dashboard: {
							multitenant: {
								1: {
									access: false,
									get: [
										{
											"/product": {
												access: false
											},
											group: 'Product'
										}
									]
								}
							}
						}
					}
				}
			};
			
			BL.modelObj = {
				addProduct: (inputMask, cb) => {
					return cb(null, true);
				},
				checkIfExist: (inputMask, cb) => {
					return cb(null, 0);
				}
			};
			BL.add(soajs, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record, true);
				done();
			});
		});
		
		it("Fails - Add product - Product Already Exist", (done) => {
			let inputMask = {
				code: 'DSBRT',
				name: 'not Main Product',
				description: 'Some Test Description'
			};
			
			BL.modelObj = {
				addProduct: (inputMask, cb) => {
					return cb(null, true);
				},
				checkIfExist: (inputMask, cb) => {
					return cb(null, 1);
				}
			};
			BL.add(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 468);
				done();
			});
		});
		
		it("Fails - Add product - Product Already Exist - client tenant", (done) => {
			let inputMask = {
				code: 'DSBRT',
				name: 'not Main Product',
			};
			let soajsClient = {
				config: {
					"errors": {
						468: "Product already exists",
						460: "Unable to find product",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.addProduct = (data, cb) => {
				return cb(null, true);
			};
			Product.prototype.checkIfExist = (data, cb) => {
				return cb(null, 1);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.add(soajsClient, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 468);
				done();
			});
		});
		
		it("Fails - Add product - mongo error check if exists - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			let inputMask = {
				code: 'DSBRT',
				name: 'not Main Product',
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.addProduct = (data, cb) => {
				return cb(null, true);
			};
			Product.prototype.checkIfExist = (data, cb) => {
				return cb(true);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.add(soajsClient, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - Add product - mongo error when adding product - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			let inputMask = {
				code: 'DSBRT',
				name: 'not Main Product',
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.addProduct = (data, cb) => {
				return cb(true);
			};
			Product.prototype.checkIfExist = (data, cb) => {
				return cb(null, 0);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.add(soajsClient, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - Add product - null Data", (done) => {
			BL.modelObj = {
				addProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				checkIfExist: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.add(soajs, null, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 400);
				done();
			});
		});
		
		it("Success - Add product - code - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						474: "Missing required field: either id or code",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.addProduct = (data, cb) => {
				return cb(null, true);
			};
			Product.prototype.checkIfExist = (data, cb) => {
				return cb(null, 0);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			let inputMask = {
				code: "TESTR",
				name: "Test 2 Product"
			};
			
			BL.add(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				done();
			});
		});
	});
	
	describe("Testing Update Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - update product - id", (done) => {
			let inputMask = {
				_id: "SOMEID",
				name: "Some Name",
				description: "A desc to update product",
				scope: {}
			};
			
			BL.modelObj = {
				updateProduct: (inputMask, cb) => {
					return cb(null, true);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"_id": "SOMEID",
						"name": "Some Product",
						"description": "This is Some Product.",
					});
				}
			};
			BL.update(soajs, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record, true);
				done();
			});
		});
		
		it("Fails - Update product - get product error", (done) => {
			let inputMask = {};
			
			BL.modelObj = {
				updateProduct: (inputMask, cb) => {
					return cb(null, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.update(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - Update product - null Data", (done) => {
			BL.modelObj = {
				updateProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				checkIfExist: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.update(soajs, null, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 400);
				done();
			});
		});
		
		it("Fails - Update product - update error", (done) => {
			BL.modelObj = {
				getProduct: (inputmask, cb) => {
					return cb(null, {});
				},
				updateProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				checkIfExist: (inputMask, cb) => {
					return cb(null, 0);
				}
			};
			BL.update(soajs, null, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 400);
				done();
			});
		});
		
		it("Fails - Update product - no record", (done) => {
			BL.modelObj = {
				getProduct: (inputmask, cb) => {
					return cb(null, null);
				},
				updateProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.update(soajs, {}, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - Update product - locked", (done) => {
			BL.modelObj = {
				getProduct: (inputmask, cb) => {
					return cb(null, {
						locked: true,
						console: true
					});
				},
				updateProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.update(soajs, {}, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - Update product - update error", (done) => {
			BL.modelObj = {
				getProduct: (inputmask, cb) => {
					return cb(null, {
						locked: false,
						console: false
					});
				},
				updateProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.update(soajs, {}, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 470,
					msg: soajs.config.errors[470]
				});
				done();
			});
		});
		
	});
	
	describe("Testing purge Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		let inputMask = {
			id: "SomeProductID",
			description: "Pack Description after update",
		};
		
		it("Success - purge product - data", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				saveProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.purge(soajs, inputMask, (err, result) => {
				assert.ok(result);
				done();
			});
		});
		
		it("Success - purge product  - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"code": "TPROD",
					"name": "Test Product",
					"description": "this is a description for test product",
					"packages": [
						{
							"code": "TPROD_BASIC",
							"name": "basic package",
							"description": "this is a description for test product basic package",
							"acl": {
								"urac": {},
								"multitenant": {}
							},
							"_TTL": 86400000 // 24 hours
						}
					]
				});
			};
			
			Product.prototype.saveProduct = (data, cb) => {
				return cb(null, true);
			};
			
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.purge(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("Fails - purge product - null data", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				},
				saveProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.purge(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajs.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - purge product - save product err", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, {
						packages: [
							{
								name: "totestonly"
							}
						]
					});
				},
				saveProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.purge(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602
				);
				done();
			});
		});
		
		it("Fails - purge product - save product err", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.purge(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602
				);
				done();
			});
		});
		
		it("Fails - purge product - no record err", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, null);
				},
				saveProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.purge(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 460
				);
				done();
			});
		});
		
		it("Fails - purge product - locked record err", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, {
						locked: true
					});
				},
				saveProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.purge(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - purge product - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.saveProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.purge(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajsClient.config.errors[400]
				});
				done();
			});
		});
		
	});
	
	describe("Testing Update Scope Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		let inputMask = {
			id: "DummyID",
			scope: {
				acl: {
					dashboard: {
						multitenant: {
							1: {
								access: false,
								get: [
									{
										"/product": {
											access: false
										},
										group: 'Product'
									}
								]
							}
						}
					}
				}
			}
		};
		
		it("Fails - update product scope - null data", (done) => {
			BL.modelObj = {};
			BL.updateScope(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajs.config.errors[400]
				});
				done();
			});
		});
		
		it("Success - update product scope - data", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.updateScope(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepEqual(result, true);
				done();
			});
		});
		
		it("Fails - update product scope - getProduct error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.updateScope(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - update product scope - no record error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.updateScope(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - update product scope - locked record error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						locked: true,
						console: true
					});
				}
			};
			BL.updateScope(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - update product scope - updateProduct error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.updateScope(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 470,
					msg: soajs.config.errors[470]
				});
				done();
			});
		});
		
	});
	
	describe("Testing Update Scope Product by env", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		let inputMask = {
			id: "DummyID",
			env: "dashboard",
			acl: {
				multitenant: {
					1: {
						access: false,
						get: [
							{
								"/product": {
									access: false
								},
								group: 'Product'
							}
						]
					}
				}
			}
		};
		
		it("Fails - update product scope - null data", (done) => {
			BL.modelObj = {};
			BL.updateScopeByEnv(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajs.config.errors[400]
				});
				done();
			});
		});
		
		it("Success - update product scope - data", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateScope: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.updateScopeByEnv(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepEqual(result, true);
				done();
			});
		});
		
		it("Fails - update product scope - getProduct error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.updateScopeByEnv(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - update product scope - no record error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.updateScopeByEnv(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - update product scope - locked record error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						locked: true,
						console: true
					});
				}
			};
			BL.updateScopeByEnv(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - update product scope - updateProduct error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateScope: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.updateScopeByEnv(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 470,
					msg: soajs.config.errors[470]
				});
				done();
			});
		});
		
	});
	
	describe("Testing Delete Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - Delete product - code", (done) => {
			let inputMask = {
				code: "TESTP",
			};
			
			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(null, true);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"name": "Some Product",
						"description": "This is Some Product.",
					});
				}
			};
			BL.delete(soajs, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record, true);
				done();
			});
		});
		
		it("Fails - Delete product - valid id", (done) => {
			let inputMask = {
				id: "someID",
			};
			
			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.delete(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - Delete product - valid id no record", (done) => {
			let inputMask = {
				id: "someID",
			};
			
			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.delete(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - Delete product - null Data", (done) => {
			BL.modelObj = {
				addProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				checkIfExist: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.delete(soajs, null, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 400,
					msg: soajs.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - Delete product - code no record", (done) => {
			let inputMask = {
				code: "someCode",
			};
			
			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.delete(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		let soajs2 = {
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
					
					460: "Unable to find product",
					461: "Unable to find package",
					462: "You are not allowed to remove the tenant you are currently logged in with",
					466: "You are not allowed to remove the product you are currently logged in with",
					467: "Package already exists",
					468: "Product already exists",
					
					470: "Unable to update product",
					471: "Unable to update tenant",
					
					500: "You cannot modify or delete a locked record",
					501: "Environment record not found!",
					
					601: "Model not found",
					602: "Model error: ",
				},
				"console": {
					"product": "DSBRD"
				},
			},
			tenant: {
				application: {
					product: "DSBRD",
					package: "DSBRD_TEST",
				}
			},
			log: {
				error: () => {
					console.log();
				},
				debug: () => {
					console.log();
				},
			}
		};
		
		it("Fails - Delete product - Tenant product", (done) => {
			let inputMask = {
				code: "DSBRD",
			};
			
			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, {
						code: "DSBRD"
					});
				}
			};
			BL.delete(soajs2, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 466,
					msg: soajs.config.errors[466]
				});
				done();
			});
		});
		
		it("Fails - Delete product - locked record", (done) => {
			let inputMask = {
				code: "someCode",
			};
			
			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, {
						locked: true,
						console: true
					});
				}
			};
			BL.delete(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - Delete product - not valid id", (done) => {
			let inputMask = {
				id: "NOTVALID",
			};
			
			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.delete(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - Delete product - no code and id", (done) => {
			let inputMask = {};
			
			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.delete(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - Delete product - delete product error", (done) => {
			let inputMask = {
				code: 'some'
			};
			
			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, {});
				}
			};
			BL.delete(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
	});
	
	describe("Testing list all packages inside Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		let inputMask = {
			id: "ID"
		};
		
		let inputMaskTwo = {
			code: "SOME"
		};
		
		it("Success - List packages - id", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				}
			};
			BL.getPackages(soajs, inputMask, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Success - List packages - code", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				}
			};
			BL.getPackages(soajs, inputMaskTwo, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Success - List packages  - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						423: "An id must be provided",
						460: "Unable to find product",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			let inputMask = {
				id: "ID"
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"code": "TPROD",
					"name": "Test Product",
					"description": "this is a description for test product",
					"packages": [
						{
							"code": "TPROD_BASIC",
							"name": "basic package",
							"description": "this is a description for test product basic package",
							"acl": {
								"urac": {},
								"multitenant": {}
							},
							"_TTL": 86400000 // 24 hours
						},
						{
							"code": "TPROD_EXAMPLE03",
							"name": "example03 package",
							"description": "this is a description for test product example03 package",
							"acl": {
								"urac": {},
								"example03": {}
							},
							"_TTL": 86400000 // 24 hours
						}
					]
				});
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.getPackages(soajsClient, inputMask, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Fails - List packages - null data", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.getPackages(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 400);
				done();
			});
		});
		
		it("Fails - List packages - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						423: "An id must be provided",
						460: "Unable to find product",
						473: "Missing required fields",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.getPackages(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 400);
				done();
			});
		});
		
		it("Fails - List packages - getProduct err", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.getPackages(soajs, inputMask, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - List packages - no record", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.getPackages(soajs, inputMask, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
	});
	
	describe("Testing get package inside Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		let inputMask = {
			packageCode: "TPROD_BASIC",
			code: "TPROD",
		};
		
		it("Success - get package - null data", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				}
			};
			BL.getPackage(soajs, inputMask, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("Success - get package  - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"code": "TPROD",
					"name": "Test Product",
					"description": "this is a description for test product",
					"packages": [
						{
							"code": "TPROD_BASIC",
							"name": "basic package",
							"description": "this is a description for test product basic package",
							"acl": {
								"urac": {},
								"multitenant": {}
							},
							"_TTL": 86400000 // 24 hours
						},
						{
							"code": "TPROD_EXAMPLE03",
							"name": "example03 package",
							"description": "this is a description for test product example03 package",
							"acl": {
								"urac": {},
								"example03": {}
							},
							"_TTL": 86400000 // 24 hours
						}
					]
				});
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.getPackage(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("Fails - get package - null data", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.getPackage(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 400);
				done();
			});
		});
		
		it("Fails - get package - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing",
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.getPackage(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 400);
				done();
			});
		});
		
		it("Fails - get package - getProduct err", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.getPackage(soajs, inputMask, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - get package - no record", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.getPackage(soajs, inputMask, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fails - get package - package not found", (done) => {
			let inputMask = {
				packageCode: "TPROD_NOT_FOUND",
				code: "TPROD",
			};
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				}
			};
			BL.getPackage(soajs, inputMask, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
	});
	
	describe("Testing add package inside Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		let inputMask = {
			"code": "NEW",
			"id": "SomeProductID",
			"name": "PACK_NAME2",
			"description": "Pack Description new",
			"_TTL": 12,
			"tags": [
				"some", "to", "test"
			]
		};
		
		it("Success - add package - data", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.addPackage(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepEqual(result, "TPROD_NEW");
				done();
			});
		});
		
		it("Success - add package - data - no packages in record", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product"
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.addPackage(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepEqual(result, "TPROD_NEW");
				done();
			});
		});
		
		it("Success - add package  - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"code": "TPROD",
					"name": "Test Product",
					"description": "this is a description for test product",
					"packages": [
						{
							"code": "TPROD_BASIC",
							"name": "basic package",
							"description": "this is a description for test product basic package",
							"acl": {
								"urac": {},
								"multitenant": {}
							},
							"_TTL": 86400000 // 24 hours
						},
						{
							"code": "TPROD_EXAMPLE03",
							"name": "example03 package",
							"description": "this is a description for test product example03 package",
							"acl": {
								"urac": {},
								"example03": {}
							},
							"_TTL": 86400000 // 24 hours
						}
					]
				});
			};
			
			Product.prototype.updateProduct = (data, cb) => {
				return cb(null, true);
			};
			
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.addPackage(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record, "TPROD_NEW");
				done();
			});
		});
		
		it("Fails - add package - null data", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				},
				updateProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.addPackage(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajs.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - add package - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.updateProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.addPackage(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajsClient.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - add package - getProduct error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.addPackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - add package - no record error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.addPackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - add package - locked record error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, {
						locked: true,
						console: true
					});
				}
			};
			BL.addPackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - add package - data - package found", (done) => {
			let inputmaskData = {
				"code": "BASIC",
				"id": "SomeProductID",
				"name": "PACK_NAME2",
				"description": "Pack Description new",
				"_TTL": 12,
				"tags": [
					"some", "to", "test"
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.addPackage(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 467,
					msg: soajs.config.errors[467]
				});
				done();
			});
		});
		
		it("Fails - add package - updateProduct error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.addPackage(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
	});
	
	describe("Testing Get product ACL Scope", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - Get product scope - empty", (done) => {
			let inputMask = {
				code: "DSBRT"
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "DSBRT",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			BL.getAclScope(soajs, inputMask, (err, scope) => {
				assert.ok(scope);
				assert.deepEqual(scope, {});
				done();
			});
		});
		
		it("Success - Get product scope", (done) => {
			let inputMask = {
				code: "DSBRT"
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "DSBRT",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dev": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						}
					});
				}
			};
			BL.getAclScope(soajs, inputMask, (err, scope) => {
				assert.ok(scope);
				assert.deepEqual(scope, {
					"acl": {
						"dev": {
							"urac": {
								"3": {
									"access": true,
									"apisPermission": "restricted",
									"get": [
										{
											"group": "My account guest",
											"apis": {
												"/password/forgot": {
													"access": false
												},
												"/emailToken": {
													"access": true
												},
												"/validate/changeEmail": {
													"access": true
												}
											}
										}
									]
								}
							}
						}
					}
				});
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			BL.getAclScope(soajsClient, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(false, null);
			};
			Product.prototype.closeConnection = () => {
			};
			
			BL.model = Product;
			
			BL.getAclScope(soajsClient, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 460);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			
			BL.model = Product;
			
			BL.getAclScope(soajsClient, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing Get product Package ACL Scope", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - Get product scope - empty", (done) => {
			let inputMask = {
				id: "123",
				package: "TPROD_BASIC"
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"_id": "123",
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				}
			};
			BL.getPackageAclScope(soajs, inputMask, (err, scope) => {
				assert.ok(scope);
				assert.deepEqual(scope, {});
				done();
			});
		});
		
		it("Success - Get product scope", (done) => {
			let inputMask = {
				id: "123",
				package: "TPROD_EXAMPLE03"
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"_id": "123",
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				}
			};
			BL.getPackageAclScope(soajs, inputMask, (err, scope) => {
				assert.ok(scope);
				assert.deepEqual(scope, {
					"urac": {},
					"example03": {}
				});
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			BL.getPackageAclScope(soajsClient, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(false, null);
			};
			Product.prototype.closeConnection = () => {
			};
			
			BL.model = Product;
			
			BL.getPackageAclScope(soajsClient, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 461);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			
			BL.model = Product;
			
			BL.getPackageAclScope(soajsClient, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no package", (done) => {
			let inputMask = {
				id: "123",
				package: "TPROD_BASICS"
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(null, {
					"_id": "123",
					"code": "TPROD",
					"name": "Test Product",
					"description": "this is a description for test product",
					"packages": [
						{
							"code": "TPROD_BASIC",
							"name": "basic package",
							"description": "this is a description for test product basic package",
							"_TTL": 86400000 // 24 hours
						},
						{
							"code": "TPROD_EXAMPLE03",
							"name": "example03 package",
							"description": "this is a description for test product example03 package",
							"acl": {
								"urac": {},
								"example03": {}
							},
							"_TTL": 86400000 // 24 hours
						}
					]
				});
			};
			Product.prototype.closeConnection = () => {
			};
			
			BL.model = Product;
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					}
				}
			};
			BL.getPackageAclScope(soajsClient, inputMask, (err) => {
				assert.deepEqual(err.code, 461);
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing Get product ACL Scope UI", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			nock.cleanAll();
			done();
		});
		
		it("Success - Get product scope - empty", (done) => {
			let inputMask = {
				id: '5f575ec295bb89628f3221d1',
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			
			BL.getUIProductAcl(soajs, inputMask, (err, scope) => {
				assert.ok(scope);
				assert.deepEqual(scope, {
					"aclFill": {},
					"serviceGroup": [
						"Gateway"
					],
					"allServiceApis": {
						"Gateway": [
							{
								"type": "service",
								"name": "urac",
								"group": "Gateway",
								"versions": [
									{
										"version": "3",
										"apis": [
											{
												"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
												"v": "/password/forgot",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate user account after joining",
												"v": "/validate/join",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if a username as (username or email) is available or taken",
												"v": "/checkUsername",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
												"v": "/emailToken",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate change email",
												"v": "/validate/changeEmail",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "Get user account information by username as (username or email)",
												"v": "/user",
												"m": "get",
												"group": "My account",
												"groupMain": true
											},
											{
												"l": "Get user by id",
												"v": "/admin/user",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List users matching certain keywords",
												"v": "/admin/users",
												"m": "get",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Get users count matching certain keywords",
												"v": "/admin/users/count",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List all groups",
												"v": "/admin/groups",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get group by id or code",
												"v": "/admin/group",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get all users and groups of a main tenant",
												"v": "/admin/all",
												"m": "get",
												"group": "Administration"
											},
											{
												"l": "Send custom email",
												"v": "/email",
												"m": "post",
												"group": "Custom email"
											},
											{
												"l": "Join and create an account",
												"v": "/join",
												"m": "post",
												"group": "Guest join"
											},
											{
												"l": "Add user",
												"v": "/admin/user",
												"m": "post",
												"group": "User administration"
											},
											{
												"l": "List users by Id",
												"v": "/admin/users/ids",
												"m": "post",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Add group",
												"v": "/admin/group",
												"m": "post",
												"group": "Group administration"
											},
											{
												"l": "Delete group",
												"v": "/admin/group",
												"m": "delete",
												"group": "Group administration"
											},
											{
												"l": "Delete user",
												"v": "/admin/user",
												"m": "delete",
												"group": "User administration"
											},
											{
												"l": "Reset password",
												"v": "/password/reset",
												"m": "put",
												"group": "My account guest"
											},
											{
												"l": "Change account's password by id",
												"v": "/account/password",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Change account's email by id",
												"v": "/account/email",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit account's information by id",
												"v": "/account",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit user by id",
												"v": "/admin/user",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit user's groups by id, username, or email",
												"v": "/admin/user/groups",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit, reset, or delete user's pin information by id, username, or email",
												"v": "/admin/user/pin",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Change the status of a user by id",
												"v": "/admin/user/status",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit group by id",
												"v": "/admin/group",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update environment(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/environments",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update package(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/packages",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Self Invite user by id or username as username or email",
												"v": "/admin/user/self/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Invite users by id, username or email",
												"v": "/admin/users/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "un-Invite users by id, username or email",
												"v": "/admin/users/uninvite",
												"m": "put",
												"group": "User administration"
											}
										]
									}
								],
								"fixList": [
									{
										"My account guest": {
											"apis": [
												{
													"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
													"v": "/password/forgot",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
													"v": "/emailToken",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "To validate change email",
													"v": "/validate/changeEmail",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Reset password",
													"v": "/password/reset",
													"m": "put",
													"group": "My account guest"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
														"v": "/password/forgot",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
														"v": "/emailToken",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "To validate change email",
														"v": "/validate/changeEmail",
														"m": "get",
														"group": "My account guest"
													}
												],
												"put": [
													{
														"l": "Reset password",
														"v": "/password/reset",
														"m": "put",
														"group": "My account guest"
													}
												]
											}
										},
										"Guest join": {
											"apis": [
												{
													"l": "To validate user account after joining",
													"v": "/validate/join",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Check if a username as (username or email) is available or taken",
													"v": "/checkUsername",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Join and create an account",
													"v": "/join",
													"m": "post",
													"group": "Guest join"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "To validate user account after joining",
														"v": "/validate/join",
														"m": "get",
														"group": "Guest join"
													},
													{
														"l": "Check if a username as (username or email) is available or taken",
														"v": "/checkUsername",
														"m": "get",
														"group": "Guest join"
													}
												],
												"post": [
													{
														"l": "Join and create an account",
														"v": "/join",
														"m": "post",
														"group": "Guest join"
													}
												]
											}
										},
										"My account": {
											"apis": [
												{
													"l": "Get user account information by username as (username or email)",
													"v": "/user",
													"m": "get",
													"group": "My account",
													"groupMain": true
												},
												{
													"l": "Change account's password by id",
													"v": "/account/password",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Change account's email by id",
													"v": "/account/email",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Edit account's information by id",
													"v": "/account",
													"m": "put",
													"group": "My account"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user account information by username as (username or email)",
														"v": "/user",
														"m": "get",
														"group": "My account",
														"groupMain": true
													}
												],
												"put": [
													{
														"l": "Change account's password by id",
														"v": "/account/password",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Change account's email by id",
														"v": "/account/email",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Edit account's information by id",
														"v": "/account",
														"m": "put",
														"group": "My account"
													}
												]
											}
										},
										"User administration": {
											"apis": [
												{
													"l": "Get user by id",
													"v": "/admin/user",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "List users matching certain keywords",
													"v": "/admin/users",
													"m": "get",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Get users count matching certain keywords",
													"v": "/admin/users/count",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "Add user",
													"v": "/admin/user",
													"m": "post",
													"group": "User administration"
												},
												{
													"l": "List users by Id",
													"v": "/admin/users/ids",
													"m": "post",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Delete user",
													"v": "/admin/user",
													"m": "delete",
													"group": "User administration"
												},
												{
													"l": "Edit user by id",
													"v": "/admin/user",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit user's groups by id, username, or email",
													"v": "/admin/user/groups",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit, reset, or delete user's pin information by id, username, or email",
													"v": "/admin/user/pin",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Change the status of a user by id",
													"v": "/admin/user/status",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Self Invite user by id or username as username or email",
													"v": "/admin/user/self/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Invite users by id, username or email",
													"v": "/admin/users/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "un-Invite users by id, username or email",
													"v": "/admin/users/uninvite",
													"m": "put",
													"group": "User administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user by id",
														"v": "/admin/user",
														"m": "get",
														"group": "User administration"
													},
													{
														"l": "List users matching certain keywords",
														"v": "/admin/users",
														"m": "get",
														"group": "User administration",
														"groupMain": true
													},
													{
														"l": "Get users count matching certain keywords",
														"v": "/admin/users/count",
														"m": "get",
														"group": "User administration"
													}
												],
												"post": [
													{
														"l": "Add user",
														"v": "/admin/user",
														"m": "post",
														"group": "User administration"
													},
													{
														"l": "List users by Id",
														"v": "/admin/users/ids",
														"m": "post",
														"group": "User administration",
														"groupMain": true
													}
												],
												"delete": [
													{
														"l": "Delete user",
														"v": "/admin/user",
														"m": "delete",
														"group": "User administration"
													}
												],
												"put": [
													{
														"l": "Edit user by id",
														"v": "/admin/user",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit user's groups by id, username, or email",
														"v": "/admin/user/groups",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit, reset, or delete user's pin information by id, username, or email",
														"v": "/admin/user/pin",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Change the status of a user by id",
														"v": "/admin/user/status",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Self Invite user by id or username as username or email",
														"v": "/admin/user/self/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Invite users by id, username or email",
														"v": "/admin/users/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "un-Invite users by id, username or email",
														"v": "/admin/users/uninvite",
														"m": "put",
														"group": "User administration"
													}
												]
											}
										},
										"Group administration": {
											"apis": [
												{
													"l": "List all groups",
													"v": "/admin/groups",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Get group by id or code",
													"v": "/admin/group",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Add group",
													"v": "/admin/group",
													"m": "post",
													"group": "Group administration"
												},
												{
													"l": "Delete group",
													"v": "/admin/group",
													"m": "delete",
													"group": "Group administration"
												},
												{
													"l": "Edit group by id",
													"v": "/admin/group",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update environment(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/environments",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update package(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/packages",
													"m": "put",
													"group": "Group administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "List all groups",
														"v": "/admin/groups",
														"m": "get",
														"group": "Group administration"
													},
													{
														"l": "Get group by id or code",
														"v": "/admin/group",
														"m": "get",
														"group": "Group administration"
													}
												],
												"post": [
													{
														"l": "Add group",
														"v": "/admin/group",
														"m": "post",
														"group": "Group administration"
													}
												],
												"delete": [
													{
														"l": "Delete group",
														"v": "/admin/group",
														"m": "delete",
														"group": "Group administration"
													}
												],
												"put": [
													{
														"l": "Edit group by id",
														"v": "/admin/group",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update environment(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/environments",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update package(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/packages",
														"m": "put",
														"group": "Group administration"
													}
												]
											}
										},
										"Administration": {
											"apis": [
												{
													"l": "Get all users and groups of a main tenant",
													"v": "/admin/all",
													"m": "get",
													"group": "Administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get all users and groups of a main tenant",
														"v": "/admin/all",
														"m": "get",
														"group": "Administration"
													}
												]
											}
										},
										"Custom email": {
											"apis": [
												{
													"l": "Send custom email",
													"v": "/email",
													"m": "post",
													"group": "Custom email"
												}
											],
											"apisRest": {
												"post": [
													{
														"l": "Send custom email",
														"v": "/email",
														"m": "post",
														"group": "Custom email"
													}
												]
											}
										},
										"%v%": "3",
										"%showApi%": false
									}
								]
							}
						]
					},
					"paginations": {
						"Gateway": {
							"currentPage": 1,
							"totalItems": 1
						}
					},
					"product": {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product."
					}
				});
				done();
			});
		});
		
		it("Success - Get product scope - empty soajs", (done) => {
			let inputMask = {
				id: '5f575ec295bb89628f3221d1',
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			
			BL.getUIProductAcl(soajs, inputMask, (err, scope) => {
				assert.ok(scope);
				assert.deepEqual(scope, {
					"aclFill": {},
					"serviceGroup": [
						"Gateway"
					],
					"allServiceApis": {
						"Gateway": [
							{
								"type": "service",
								"name": "urac",
								"group": "Gateway",
								"versions": [
									{
										"version": "3",
										"apis": [
											{
												"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
												"v": "/password/forgot",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate user account after joining",
												"v": "/validate/join",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if a username as (username or email) is available or taken",
												"v": "/checkUsername",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
												"v": "/emailToken",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate change email",
												"v": "/validate/changeEmail",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "Get user account information by username as (username or email)",
												"v": "/user",
												"m": "get",
												"group": "My account",
												"groupMain": true
											},
											{
												"l": "Get user by id",
												"v": "/admin/user",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List users matching certain keywords",
												"v": "/admin/users",
												"m": "get",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Get users count matching certain keywords",
												"v": "/admin/users/count",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List all groups",
												"v": "/admin/groups",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get group by id or code",
												"v": "/admin/group",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get all users and groups of a main tenant",
												"v": "/admin/all",
												"m": "get",
												"group": "Administration"
											},
											{
												"l": "Send custom email",
												"v": "/email",
												"m": "post",
												"group": "Custom email"
											},
											{
												"l": "Join and create an account",
												"v": "/join",
												"m": "post",
												"group": "Guest join"
											},
											{
												"l": "Add user",
												"v": "/admin/user",
												"m": "post",
												"group": "User administration"
											},
											{
												"l": "List users by Id",
												"v": "/admin/users/ids",
												"m": "post",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Add group",
												"v": "/admin/group",
												"m": "post",
												"group": "Group administration"
											},
											{
												"l": "Delete group",
												"v": "/admin/group",
												"m": "delete",
												"group": "Group administration"
											},
											{
												"l": "Delete user",
												"v": "/admin/user",
												"m": "delete",
												"group": "User administration"
											},
											{
												"l": "Reset password",
												"v": "/password/reset",
												"m": "put",
												"group": "My account guest"
											},
											{
												"l": "Change account's password by id",
												"v": "/account/password",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Change account's email by id",
												"v": "/account/email",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit account's information by id",
												"v": "/account",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit user by id",
												"v": "/admin/user",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit user's groups by id, username, or email",
												"v": "/admin/user/groups",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit, reset, or delete user's pin information by id, username, or email",
												"v": "/admin/user/pin",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Change the status of a user by id",
												"v": "/admin/user/status",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit group by id",
												"v": "/admin/group",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update environment(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/environments",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update package(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/packages",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Self Invite user by id or username as username or email",
												"v": "/admin/user/self/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Invite users by id, username or email",
												"v": "/admin/users/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "un-Invite users by id, username or email",
												"v": "/admin/users/uninvite",
												"m": "put",
												"group": "User administration"
											}
										]
									}
								],
								"fixList": [
									{
										"My account guest": {
											"apis": [
												{
													"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
													"v": "/password/forgot",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
													"v": "/emailToken",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "To validate change email",
													"v": "/validate/changeEmail",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Reset password",
													"v": "/password/reset",
													"m": "put",
													"group": "My account guest"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
														"v": "/password/forgot",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
														"v": "/emailToken",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "To validate change email",
														"v": "/validate/changeEmail",
														"m": "get",
														"group": "My account guest"
													}
												],
												"put": [
													{
														"l": "Reset password",
														"v": "/password/reset",
														"m": "put",
														"group": "My account guest"
													}
												]
											}
										},
										"Guest join": {
											"apis": [
												{
													"l": "To validate user account after joining",
													"v": "/validate/join",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Check if a username as (username or email) is available or taken",
													"v": "/checkUsername",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Join and create an account",
													"v": "/join",
													"m": "post",
													"group": "Guest join"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "To validate user account after joining",
														"v": "/validate/join",
														"m": "get",
														"group": "Guest join"
													},
													{
														"l": "Check if a username as (username or email) is available or taken",
														"v": "/checkUsername",
														"m": "get",
														"group": "Guest join"
													}
												],
												"post": [
													{
														"l": "Join and create an account",
														"v": "/join",
														"m": "post",
														"group": "Guest join"
													}
												]
											}
										},
										"My account": {
											"apis": [
												{
													"l": "Get user account information by username as (username or email)",
													"v": "/user",
													"m": "get",
													"group": "My account",
													"groupMain": true
												},
												{
													"l": "Change account's password by id",
													"v": "/account/password",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Change account's email by id",
													"v": "/account/email",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Edit account's information by id",
													"v": "/account",
													"m": "put",
													"group": "My account"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user account information by username as (username or email)",
														"v": "/user",
														"m": "get",
														"group": "My account",
														"groupMain": true
													}
												],
												"put": [
													{
														"l": "Change account's password by id",
														"v": "/account/password",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Change account's email by id",
														"v": "/account/email",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Edit account's information by id",
														"v": "/account",
														"m": "put",
														"group": "My account"
													}
												]
											}
										},
										"User administration": {
											"apis": [
												{
													"l": "Get user by id",
													"v": "/admin/user",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "List users matching certain keywords",
													"v": "/admin/users",
													"m": "get",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Get users count matching certain keywords",
													"v": "/admin/users/count",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "Add user",
													"v": "/admin/user",
													"m": "post",
													"group": "User administration"
												},
												{
													"l": "List users by Id",
													"v": "/admin/users/ids",
													"m": "post",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Delete user",
													"v": "/admin/user",
													"m": "delete",
													"group": "User administration"
												},
												{
													"l": "Edit user by id",
													"v": "/admin/user",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit user's groups by id, username, or email",
													"v": "/admin/user/groups",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit, reset, or delete user's pin information by id, username, or email",
													"v": "/admin/user/pin",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Change the status of a user by id",
													"v": "/admin/user/status",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Self Invite user by id or username as username or email",
													"v": "/admin/user/self/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Invite users by id, username or email",
													"v": "/admin/users/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "un-Invite users by id, username or email",
													"v": "/admin/users/uninvite",
													"m": "put",
													"group": "User administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user by id",
														"v": "/admin/user",
														"m": "get",
														"group": "User administration"
													},
													{
														"l": "List users matching certain keywords",
														"v": "/admin/users",
														"m": "get",
														"group": "User administration",
														"groupMain": true
													},
													{
														"l": "Get users count matching certain keywords",
														"v": "/admin/users/count",
														"m": "get",
														"group": "User administration"
													}
												],
												"post": [
													{
														"l": "Add user",
														"v": "/admin/user",
														"m": "post",
														"group": "User administration"
													},
													{
														"l": "List users by Id",
														"v": "/admin/users/ids",
														"m": "post",
														"group": "User administration",
														"groupMain": true
													}
												],
												"delete": [
													{
														"l": "Delete user",
														"v": "/admin/user",
														"m": "delete",
														"group": "User administration"
													}
												],
												"put": [
													{
														"l": "Edit user by id",
														"v": "/admin/user",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit user's groups by id, username, or email",
														"v": "/admin/user/groups",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit, reset, or delete user's pin information by id, username, or email",
														"v": "/admin/user/pin",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Change the status of a user by id",
														"v": "/admin/user/status",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Self Invite user by id or username as username or email",
														"v": "/admin/user/self/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Invite users by id, username or email",
														"v": "/admin/users/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "un-Invite users by id, username or email",
														"v": "/admin/users/uninvite",
														"m": "put",
														"group": "User administration"
													}
												]
											}
										},
										"Group administration": {
											"apis": [
												{
													"l": "List all groups",
													"v": "/admin/groups",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Get group by id or code",
													"v": "/admin/group",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Add group",
													"v": "/admin/group",
													"m": "post",
													"group": "Group administration"
												},
												{
													"l": "Delete group",
													"v": "/admin/group",
													"m": "delete",
													"group": "Group administration"
												},
												{
													"l": "Edit group by id",
													"v": "/admin/group",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update environment(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/environments",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update package(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/packages",
													"m": "put",
													"group": "Group administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "List all groups",
														"v": "/admin/groups",
														"m": "get",
														"group": "Group administration"
													},
													{
														"l": "Get group by id or code",
														"v": "/admin/group",
														"m": "get",
														"group": "Group administration"
													}
												],
												"post": [
													{
														"l": "Add group",
														"v": "/admin/group",
														"m": "post",
														"group": "Group administration"
													}
												],
												"delete": [
													{
														"l": "Delete group",
														"v": "/admin/group",
														"m": "delete",
														"group": "Group administration"
													}
												],
												"put": [
													{
														"l": "Edit group by id",
														"v": "/admin/group",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update environment(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/environments",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update package(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/packages",
														"m": "put",
														"group": "Group administration"
													}
												]
											}
										},
										"Administration": {
											"apis": [
												{
													"l": "Get all users and groups of a main tenant",
													"v": "/admin/all",
													"m": "get",
													"group": "Administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get all users and groups of a main tenant",
														"v": "/admin/all",
														"m": "get",
														"group": "Administration"
													}
												]
											}
										},
										"Custom email": {
											"apis": [
												{
													"l": "Send custom email",
													"v": "/email",
													"m": "post",
													"group": "Custom email"
												}
											],
											"apisRest": {
												"post": [
													{
														"l": "Send custom email",
														"v": "/email",
														"m": "post",
														"group": "Custom email"
													}
												]
											}
										},
										"%v%": "3",
										"%showApi%": false
									}
								]
							}
						]
					},
					"paginations": {
						"Gateway": {
							"currentPage": 1,
							"totalItems": 1
						}
					},
					"product": {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product."
					}
				});
				done();
			});
		});
		
		it("Success - Get product scope", (done) => {
			let inputMask = {
				id: '5f575ec295bb89628f3221d1',
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "DSBRT",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dev": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						}
					});
				}
			};
			BL.getUIProductAcl(soajs, inputMask, (err, scope) => {
				assert.ok(scope);
				assert.deepEqual(scope, {
					"aclFill": {
						"DEV": {
							"urac": {
								"3": {
									"apisPermission": "restricted",
									"access": true,
									"get": {
										"My account guest": {
											"apis": {
												"/password/forgot": {
													"access": false,
													"include": true,
													"accessType": "public"
												},
												"/emailToken": {
													"access": true,
													"include": true,
													"accessType": "private"
												},
												"/validate/changeEmail": {
													"access": true,
													"include": true,
													"accessType": "private"
												}
											}
										}
									},
									"include": true,
									"accessType": "private",
									"apisRestrictPermission": true
								},
								"collapse": false,
								"include": true
							}
						}
					},
					"serviceGroup": [
						"Gateway"
					],
					"allServiceApis": {
						"Gateway": [
							{
								"type": "service",
								"name": "urac",
								"group": "Gateway",
								"versions": [
									{
										"version": "3",
										"apis": [
											{
												"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
												"v": "/password/forgot",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate user account after joining",
												"v": "/validate/join",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if a username as (username or email) is available or taken",
												"v": "/checkUsername",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
												"v": "/emailToken",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate change email",
												"v": "/validate/changeEmail",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "Get user account information by username as (username or email)",
												"v": "/user",
												"m": "get",
												"group": "My account",
												"groupMain": true
											},
											{
												"l": "Get user by id",
												"v": "/admin/user",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List users matching certain keywords",
												"v": "/admin/users",
												"m": "get",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Get users count matching certain keywords",
												"v": "/admin/users/count",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List all groups",
												"v": "/admin/groups",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get group by id or code",
												"v": "/admin/group",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get all users and groups of a main tenant",
												"v": "/admin/all",
												"m": "get",
												"group": "Administration"
											},
											{
												"l": "Send custom email",
												"v": "/email",
												"m": "post",
												"group": "Custom email"
											},
											{
												"l": "Join and create an account",
												"v": "/join",
												"m": "post",
												"group": "Guest join"
											},
											{
												"l": "Add user",
												"v": "/admin/user",
												"m": "post",
												"group": "User administration"
											},
											{
												"l": "List users by Id",
												"v": "/admin/users/ids",
												"m": "post",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Add group",
												"v": "/admin/group",
												"m": "post",
												"group": "Group administration"
											},
											{
												"l": "Delete group",
												"v": "/admin/group",
												"m": "delete",
												"group": "Group administration"
											},
											{
												"l": "Delete user",
												"v": "/admin/user",
												"m": "delete",
												"group": "User administration"
											},
											{
												"l": "Reset password",
												"v": "/password/reset",
												"m": "put",
												"group": "My account guest"
											},
											{
												"l": "Change account's password by id",
												"v": "/account/password",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Change account's email by id",
												"v": "/account/email",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit account's information by id",
												"v": "/account",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit user by id",
												"v": "/admin/user",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit user's groups by id, username, or email",
												"v": "/admin/user/groups",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit, reset, or delete user's pin information by id, username, or email",
												"v": "/admin/user/pin",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Change the status of a user by id",
												"v": "/admin/user/status",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit group by id",
												"v": "/admin/group",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update environment(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/environments",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update package(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/packages",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Self Invite user by id or username as username or email",
												"v": "/admin/user/self/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Invite users by id, username or email",
												"v": "/admin/users/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "un-Invite users by id, username or email",
												"v": "/admin/users/uninvite",
												"m": "put",
												"group": "User administration"
											}
										]
									}
								],
								"fixList": [
									{
										"My account guest": {
											"apis": [
												{
													"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
													"v": "/password/forgot",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
													"v": "/emailToken",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "To validate change email",
													"v": "/validate/changeEmail",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Reset password",
													"v": "/password/reset",
													"m": "put",
													"group": "My account guest"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
														"v": "/password/forgot",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
														"v": "/emailToken",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "To validate change email",
														"v": "/validate/changeEmail",
														"m": "get",
														"group": "My account guest"
													}
												],
												"put": [
													{
														"l": "Reset password",
														"v": "/password/reset",
														"m": "put",
														"group": "My account guest"
													}
												]
											}
										},
										"Guest join": {
											"apis": [
												{
													"l": "To validate user account after joining",
													"v": "/validate/join",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Check if a username as (username or email) is available or taken",
													"v": "/checkUsername",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Join and create an account",
													"v": "/join",
													"m": "post",
													"group": "Guest join"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "To validate user account after joining",
														"v": "/validate/join",
														"m": "get",
														"group": "Guest join"
													},
													{
														"l": "Check if a username as (username or email) is available or taken",
														"v": "/checkUsername",
														"m": "get",
														"group": "Guest join"
													}
												],
												"post": [
													{
														"l": "Join and create an account",
														"v": "/join",
														"m": "post",
														"group": "Guest join"
													}
												]
											}
										},
										"My account": {
											"apis": [
												{
													"l": "Get user account information by username as (username or email)",
													"v": "/user",
													"m": "get",
													"group": "My account",
													"groupMain": true
												},
												{
													"l": "Change account's password by id",
													"v": "/account/password",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Change account's email by id",
													"v": "/account/email",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Edit account's information by id",
													"v": "/account",
													"m": "put",
													"group": "My account"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user account information by username as (username or email)",
														"v": "/user",
														"m": "get",
														"group": "My account",
														"groupMain": true
													}
												],
												"put": [
													{
														"l": "Change account's password by id",
														"v": "/account/password",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Change account's email by id",
														"v": "/account/email",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Edit account's information by id",
														"v": "/account",
														"m": "put",
														"group": "My account"
													}
												]
											}
										},
										"User administration": {
											"apis": [
												{
													"l": "Get user by id",
													"v": "/admin/user",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "List users matching certain keywords",
													"v": "/admin/users",
													"m": "get",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Get users count matching certain keywords",
													"v": "/admin/users/count",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "Add user",
													"v": "/admin/user",
													"m": "post",
													"group": "User administration"
												},
												{
													"l": "List users by Id",
													"v": "/admin/users/ids",
													"m": "post",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Delete user",
													"v": "/admin/user",
													"m": "delete",
													"group": "User administration"
												},
												{
													"l": "Edit user by id",
													"v": "/admin/user",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit user's groups by id, username, or email",
													"v": "/admin/user/groups",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit, reset, or delete user's pin information by id, username, or email",
													"v": "/admin/user/pin",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Change the status of a user by id",
													"v": "/admin/user/status",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Self Invite user by id or username as username or email",
													"v": "/admin/user/self/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Invite users by id, username or email",
													"v": "/admin/users/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "un-Invite users by id, username or email",
													"v": "/admin/users/uninvite",
													"m": "put",
													"group": "User administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user by id",
														"v": "/admin/user",
														"m": "get",
														"group": "User administration"
													},
													{
														"l": "List users matching certain keywords",
														"v": "/admin/users",
														"m": "get",
														"group": "User administration",
														"groupMain": true
													},
													{
														"l": "Get users count matching certain keywords",
														"v": "/admin/users/count",
														"m": "get",
														"group": "User administration"
													}
												],
												"post": [
													{
														"l": "Add user",
														"v": "/admin/user",
														"m": "post",
														"group": "User administration"
													},
													{
														"l": "List users by Id",
														"v": "/admin/users/ids",
														"m": "post",
														"group": "User administration",
														"groupMain": true
													}
												],
												"delete": [
													{
														"l": "Delete user",
														"v": "/admin/user",
														"m": "delete",
														"group": "User administration"
													}
												],
												"put": [
													{
														"l": "Edit user by id",
														"v": "/admin/user",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit user's groups by id, username, or email",
														"v": "/admin/user/groups",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit, reset, or delete user's pin information by id, username, or email",
														"v": "/admin/user/pin",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Change the status of a user by id",
														"v": "/admin/user/status",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Self Invite user by id or username as username or email",
														"v": "/admin/user/self/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Invite users by id, username or email",
														"v": "/admin/users/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "un-Invite users by id, username or email",
														"v": "/admin/users/uninvite",
														"m": "put",
														"group": "User administration"
													}
												]
											}
										},
										"Group administration": {
											"apis": [
												{
													"l": "List all groups",
													"v": "/admin/groups",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Get group by id or code",
													"v": "/admin/group",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Add group",
													"v": "/admin/group",
													"m": "post",
													"group": "Group administration"
												},
												{
													"l": "Delete group",
													"v": "/admin/group",
													"m": "delete",
													"group": "Group administration"
												},
												{
													"l": "Edit group by id",
													"v": "/admin/group",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update environment(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/environments",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update package(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/packages",
													"m": "put",
													"group": "Group administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "List all groups",
														"v": "/admin/groups",
														"m": "get",
														"group": "Group administration"
													},
													{
														"l": "Get group by id or code",
														"v": "/admin/group",
														"m": "get",
														"group": "Group administration"
													}
												],
												"post": [
													{
														"l": "Add group",
														"v": "/admin/group",
														"m": "post",
														"group": "Group administration"
													}
												],
												"delete": [
													{
														"l": "Delete group",
														"v": "/admin/group",
														"m": "delete",
														"group": "Group administration"
													}
												],
												"put": [
													{
														"l": "Edit group by id",
														"v": "/admin/group",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update environment(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/environments",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update package(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/packages",
														"m": "put",
														"group": "Group administration"
													}
												]
											}
										},
										"Administration": {
											"apis": [
												{
													"l": "Get all users and groups of a main tenant",
													"v": "/admin/all",
													"m": "get",
													"group": "Administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get all users and groups of a main tenant",
														"v": "/admin/all",
														"m": "get",
														"group": "Administration"
													}
												]
											}
										},
										"Custom email": {
											"apis": [
												{
													"l": "Send custom email",
													"v": "/email",
													"m": "post",
													"group": "Custom email"
												}
											],
											"apisRest": {
												"post": [
													{
														"l": "Send custom email",
														"v": "/email",
														"m": "post",
														"group": "Custom email"
													}
												]
											}
										},
										"%v%": "3",
										"%showApi%": false
									}
								]
							}
						]
					},
					"paginations": {
						"Gateway": {
							"currentPage": 1,
							"totalItems": 1
						}
					},
					"product": {
						"code": "DSBRT",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dev": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false,
															"include": true,
															"accessType": "public"
														},
														"/emailToken": {
															"access": true,
															"include": true,
															"accessType": "private"
														},
														"/validate/changeEmail": {
															"access": true,
															"include": true,
															"accessType": "private"
														}
													}
												}
											]
										}
									}
								}
							}
						}
					}
				});
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.getUIProductAcl(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.getUIProductAcl(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 460);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.getUIProductAcl(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product scope", (done) => {
			let inputMask = {
				qs: {
					id: '5f575ec295bb89628f3221d1',
					soajs: true,
				}
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": true,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			
			BL.getUIProductAcl(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 503);
				done();
			});
		});
	});
	
	describe("Testing Get product ACL Package UI", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			nock.cleanAll();
			done();
		});
		
		it("Success - Get product scope - granular", (done) => {
			let inputMask = {
				id: '5f575ec295bb89628f3221d1',
				package: 'TEST2_NEW',
				config: {
					envs: ['dashboard'],
					type: "granular"
				}
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getUIProductPackageAcl(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, {
					"aclFill": {
						"DASHBOARD": {}
					},
					"scopeFill": {
						"dashboard": {
							"urac": {
								"3": {
									"access": true,
									"apisPermission": "restricted",
									"get": [
										{
											"group": "My account guest",
											"apis": {
												"/password/forgot": {
													"access": false
												},
												"/emailToken": {
													"access": true
												},
												"/validate/changeEmail": {
													"access": true
												}
											}
										}
									]
								}
							}
						}
					},
					"paginations": {
						"Gateway": {
							"currentPage": 1,
							"totalItems": 1
						}
					},
					"serviceGroup": [
						"Gateway"
					],
					"allServiceApis": [
						{
							"_id": "5ef23b834584f11f017b3def",
							"type": "service",
							"name": "urac",
							"versions": [
								{
									"version": "3",
									"apis": [
										{
											"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											"v": "/password/forgot",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "To validate user account after joining",
											"v": "/validate/join",
											"m": "get",
											"group": "Guest join"
										},
										{
											"l": "Check if a username as (username or email) is available or taken",
											"v": "/checkUsername",
											"m": "get",
											"group": "Guest join"
										},
										{
											"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											"v": "/emailToken",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "To validate change email",
											"v": "/validate/changeEmail",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "Get user account information by username as (username or email)",
											"v": "/user",
											"m": "get",
											"group": "My account",
											"groupMain": true
										},
										{
											"l": "Get user by id",
											"v": "/admin/user",
											"m": "get",
											"group": "User administration"
										},
										{
											"l": "List users matching certain keywords",
											"v": "/admin/users",
											"m": "get",
											"group": "User administration",
											"groupMain": true
										},
										{
											"l": "Get users count matching certain keywords",
											"v": "/admin/users/count",
											"m": "get",
											"group": "User administration"
										},
										{
											"l": "List all groups",
											"v": "/admin/groups",
											"m": "get",
											"group": "Group administration"
										},
										{
											"l": "Get group by id or code",
											"v": "/admin/group",
											"m": "get",
											"group": "Group administration"
										},
										{
											"l": "Get all users and groups of a main tenant",
											"v": "/admin/all",
											"m": "get",
											"group": "Administration"
										},
										{
											"l": "Send custom email",
											"v": "/email",
											"m": "post",
											"group": "Custom email"
										},
										{
											"l": "Join and create an account",
											"v": "/join",
											"m": "post",
											"group": "Guest join"
										},
										{
											"l": "Add user",
											"v": "/admin/user",
											"m": "post",
											"group": "User administration"
										},
										{
											"l": "List users by Id",
											"v": "/admin/users/ids",
											"m": "post",
											"group": "User administration",
											"groupMain": true
										},
										{
											"l": "Add group",
											"v": "/admin/group",
											"m": "post",
											"group": "Group administration"
										},
										{
											"l": "Delete group",
											"v": "/admin/group",
											"m": "delete",
											"group": "Group administration"
										},
										{
											"l": "Delete user",
											"v": "/admin/user",
											"m": "delete",
											"group": "User administration"
										},
										{
											"l": "Reset password",
											"v": "/password/reset",
											"m": "put",
											"group": "My account guest"
										},
										{
											"l": "Change account's password by id",
											"v": "/account/password",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Change account's email by id",
											"v": "/account/email",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Edit account's information by id",
											"v": "/account",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Edit user by id",
											"v": "/admin/user",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit user's groups by id, username, or email",
											"v": "/admin/user/groups",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit, reset, or delete user's pin information by id, username, or email",
											"v": "/admin/user/pin",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Change the status of a user by id",
											"v": "/admin/user/status",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit group by id",
											"v": "/admin/group",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Update environment(s) of group(s) by code(s) or id(s)",
											"v": "/admin/groups/environments",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Update package(s) of group(s) by code(s) or id(s)",
											"v": "/admin/groups/packages",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Self Invite user by id or username as username or email",
											"v": "/admin/user/self/invite",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Invite users by id, username or email",
											"v": "/admin/users/invite",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "un-Invite users by id, username or email",
											"v": "/admin/users/uninvite",
											"m": "put",
											"group": "User administration"
										}
									]
								}
							],
							"configuration": {
								"subType": "soajs",
								"group": "Gateway"
							},
							"src": {
								"provider": "github",
								"owner": "soajs",
								"repo": "soajs.multituracenant"
							}
						}
					],
					"allServiceApisGranular": {
						"Gateway": [
							{
								"type": "service",
								"name": "urac",
								"group": "Gateway",
								"versions": [
									{
										"version": "3",
										"apis": [
											{
												"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
												"v": "/password/forgot",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate user account after joining",
												"v": "/validate/join",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if a username as (username or email) is available or taken",
												"v": "/checkUsername",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
												"v": "/emailToken",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate change email",
												"v": "/validate/changeEmail",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "Get user account information by username as (username or email)",
												"v": "/user",
												"m": "get",
												"group": "My account",
												"groupMain": true
											},
											{
												"l": "Get user by id",
												"v": "/admin/user",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List users matching certain keywords",
												"v": "/admin/users",
												"m": "get",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Get users count matching certain keywords",
												"v": "/admin/users/count",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List all groups",
												"v": "/admin/groups",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get group by id or code",
												"v": "/admin/group",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get all users and groups of a main tenant",
												"v": "/admin/all",
												"m": "get",
												"group": "Administration"
											},
											{
												"l": "Send custom email",
												"v": "/email",
												"m": "post",
												"group": "Custom email"
											},
											{
												"l": "Join and create an account",
												"v": "/join",
												"m": "post",
												"group": "Guest join"
											},
											{
												"l": "Add user",
												"v": "/admin/user",
												"m": "post",
												"group": "User administration"
											},
											{
												"l": "List users by Id",
												"v": "/admin/users/ids",
												"m": "post",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Add group",
												"v": "/admin/group",
												"m": "post",
												"group": "Group administration"
											},
											{
												"l": "Delete group",
												"v": "/admin/group",
												"m": "delete",
												"group": "Group administration"
											},
											{
												"l": "Delete user",
												"v": "/admin/user",
												"m": "delete",
												"group": "User administration"
											},
											{
												"l": "Reset password",
												"v": "/password/reset",
												"m": "put",
												"group": "My account guest"
											},
											{
												"l": "Change account's password by id",
												"v": "/account/password",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Change account's email by id",
												"v": "/account/email",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit account's information by id",
												"v": "/account",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit user by id",
												"v": "/admin/user",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit user's groups by id, username, or email",
												"v": "/admin/user/groups",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit, reset, or delete user's pin information by id, username, or email",
												"v": "/admin/user/pin",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Change the status of a user by id",
												"v": "/admin/user/status",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit group by id",
												"v": "/admin/group",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update environment(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/environments",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update package(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/packages",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Self Invite user by id or username as username or email",
												"v": "/admin/user/self/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Invite users by id, username or email",
												"v": "/admin/users/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "un-Invite users by id, username or email",
												"v": "/admin/users/uninvite",
												"m": "put",
												"group": "User administration"
											}
										]
									}
								],
								"fixList": [
									{
										"My account guest": {
											"apis": [
												{
													"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
													"v": "/password/forgot",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
													"v": "/emailToken",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "To validate change email",
													"v": "/validate/changeEmail",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Reset password",
													"v": "/password/reset",
													"m": "put",
													"group": "My account guest"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
														"v": "/password/forgot",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
														"v": "/emailToken",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "To validate change email",
														"v": "/validate/changeEmail",
														"m": "get",
														"group": "My account guest"
													}
												],
												"put": [
													{
														"l": "Reset password",
														"v": "/password/reset",
														"m": "put",
														"group": "My account guest"
													}
												]
											}
										},
										"Guest join": {
											"apis": [
												{
													"l": "To validate user account after joining",
													"v": "/validate/join",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Check if a username as (username or email) is available or taken",
													"v": "/checkUsername",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Join and create an account",
													"v": "/join",
													"m": "post",
													"group": "Guest join"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "To validate user account after joining",
														"v": "/validate/join",
														"m": "get",
														"group": "Guest join"
													},
													{
														"l": "Check if a username as (username or email) is available or taken",
														"v": "/checkUsername",
														"m": "get",
														"group": "Guest join"
													}
												],
												"post": [
													{
														"l": "Join and create an account",
														"v": "/join",
														"m": "post",
														"group": "Guest join"
													}
												]
											}
										},
										"My account": {
											"apis": [
												{
													"l": "Get user account information by username as (username or email)",
													"v": "/user",
													"m": "get",
													"group": "My account",
													"groupMain": true
												},
												{
													"l": "Change account's password by id",
													"v": "/account/password",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Change account's email by id",
													"v": "/account/email",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Edit account's information by id",
													"v": "/account",
													"m": "put",
													"group": "My account"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user account information by username as (username or email)",
														"v": "/user",
														"m": "get",
														"group": "My account",
														"groupMain": true
													}
												],
												"put": [
													{
														"l": "Change account's password by id",
														"v": "/account/password",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Change account's email by id",
														"v": "/account/email",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Edit account's information by id",
														"v": "/account",
														"m": "put",
														"group": "My account"
													}
												]
											}
										},
										"User administration": {
											"apis": [
												{
													"l": "Get user by id",
													"v": "/admin/user",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "List users matching certain keywords",
													"v": "/admin/users",
													"m": "get",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Get users count matching certain keywords",
													"v": "/admin/users/count",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "Add user",
													"v": "/admin/user",
													"m": "post",
													"group": "User administration"
												},
												{
													"l": "List users by Id",
													"v": "/admin/users/ids",
													"m": "post",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Delete user",
													"v": "/admin/user",
													"m": "delete",
													"group": "User administration"
												},
												{
													"l": "Edit user by id",
													"v": "/admin/user",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit user's groups by id, username, or email",
													"v": "/admin/user/groups",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit, reset, or delete user's pin information by id, username, or email",
													"v": "/admin/user/pin",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Change the status of a user by id",
													"v": "/admin/user/status",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Self Invite user by id or username as username or email",
													"v": "/admin/user/self/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Invite users by id, username or email",
													"v": "/admin/users/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "un-Invite users by id, username or email",
													"v": "/admin/users/uninvite",
													"m": "put",
													"group": "User administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user by id",
														"v": "/admin/user",
														"m": "get",
														"group": "User administration"
													},
													{
														"l": "List users matching certain keywords",
														"v": "/admin/users",
														"m": "get",
														"group": "User administration",
														"groupMain": true
													},
													{
														"l": "Get users count matching certain keywords",
														"v": "/admin/users/count",
														"m": "get",
														"group": "User administration"
													}
												],
												"post": [
													{
														"l": "Add user",
														"v": "/admin/user",
														"m": "post",
														"group": "User administration"
													},
													{
														"l": "List users by Id",
														"v": "/admin/users/ids",
														"m": "post",
														"group": "User administration",
														"groupMain": true
													}
												],
												"delete": [
													{
														"l": "Delete user",
														"v": "/admin/user",
														"m": "delete",
														"group": "User administration"
													}
												],
												"put": [
													{
														"l": "Edit user by id",
														"v": "/admin/user",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit user's groups by id, username, or email",
														"v": "/admin/user/groups",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit, reset, or delete user's pin information by id, username, or email",
														"v": "/admin/user/pin",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Change the status of a user by id",
														"v": "/admin/user/status",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Self Invite user by id or username as username or email",
														"v": "/admin/user/self/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Invite users by id, username or email",
														"v": "/admin/users/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "un-Invite users by id, username or email",
														"v": "/admin/users/uninvite",
														"m": "put",
														"group": "User administration"
													}
												]
											}
										},
										"Group administration": {
											"apis": [
												{
													"l": "List all groups",
													"v": "/admin/groups",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Get group by id or code",
													"v": "/admin/group",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Add group",
													"v": "/admin/group",
													"m": "post",
													"group": "Group administration"
												},
												{
													"l": "Delete group",
													"v": "/admin/group",
													"m": "delete",
													"group": "Group administration"
												},
												{
													"l": "Edit group by id",
													"v": "/admin/group",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update environment(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/environments",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update package(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/packages",
													"m": "put",
													"group": "Group administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "List all groups",
														"v": "/admin/groups",
														"m": "get",
														"group": "Group administration"
													},
													{
														"l": "Get group by id or code",
														"v": "/admin/group",
														"m": "get",
														"group": "Group administration"
													}
												],
												"post": [
													{
														"l": "Add group",
														"v": "/admin/group",
														"m": "post",
														"group": "Group administration"
													}
												],
												"delete": [
													{
														"l": "Delete group",
														"v": "/admin/group",
														"m": "delete",
														"group": "Group administration"
													}
												],
												"put": [
													{
														"l": "Edit group by id",
														"v": "/admin/group",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update environment(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/environments",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update package(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/packages",
														"m": "put",
														"group": "Group administration"
													}
												]
											}
										},
										"Administration": {
											"apis": [
												{
													"l": "Get all users and groups of a main tenant",
													"v": "/admin/all",
													"m": "get",
													"group": "Administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get all users and groups of a main tenant",
														"v": "/admin/all",
														"m": "get",
														"group": "Administration"
													}
												]
											}
										},
										"Custom email": {
											"apis": [
												{
													"l": "Send custom email",
													"v": "/email",
													"m": "post",
													"group": "Custom email"
												}
											],
											"apisRest": {
												"post": [
													{
														"l": "Send custom email",
														"v": "/email",
														"m": "post",
														"group": "Custom email"
													}
												]
											}
										},
										"%v%": "3",
										"%showApi%": false
									}
								]
							}
						]
					},
					"product": {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [
							{
								"code": "TEST2_NEW",
								"name": "new package",
								"description": "this is a description for test 2 product new package",
								"acl": {
									"dashboard": {
										"urac": [
											{
												"version": "3",
												"get": [
													"My account guest"
												]
											}
										]
									}
								},
								"_TTL": 86400000
							}
						]
					},
					"package": {
						"code": "TEST2_NEW",
						"name": "new package",
						"description": "this is a description for test 2 product new package",
						"acl": {
							"dashboard": {
								"urac": [
									{
										"version": "3",
										"get": [
											"My account guest"
										]
									}
								]
							}
						},
						"_TTL": 86400000
					},
					"aclTypeByEnv": {}
				});
				done();
			});
		});
		
		it("Success - Get product scope - granular", (done) => {
			let inputMask = {
				id: '5f575ec295bb89628f3221d1',
				package: 'TEST2_NEW',
				config: {
					envs: ['dashboard'],
					type: "granular"
				}
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" : {
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								}
							},
							"_TTL": 86400000 // 24 hours
						}],
					});
				}
			};
			
			BL.getUIProductPackageAcl(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, {
					"aclFill": {
						"DASHBOARD": {
							"urac": {
								"3": {
									"apisPermission": "restricted",
									"access": false,
									"get": {
										"My account guest": {
											"apis": {
												"/password/forgot": {
													"access": false,
													"include": true,
													"accessType": "public"
												},
												"/emailToken": {
													"access": true,
													"include": true,
													"accessType": "private"
												},
												"/validate/changeEmail": {
													"access": true,
													"include": true,
													"accessType": "private"
												}
											}
										}
									},
									"include": true,
									"accessType": "public",
									"apisRestrictPermission": true
								},
								"collapse": false,
								"include": true
							}
						}
					},
					"scopeFill": {
						"dashboard": {
							"urac": {
								"3": {
									"access": true,
									"apisPermission": "restricted",
									"get": [
										{
											"group": "My account guest",
											"apis": {
												"/password/forgot": {
													"access": false
												},
												"/emailToken": {
													"access": true
												},
												"/validate/changeEmail": {
													"access": true
												}
											}
										}
									]
								}
							}
						}
					},
					"paginations": {
						"Gateway": {
							"currentPage": 1,
							"totalItems": 1
						}
					},
					"serviceGroup": [
						"Gateway"
					],
					"allServiceApis": [
						{
							"_id": "5ef23b834584f11f017b3def",
							"type": "service",
							"name": "urac",
							"versions": [
								{
									"version": "3",
									"apis": [
										{
											"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											"v": "/password/forgot",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "To validate user account after joining",
											"v": "/validate/join",
											"m": "get",
											"group": "Guest join"
										},
										{
											"l": "Check if a username as (username or email) is available or taken",
											"v": "/checkUsername",
											"m": "get",
											"group": "Guest join"
										},
										{
											"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											"v": "/emailToken",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "To validate change email",
											"v": "/validate/changeEmail",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "Get user account information by username as (username or email)",
											"v": "/user",
											"m": "get",
											"group": "My account",
											"groupMain": true
										},
										{
											"l": "Get user by id",
											"v": "/admin/user",
											"m": "get",
											"group": "User administration"
										},
										{
											"l": "List users matching certain keywords",
											"v": "/admin/users",
											"m": "get",
											"group": "User administration",
											"groupMain": true
										},
										{
											"l": "Get users count matching certain keywords",
											"v": "/admin/users/count",
											"m": "get",
											"group": "User administration"
										},
										{
											"l": "List all groups",
											"v": "/admin/groups",
											"m": "get",
											"group": "Group administration"
										},
										{
											"l": "Get group by id or code",
											"v": "/admin/group",
											"m": "get",
											"group": "Group administration"
										},
										{
											"l": "Get all users and groups of a main tenant",
											"v": "/admin/all",
											"m": "get",
											"group": "Administration"
										},
										{
											"l": "Send custom email",
											"v": "/email",
											"m": "post",
											"group": "Custom email"
										},
										{
											"l": "Join and create an account",
											"v": "/join",
											"m": "post",
											"group": "Guest join"
										},
										{
											"l": "Add user",
											"v": "/admin/user",
											"m": "post",
											"group": "User administration"
										},
										{
											"l": "List users by Id",
											"v": "/admin/users/ids",
											"m": "post",
											"group": "User administration",
											"groupMain": true
										},
										{
											"l": "Add group",
											"v": "/admin/group",
											"m": "post",
											"group": "Group administration"
										},
										{
											"l": "Delete group",
											"v": "/admin/group",
											"m": "delete",
											"group": "Group administration"
										},
										{
											"l": "Delete user",
											"v": "/admin/user",
											"m": "delete",
											"group": "User administration"
										},
										{
											"l": "Reset password",
											"v": "/password/reset",
											"m": "put",
											"group": "My account guest"
										},
										{
											"l": "Change account's password by id",
											"v": "/account/password",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Change account's email by id",
											"v": "/account/email",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Edit account's information by id",
											"v": "/account",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Edit user by id",
											"v": "/admin/user",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit user's groups by id, username, or email",
											"v": "/admin/user/groups",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit, reset, or delete user's pin information by id, username, or email",
											"v": "/admin/user/pin",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Change the status of a user by id",
											"v": "/admin/user/status",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit group by id",
											"v": "/admin/group",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Update environment(s) of group(s) by code(s) or id(s)",
											"v": "/admin/groups/environments",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Update package(s) of group(s) by code(s) or id(s)",
											"v": "/admin/groups/packages",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Self Invite user by id or username as username or email",
											"v": "/admin/user/self/invite",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Invite users by id, username or email",
											"v": "/admin/users/invite",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "un-Invite users by id, username or email",
											"v": "/admin/users/uninvite",
											"m": "put",
											"group": "User administration"
										}
									]
								}
							],
							"configuration": {
								"subType": "soajs",
								"group": "Gateway"
							},
							"src": {
								"provider": "github",
								"owner": "soajs",
								"repo": "soajs.multituracenant"
							}
						}
					],
					"allServiceApisGranular": {
						"Gateway": [
							{
								"type": "service",
								"name": "urac",
								"group": "Gateway",
								"versions": [
									{
										"version": "3",
										"apis": [
											{
												"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
												"v": "/password/forgot",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate user account after joining",
												"v": "/validate/join",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if a username as (username or email) is available or taken",
												"v": "/checkUsername",
												"m": "get",
												"group": "Guest join"
											},
											{
												"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
												"v": "/emailToken",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "To validate change email",
												"v": "/validate/changeEmail",
												"m": "get",
												"group": "My account guest"
											},
											{
												"l": "Get user account information by username as (username or email)",
												"v": "/user",
												"m": "get",
												"group": "My account",
												"groupMain": true
											},
											{
												"l": "Get user by id",
												"v": "/admin/user",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List users matching certain keywords",
												"v": "/admin/users",
												"m": "get",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Get users count matching certain keywords",
												"v": "/admin/users/count",
												"m": "get",
												"group": "User administration"
											},
											{
												"l": "List all groups",
												"v": "/admin/groups",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get group by id or code",
												"v": "/admin/group",
												"m": "get",
												"group": "Group administration"
											},
											{
												"l": "Get all users and groups of a main tenant",
												"v": "/admin/all",
												"m": "get",
												"group": "Administration"
											},
											{
												"l": "Send custom email",
												"v": "/email",
												"m": "post",
												"group": "Custom email"
											},
											{
												"l": "Join and create an account",
												"v": "/join",
												"m": "post",
												"group": "Guest join"
											},
											{
												"l": "Add user",
												"v": "/admin/user",
												"m": "post",
												"group": "User administration"
											},
											{
												"l": "List users by Id",
												"v": "/admin/users/ids",
												"m": "post",
												"group": "User administration",
												"groupMain": true
											},
											{
												"l": "Add group",
												"v": "/admin/group",
												"m": "post",
												"group": "Group administration"
											},
											{
												"l": "Delete group",
												"v": "/admin/group",
												"m": "delete",
												"group": "Group administration"
											},
											{
												"l": "Delete user",
												"v": "/admin/user",
												"m": "delete",
												"group": "User administration"
											},
											{
												"l": "Reset password",
												"v": "/password/reset",
												"m": "put",
												"group": "My account guest"
											},
											{
												"l": "Change account's password by id",
												"v": "/account/password",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Change account's email by id",
												"v": "/account/email",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit account's information by id",
												"v": "/account",
												"m": "put",
												"group": "My account"
											},
											{
												"l": "Edit user by id",
												"v": "/admin/user",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit user's groups by id, username, or email",
												"v": "/admin/user/groups",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit, reset, or delete user's pin information by id, username, or email",
												"v": "/admin/user/pin",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Change the status of a user by id",
												"v": "/admin/user/status",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Edit group by id",
												"v": "/admin/group",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update environment(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/environments",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Update package(s) of group(s) by code(s) or id(s)",
												"v": "/admin/groups/packages",
												"m": "put",
												"group": "Group administration"
											},
											{
												"l": "Self Invite user by id or username as username or email",
												"v": "/admin/user/self/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "Invite users by id, username or email",
												"v": "/admin/users/invite",
												"m": "put",
												"group": "User administration"
											},
											{
												"l": "un-Invite users by id, username or email",
												"v": "/admin/users/uninvite",
												"m": "put",
												"group": "User administration"
											}
										]
									}
								],
								"fixList": [
									{
										"My account guest": {
											"apis": [
												{
													"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
													"v": "/password/forgot",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
													"v": "/emailToken",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "To validate change email",
													"v": "/validate/changeEmail",
													"m": "get",
													"group": "My account guest"
												},
												{
													"l": "Reset password",
													"v": "/password/reset",
													"m": "put",
													"group": "My account guest"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
														"v": "/password/forgot",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
														"v": "/emailToken",
														"m": "get",
														"group": "My account guest"
													},
													{
														"l": "To validate change email",
														"v": "/validate/changeEmail",
														"m": "get",
														"group": "My account guest"
													}
												],
												"put": [
													{
														"l": "Reset password",
														"v": "/password/reset",
														"m": "put",
														"group": "My account guest"
													}
												]
											}
										},
										"Guest join": {
											"apis": [
												{
													"l": "To validate user account after joining",
													"v": "/validate/join",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Check if a username as (username or email) is available or taken",
													"v": "/checkUsername",
													"m": "get",
													"group": "Guest join"
												},
												{
													"l": "Join and create an account",
													"v": "/join",
													"m": "post",
													"group": "Guest join"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "To validate user account after joining",
														"v": "/validate/join",
														"m": "get",
														"group": "Guest join"
													},
													{
														"l": "Check if a username as (username or email) is available or taken",
														"v": "/checkUsername",
														"m": "get",
														"group": "Guest join"
													}
												],
												"post": [
													{
														"l": "Join and create an account",
														"v": "/join",
														"m": "post",
														"group": "Guest join"
													}
												]
											}
										},
										"My account": {
											"apis": [
												{
													"l": "Get user account information by username as (username or email)",
													"v": "/user",
													"m": "get",
													"group": "My account",
													"groupMain": true
												},
												{
													"l": "Change account's password by id",
													"v": "/account/password",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Change account's email by id",
													"v": "/account/email",
													"m": "put",
													"group": "My account"
												},
												{
													"l": "Edit account's information by id",
													"v": "/account",
													"m": "put",
													"group": "My account"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user account information by username as (username or email)",
														"v": "/user",
														"m": "get",
														"group": "My account",
														"groupMain": true
													}
												],
												"put": [
													{
														"l": "Change account's password by id",
														"v": "/account/password",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Change account's email by id",
														"v": "/account/email",
														"m": "put",
														"group": "My account"
													},
													{
														"l": "Edit account's information by id",
														"v": "/account",
														"m": "put",
														"group": "My account"
													}
												]
											}
										},
										"User administration": {
											"apis": [
												{
													"l": "Get user by id",
													"v": "/admin/user",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "List users matching certain keywords",
													"v": "/admin/users",
													"m": "get",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Get users count matching certain keywords",
													"v": "/admin/users/count",
													"m": "get",
													"group": "User administration"
												},
												{
													"l": "Add user",
													"v": "/admin/user",
													"m": "post",
													"group": "User administration"
												},
												{
													"l": "List users by Id",
													"v": "/admin/users/ids",
													"m": "post",
													"group": "User administration",
													"groupMain": true
												},
												{
													"l": "Delete user",
													"v": "/admin/user",
													"m": "delete",
													"group": "User administration"
												},
												{
													"l": "Edit user by id",
													"v": "/admin/user",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit user's groups by id, username, or email",
													"v": "/admin/user/groups",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Edit, reset, or delete user's pin information by id, username, or email",
													"v": "/admin/user/pin",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Change the status of a user by id",
													"v": "/admin/user/status",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Self Invite user by id or username as username or email",
													"v": "/admin/user/self/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "Invite users by id, username or email",
													"v": "/admin/users/invite",
													"m": "put",
													"group": "User administration"
												},
												{
													"l": "un-Invite users by id, username or email",
													"v": "/admin/users/uninvite",
													"m": "put",
													"group": "User administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get user by id",
														"v": "/admin/user",
														"m": "get",
														"group": "User administration"
													},
													{
														"l": "List users matching certain keywords",
														"v": "/admin/users",
														"m": "get",
														"group": "User administration",
														"groupMain": true
													},
													{
														"l": "Get users count matching certain keywords",
														"v": "/admin/users/count",
														"m": "get",
														"group": "User administration"
													}
												],
												"post": [
													{
														"l": "Add user",
														"v": "/admin/user",
														"m": "post",
														"group": "User administration"
													},
													{
														"l": "List users by Id",
														"v": "/admin/users/ids",
														"m": "post",
														"group": "User administration",
														"groupMain": true
													}
												],
												"delete": [
													{
														"l": "Delete user",
														"v": "/admin/user",
														"m": "delete",
														"group": "User administration"
													}
												],
												"put": [
													{
														"l": "Edit user by id",
														"v": "/admin/user",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit user's groups by id, username, or email",
														"v": "/admin/user/groups",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Edit, reset, or delete user's pin information by id, username, or email",
														"v": "/admin/user/pin",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Change the status of a user by id",
														"v": "/admin/user/status",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Self Invite user by id or username as username or email",
														"v": "/admin/user/self/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "Invite users by id, username or email",
														"v": "/admin/users/invite",
														"m": "put",
														"group": "User administration"
													},
													{
														"l": "un-Invite users by id, username or email",
														"v": "/admin/users/uninvite",
														"m": "put",
														"group": "User administration"
													}
												]
											}
										},
										"Group administration": {
											"apis": [
												{
													"l": "List all groups",
													"v": "/admin/groups",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Get group by id or code",
													"v": "/admin/group",
													"m": "get",
													"group": "Group administration"
												},
												{
													"l": "Add group",
													"v": "/admin/group",
													"m": "post",
													"group": "Group administration"
												},
												{
													"l": "Delete group",
													"v": "/admin/group",
													"m": "delete",
													"group": "Group administration"
												},
												{
													"l": "Edit group by id",
													"v": "/admin/group",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update environment(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/environments",
													"m": "put",
													"group": "Group administration"
												},
												{
													"l": "Update package(s) of group(s) by code(s) or id(s)",
													"v": "/admin/groups/packages",
													"m": "put",
													"group": "Group administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "List all groups",
														"v": "/admin/groups",
														"m": "get",
														"group": "Group administration"
													},
													{
														"l": "Get group by id or code",
														"v": "/admin/group",
														"m": "get",
														"group": "Group administration"
													}
												],
												"post": [
													{
														"l": "Add group",
														"v": "/admin/group",
														"m": "post",
														"group": "Group administration"
													}
												],
												"delete": [
													{
														"l": "Delete group",
														"v": "/admin/group",
														"m": "delete",
														"group": "Group administration"
													}
												],
												"put": [
													{
														"l": "Edit group by id",
														"v": "/admin/group",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update environment(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/environments",
														"m": "put",
														"group": "Group administration"
													},
													{
														"l": "Update package(s) of group(s) by code(s) or id(s)",
														"v": "/admin/groups/packages",
														"m": "put",
														"group": "Group administration"
													}
												]
											}
										},
										"Administration": {
											"apis": [
												{
													"l": "Get all users and groups of a main tenant",
													"v": "/admin/all",
													"m": "get",
													"group": "Administration"
												}
											],
											"apisRest": {
												"get": [
													{
														"l": "Get all users and groups of a main tenant",
														"v": "/admin/all",
														"m": "get",
														"group": "Administration"
													}
												]
											}
										},
										"Custom email": {
											"apis": [
												{
													"l": "Send custom email",
													"v": "/email",
													"m": "post",
													"group": "Custom email"
												}
											],
											"apisRest": {
												"post": [
													{
														"l": "Send custom email",
														"v": "/email",
														"m": "post",
														"group": "Custom email"
													}
												]
											}
										},
										"%v%": "3",
										"%showApi%": false
									}
								]
							}
						]
					},
					"product": {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [
							{
								"code": "TEST2_NEW",
								"name": "new package",
								"description": "this is a description for test 2 product new package",
								"aclTypeByEnv": {
									"dashboard": "granular"
								},
								"acl": {
									"dashboard": {
										"urac": {
											"3": {
												"access": false,
												"apisPermission": "restricted",
												"get": {
													"apis": {
														"/password/forgot": {
															"group": "My account guest",
															"access": false
														},
														"/emailToken": {
															"group": "My account guest",
															"access": true
														},
														"/validate/changeEmail": {
															"group": "My account guest",
															"access": true
														}
													}
												}
											}
										}
									}
								},
								"_TTL": 86400000
							}
						]
					},
					"package": {
						"code": "TEST2_NEW",
						"name": "new package",
						"description": "this is a description for test 2 product new package",
						"aclTypeByEnv": {
							"dashboard": "granular"
						},
						"acl": {
							"dashboard": {
								"urac": {
									"3": {
										"access": false,
										"apisPermission": "restricted",
										"get": {
											"apis": {
												"/password/forgot": {
													"group": "My account guest",
													"access": false
												},
												"/emailToken": {
													"group": "My account guest",
													"access": true
												},
												"/validate/changeEmail": {
													"group": "My account guest",
													"access": true
												}
											}
										}
									}
								}
							}
						},
						"_TTL": 86400000
					},
					"aclTypeByEnv": {
						"dashboard": "granular"
					}
				});
				done();
			});
		});
		
		it("Success - Get product scope - apiGroup restricted", (done) => {
			let inputMask = {
				id: '5f575ec295bb89628f3221d1',
				package: 'TEST2_NEW',
				config: {
					envs: ['dashboard'],
					type: "apiGroup"
				}
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getUIProductPackageAcl(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepEqual(acl, {
					"aclFill": {
						"DASHBOARD": {
							"urac": {
								"3": {
									"include": true,
									"collapse": false,
									"My account guest": {
										"get": true
									}
								}
							}
						}
					},
					"scopeFill": {
						"dashboard": {
							"urac": {
								"3": {
									"access": true,
									"apisPermission": "restricted",
									"get": [
										{
											"group": "My account guest",
											"apis": {
												"/password/forgot": {
													"access": false
												},
												"/emailToken": {
													"access": true
												},
												"/validate/changeEmail": {
													"access": true
												}
											}
										}
									]
								}
							}
						}
					},
					"paginations": {},
					"serviceGroup": [
						"Gateway"
					],
					"allServiceApis": [
						{
							"_id": "5ef23b834584f11f017b3def",
							"type": "service",
							"name": "urac",
							"versions": [
								{
									"version": "3",
									"apis": [
										{
											"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											"v": "/password/forgot",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "To validate user account after joining",
											"v": "/validate/join",
											"m": "get",
											"group": "Guest join"
										},
										{
											"l": "Check if a username as (username or email) is available or taken",
											"v": "/checkUsername",
											"m": "get",
											"group": "Guest join"
										},
										{
											"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											"v": "/emailToken",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "To validate change email",
											"v": "/validate/changeEmail",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "Get user account information by username as (username or email)",
											"v": "/user",
											"m": "get",
											"group": "My account",
											"groupMain": true
										},
										{
											"l": "Get user by id",
											"v": "/admin/user",
											"m": "get",
											"group": "User administration"
										},
										{
											"l": "List users matching certain keywords",
											"v": "/admin/users",
											"m": "get",
											"group": "User administration",
											"groupMain": true
										},
										{
											"l": "Get users count matching certain keywords",
											"v": "/admin/users/count",
											"m": "get",
											"group": "User administration"
										},
										{
											"l": "List all groups",
											"v": "/admin/groups",
											"m": "get",
											"group": "Group administration"
										},
										{
											"l": "Get group by id or code",
											"v": "/admin/group",
											"m": "get",
											"group": "Group administration"
										},
										{
											"l": "Get all users and groups of a main tenant",
											"v": "/admin/all",
											"m": "get",
											"group": "Administration"
										},
										{
											"l": "Send custom email",
											"v": "/email",
											"m": "post",
											"group": "Custom email"
										},
										{
											"l": "Join and create an account",
											"v": "/join",
											"m": "post",
											"group": "Guest join"
										},
										{
											"l": "Add user",
											"v": "/admin/user",
											"m": "post",
											"group": "User administration"
										},
										{
											"l": "List users by Id",
											"v": "/admin/users/ids",
											"m": "post",
											"group": "User administration",
											"groupMain": true
										},
										{
											"l": "Add group",
											"v": "/admin/group",
											"m": "post",
											"group": "Group administration"
										},
										{
											"l": "Delete group",
											"v": "/admin/group",
											"m": "delete",
											"group": "Group administration"
										},
										{
											"l": "Delete user",
											"v": "/admin/user",
											"m": "delete",
											"group": "User administration"
										},
										{
											"l": "Reset password",
											"v": "/password/reset",
											"m": "put",
											"group": "My account guest"
										},
										{
											"l": "Change account's password by id",
											"v": "/account/password",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Change account's email by id",
											"v": "/account/email",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Edit account's information by id",
											"v": "/account",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Edit user by id",
											"v": "/admin/user",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit user's groups by id, username, or email",
											"v": "/admin/user/groups",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit, reset, or delete user's pin information by id, username, or email",
											"v": "/admin/user/pin",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Change the status of a user by id",
											"v": "/admin/user/status",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit group by id",
											"v": "/admin/group",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Update environment(s) of group(s) by code(s) or id(s)",
											"v": "/admin/groups/environments",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Update package(s) of group(s) by code(s) or id(s)",
											"v": "/admin/groups/packages",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Self Invite user by id or username as username or email",
											"v": "/admin/user/self/invite",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Invite users by id, username or email",
											"v": "/admin/users/invite",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "un-Invite users by id, username or email",
											"v": "/admin/users/uninvite",
											"m": "put",
											"group": "User administration"
										}
									]
								}
							],
							"configuration": {
								"subType": "soajs",
								"group": "Gateway"
							},
							"src": {
								"provider": "github",
								"owner": "soajs",
								"repo": "soajs.multituracenant"
							}
						}
					],
					"allServiceApisGranular": {},
					"product": {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [
							{
								"code": "TEST2_NEW",
								"name": "new package",
								"description": "this is a description for test 2 product new package",
								"acl": {
									"dashboard": {
										"urac": [
											{
												"version": "3",
												"get": [
													"My account guest"
												]
											}
										]
									}
								},
								"_TTL": 86400000
							}
						]
					},
					"package": {
						"code": "TEST2_NEW",
						"name": "new package",
						"description": "this is a description for test 2 product new package",
						"acl": {
							"dashboard": {
								"urac": [
									{
										"version": "3",
										"get": [
											"My account guest"
										]
									}
								]
							}
						},
						"_TTL": 86400000
					},
					"aclTypeByEnv": {},
					"fixList": {
						"dashboard": {
							"Gateway": {
								"urac": {
									"3": {
										"apisPermission": "restricted",
										"My account guest": [
											"get"
										]
									}
								}
							}
						}
					}
				});
				done();
			});
		});
		
		it("Success - Get product scope - apiGroup", (done) => {
			let inputMask = {
				id: '5f575ec295bb89628f3221d1',
				package: 'TEST2_NEW',
				config: {
					envs: ['dashboard'],
					type: "apiGroup"
				}
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getUIProductPackageAcl(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepEqual(acl, {
					"aclFill": {
						"DASHBOARD": {
							"urac": {
								"3": {
									"include": true,
									"collapse": false,
									"My account guest": {
										"get": true
									}
								}
							}
						}
					},
					"scopeFill": {
						"dashboard": {
							"urac": {
								"3": {
									"access": true,
									"get": [
										{
											"group": "My account guest",
											"apis": {
												"/password/forgot": {
													"access": false
												},
												"/emailToken": {
													"access": true
												},
												"/validate/changeEmail": {
													"access": true
												}
											}
										}
									]
								}
							}
						}
					},
					"paginations": {},
					"serviceGroup": [
						"Gateway"
					],
					"allServiceApis": [
						{
							"_id": "5ef23b834584f11f017b3def",
							"type": "service",
							"name": "urac",
							"versions": [
								{
									"version": "3",
									"apis": [
										{
											"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											"v": "/password/forgot",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "To validate user account after joining",
											"v": "/validate/join",
											"m": "get",
											"group": "Guest join"
										},
										{
											"l": "Check if a username as (username or email) is available or taken",
											"v": "/checkUsername",
											"m": "get",
											"group": "Guest join"
										},
										{
											"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											"v": "/emailToken",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "To validate change email",
											"v": "/validate/changeEmail",
											"m": "get",
											"group": "My account guest"
										},
										{
											"l": "Get user account information by username as (username or email)",
											"v": "/user",
											"m": "get",
											"group": "My account",
											"groupMain": true
										},
										{
											"l": "Get user by id",
											"v": "/admin/user",
											"m": "get",
											"group": "User administration"
										},
										{
											"l": "List users matching certain keywords",
											"v": "/admin/users",
											"m": "get",
											"group": "User administration",
											"groupMain": true
										},
										{
											"l": "Get users count matching certain keywords",
											"v": "/admin/users/count",
											"m": "get",
											"group": "User administration"
										},
										{
											"l": "List all groups",
											"v": "/admin/groups",
											"m": "get",
											"group": "Group administration"
										},
										{
											"l": "Get group by id or code",
											"v": "/admin/group",
											"m": "get",
											"group": "Group administration"
										},
										{
											"l": "Get all users and groups of a main tenant",
											"v": "/admin/all",
											"m": "get",
											"group": "Administration"
										},
										{
											"l": "Send custom email",
											"v": "/email",
											"m": "post",
											"group": "Custom email"
										},
										{
											"l": "Join and create an account",
											"v": "/join",
											"m": "post",
											"group": "Guest join"
										},
										{
											"l": "Add user",
											"v": "/admin/user",
											"m": "post",
											"group": "User administration"
										},
										{
											"l": "List users by Id",
											"v": "/admin/users/ids",
											"m": "post",
											"group": "User administration",
											"groupMain": true
										},
										{
											"l": "Add group",
											"v": "/admin/group",
											"m": "post",
											"group": "Group administration"
										},
										{
											"l": "Delete group",
											"v": "/admin/group",
											"m": "delete",
											"group": "Group administration"
										},
										{
											"l": "Delete user",
											"v": "/admin/user",
											"m": "delete",
											"group": "User administration"
										},
										{
											"l": "Reset password",
											"v": "/password/reset",
											"m": "put",
											"group": "My account guest"
										},
										{
											"l": "Change account's password by id",
											"v": "/account/password",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Change account's email by id",
											"v": "/account/email",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Edit account's information by id",
											"v": "/account",
											"m": "put",
											"group": "My account"
										},
										{
											"l": "Edit user by id",
											"v": "/admin/user",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit user's groups by id, username, or email",
											"v": "/admin/user/groups",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit, reset, or delete user's pin information by id, username, or email",
											"v": "/admin/user/pin",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Change the status of a user by id",
											"v": "/admin/user/status",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Edit group by id",
											"v": "/admin/group",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Update environment(s) of group(s) by code(s) or id(s)",
											"v": "/admin/groups/environments",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Update package(s) of group(s) by code(s) or id(s)",
											"v": "/admin/groups/packages",
											"m": "put",
											"group": "Group administration"
										},
										{
											"l": "Self Invite user by id or username as username or email",
											"v": "/admin/user/self/invite",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "Invite users by id, username or email",
											"v": "/admin/users/invite",
											"m": "put",
											"group": "User administration"
										},
										{
											"l": "un-Invite users by id, username or email",
											"v": "/admin/users/uninvite",
											"m": "put",
											"group": "User administration"
										}
									]
								}
							],
							"configuration": {
								"subType": "soajs",
								"group": "Gateway"
							},
							"src": {
								"provider": "github",
								"owner": "soajs",
								"repo": "soajs.multituracenant"
							}
						}
					],
					"allServiceApisGranular": {},
					"product": {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [
							{
								"code": "TEST2_NEW",
								"name": "new package",
								"description": "this is a description for test 2 product new package",
								"acl": {
									"dashboard": {
										"urac": [
											{
												"version": "3",
												"get": [
													"My account guest"
												]
											}
										]
									}
								},
								"_TTL": 86400000
							}
						]
					},
					"package": {
						"code": "TEST2_NEW",
						"name": "new package",
						"description": "this is a description for test 2 product new package",
						"acl": {
							"dashboard": {
								"urac": [
									{
										"version": "3",
										"get": [
											"My account guest"
										]
									}
								]
							}
						},
						"_TTL": 86400000
					},
					"aclTypeByEnv": {},
					"fixList": {
						"dashboard": {
							"Gateway": {
								"urac": {
									"3": {
										"My account guest": [
											"get",
											"put"
										],
										"Guest join": [
											"get",
											"post"
										],
										"My account": [
											"get",
											"put"
										],
										"User administration": [
											"get",
											"post",
											"delete",
											"put"
										],
										"Group administration": [
											"get",
											"post",
											"delete",
											"put"
										],
										"Administration": [
											"get"
										],
										"Custom email": [
											"post"
										]
									}
								}
							}
						}
					}
				});
				done();
			});
		});
		
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.getUIProductPackageAcl(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.getUIProductPackageAcl(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 460);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.getUIProductPackageAcl(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				package: 'TEST2_NEW',
				config: {
					envs: ['dashboard'],
					type: "apiGroup"
				},
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			
			BL.getUIProductPackageAcl(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				package: 'TEST2_NEW',
				config: {
					envs: ['dashboard'],
					type: "apiGroup"
				},
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getUIProductPackageAcl(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 503);
				done();
			});
		});
	});
	
	describe("Testing Get product ACL Package preview service", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			nock.cleanAll();
			done();
		});
		
		it("Success - Get product scope - granular", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				mainEnv: 'dashboard',
				secEnv: 'stage',
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint'], "start": 0,
					"limit": 500})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getPackagesPreviewService(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, {
					"package": "TEST2_NEW",
					"product": "TEST2",
					"acl": [
						{
							"service": "urac",
							"version": "3",
							"envs": {
								"dashboard": true,
								"stage": true
							},
							"restriction": {
								"dashboard": true,
								"stage": true
							},
							"access": {
								"dashboard": false,
								"stage": false
							}
						}
					],
					"aclTypeByEnv": {
						"dashboard": "granular",
						"stage": "granular"
					}
				});
				done();
			});
		});
		
		it("fail - Get product scope - not granular", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				mainEnv: 'dashboard',
				secEnv: 'stage',
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint'], "start": 0,
					"limit": 500})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getPackagesPreviewService(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepStrictEqual(err.code, 480);
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.getPackagesPreviewService(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.getPackagesPreviewService(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 461);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.getPackagesPreviewService(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEWS',
				mainEnv: 'dev',
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			
			BL.getPackagesPreviewService(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEWS',
				mainEnv: 'dev',
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"packages": []
					});
				}
			};
			
			BL.getPackagesPreviewService(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				mainEnv: 'dev',
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getPackagesPreviewService(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 503);
				done();
			});
		});
	});
	
	describe("Testing Get product ACL Package preview api", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			nock.cleanAll();
			done();
		});
		
		it("Success - Get product scope - granular", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				mainEnv: 'dashboard',
				secEnv: 'stage',
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint'], "start": 0,
					"limit": 500})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getPackagesPreviewApi(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, {
					"package": "TEST2_NEW",
					"product": "TEST2",
					"acl": [
						{
							"service": "urac",
							"version": "3",
							"group": "My account guest",
							"method": "get",
							"api": "/password/forgot",
							"envs": {
								"dashboard": true,
								"stage": true
							},
							"access": {
								"dashboard": false,
								"stage": false
							},
							"restriction": {
								"dashboard": true,
								"stage": true
							}
						},
						{
							"service": "urac",
							"version": "3",
							"group": "My account guest",
							"method": "get",
							"api": "/emailToken",
							"envs": {
								"dashboard": true,
								"stage": true
							},
							"access": {
								"dashboard": true,
								"stage": true
							},
							"restriction": {
								"dashboard": true,
								"stage": true
							}
						},
						{
							"service": "urac",
							"version": "3",
							"group": "My account guest",
							"method": "get",
							"api": "/validate/changeEmail",
							"envs": {
								"dashboard": true,
								"stage": true
							},
							"access": {
								"dashboard": true,
								"stage": true
							},
							"restriction": {
								"dashboard": true,
								"stage": true
							}
						}
					],
					"aclTypeByEnv": {
						"dashboard": "granular",
						"stage": "granular"
					}
				});
				done();
			});
		});
		
		it("fail - Get product scope - not granular", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				mainEnv: 'dashboard',
				secEnv: 'stage',
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint'], "start": 0,
					"limit": 500})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getPackagesPreviewApi(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepStrictEqual(err.code, 480);
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.getPackagesPreviewApi(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.getPackagesPreviewApi(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 461);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.getPackagesPreviewApi(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEWS',
				mainEnv: 'dev',
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			
			BL.getPackagesPreviewApi(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEWS',
				mainEnv: 'dev',
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"packages": []
					});
				}
			};
			
			BL.getPackagesPreviewApi(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				mainEnv: 'dev',
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getPackagesPreviewApi(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 503);
				done();
			});
		});
	});
	
	describe("Testing Get product ACL Scope preview service", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			nock.cleanAll();
			done();
		});
		
		it("Success - Get product scope - granular", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				mainEnv: 'dashboard',
				secEnv: 'stage',
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint'], "start": 0,
					"limit": 500})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								},
								"stage": {
									"urac": {
										"3": {
											"access": true,
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": false
														},
														"/validate/changeEmail": {
															"access": false
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getScopePreviewService(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, {
					"product": "TEST2",
					"acl": [
						{
							"service": "urac",
							"version": "3",
							"envs": {
								"dashboard": true,
								"stage": true
							},
							"restriction": {
								"dashboard": true,
								"stage": false
							},
							"access": {
								"dashboard": true,
								"stage": true
							}
						}
					]
				});
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.getScopePreviewService(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.getScopePreviewService(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 460);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.getScopePreviewService(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				mainEnv: 'dev',
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getScopePreviewService(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 503);
				done();
			});
		});
	});
	
	describe("Testing Get product ACL Scope preview api", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			nock.cleanAll();
			done();
		});
		
		it("Success - Get product scope - granular", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				mainEnv: 'dashboard',
				secEnv: 'stage',
			};
			nock('http://www.example.com')
				.get('/items/type/all')
				.query({"types": ['service', 'endpoint'], "start": 0,
					"limit": 500})
				.reply(200, {
					"result": true,
					"data": {
						records: [{
							_id: "5ef23b834584f11f017b3def",
							type: "service",
							name: "urac",
							versions: [
								{
									version: "3",
									apis: [
										{
											l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
											v: "/password/forgot",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate user account after joining",
											v: "/validate/join",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if a username as (username or email) is available or taken",
											v: "/checkUsername",
											m: "get",
											group: "Guest join"
										},
										{
											l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
											v: "/emailToken",
											m: "get",
											group: "My account guest"
										},
										{
											l: "To validate change email",
											v: "/validate/changeEmail",
											m: "get",
											group: "My account guest"
										},
										{
											l: "Get user account information by username as (username or email)",
											v: "/user",
											m: "get",
											group: "My account",
											groupMain: true
										},
										{
											l: "Get user by id",
											v: "/admin/user",
											m: "get",
											group: "User administration"
										},
										{
											l: "List users matching certain keywords",
											v: "/admin/users",
											m: "get",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Get users count matching certain keywords",
											v: "/admin/users/count",
											m: "get",
											group: "User administration"
										},
										{
											l: "List all groups",
											v: "/admin/groups",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get group by id or code",
											v: "/admin/group",
											m: "get",
											group: "Group administration"
										},
										{
											l: "Get all users and groups of a main tenant",
											v: "/admin/all",
											m: "get",
											group: "Administration"
										},
										{
											l: "Send custom email",
											v: "/email",
											m: "post",
											group: "Custom email"
										},
										{
											l: "Join and create an account",
											v: "/join",
											m: "post",
											group: "Guest join"
										},
										{
											l: "Add user",
											v: "/admin/user",
											m: "post",
											group: "User administration"
										},
										{
											l: "List users by Id",
											v: "/admin/users/ids",
											m: "post",
											group: "User administration",
											groupMain: true
										},
										{
											l: "Add group",
											v: "/admin/group",
											m: "post",
											group: "Group administration"
										},
										{
											l: "Delete group",
											v: "/admin/group",
											m: "delete",
											group: "Group administration"
										},
										{
											l: "Delete user",
											v: "/admin/user",
											m: "delete",
											group: "User administration"
										},
										{
											l: "Reset password",
											v: "/password/reset",
											m: "put",
											group: "My account guest"
										},
										{
											l: "Change account's password by id",
											v: "/account/password",
											m: "put",
											group: "My account"
										},
										{
											l: "Change account's email by id",
											v: "/account/email",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit account's information by id",
											v: "/account",
											m: "put",
											group: "My account"
										},
										{
											l: "Edit user by id",
											v: "/admin/user",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit user's groups by id, username, or email",
											v: "/admin/user/groups",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit, reset, or delete user's pin information by id, username, or email",
											v: "/admin/user/pin",
											m: "put",
											group: "User administration"
										},
										{
											l: "Change the status of a user by id",
											v: "/admin/user/status",
											m: "put",
											group: "User administration"
										},
										{
											l: "Edit group by id",
											v: "/admin/group",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update environment(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/environments",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Update package(s) of group(s) by code(s) or id(s)",
											v: "/admin/groups/packages",
											m: "put",
											group: "Group administration"
										},
										{
											l: "Self Invite user by id or username as username or email",
											v: "/admin/user/self/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "Invite users by id, username or email",
											v: "/admin/users/invite",
											m: "put",
											group: "User administration"
										},
										{
											l: "un-Invite users by id, username or email",
											v: "/admin/users/uninvite",
											m: "put",
											group: "User administration"
										}
									],
								}
							],
							configuration: {
								subType: "soajs",
								group: "Gateway",
							},
							src: {
								provider: "github",
								owner: "soajs",
								repo: "soajs.multituracenant"
							}
						}]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								},
								"stage": {
									"urac": {
										"3": {
											"access": true,
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": false
														},
														"/validate/changeEmail": {
															"access": false
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getScopePreviewApi(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, {
					"product": "TEST2",
					"acl": [
						{
							"service": "urac",
							"version": "3",
							"group": "My account guest",
							"method": "get",
							"api": "/password/forgot",
							"envs": {
								"dashboard": true,
								"stage": true
							},
							"access": {
								"dashboard": false,
								"stage": false
							},
							"restriction": {
								"dashboard": true,
								"stage": false
							}
						},
						{
							"service": "urac",
							"version": "3",
							"group": "My account guest",
							"method": "get",
							"api": "/emailToken",
							"envs": {
								"dashboard": true,
								"stage": true
							},
							"access": {
								"dashboard": true,
								"stage": false
							},
							"restriction": {
								"dashboard": true,
								"stage": false
							}
						},
						{
							"service": "urac",
							"version": "3",
							"group": "My account guest",
							"method": "get",
							"api": "/validate/changeEmail",
							"envs": {
								"dashboard": true,
								"stage": true
							},
							"access": {
								"dashboard": true,
								"stage": false
							},
							"restriction": {
								"dashboard": true,
								"stage": false
							}
						}
					]
				});
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.getScopePreviewApi(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.getScopePreviewApi(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 460);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.getScopePreviewApi(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				mainEnv: 'dev',
				soajs: true,
			};
			nock('http://www.example.com')
				.get('/soajs/items')
				.query({"types": ['service', 'endpoint']})
				.reply(200, {
					"result": false,
					"errors": {
						"details": [
							{
								"code": 1,
								"message": "error 1"
							},
							{
								"code": 2,
								"message": "error 2"
							}
						]
					}
				});
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				}
			};
			
			BL.getScopePreviewApi(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 503);
				done();
			});
		});
	});
	
	describe("Testing update package inside Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		let inputMask = {
			"code": "TPROD_EXAMPLE03",
			"id": "SomeProductID",
			"name": "PACK_NAME3",
			"description": "Pack Description after update",
			"_TTL": 86400000,
			"acl": {},
			"tags": [
				"some", "to", "test"
			]
		};
		
		it("Success - update package - data", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.updatePackage(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepEqual(result, "product package TPROD_EXAMPLE03 updated successfully");
				done();
			});
		});
		
		it("Success - update package  - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"code": "TPROD",
					"name": "Test Product",
					"description": "this is a description for test product",
					"packages": [
						{
							"code": "TPROD_BASIC",
							"name": "basic package",
							"description": "this is a description for test product basic package",
							"acl": {
								"urac": {},
								"multitenant": {}
							},
							"_TTL": 86400000 // 24 hours
						},
						{
							"code": "TPROD_EXAMPLE03",
							"name": "example03 package",
							"description": "this is a description for test product example03 package",
							"acl": {
								"urac": {},
								"example03": {}
							},
							"_TTL": 86400000 // 24 hours
						}
					]
				});
			};
			
			Product.prototype.updateProduct = (data, cb) => {
				return cb(null, true);
			};
			
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.updatePackage(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record, "product package TPROD_EXAMPLE03 updated successfully");
				done();
			});
		});
		
		it("Fails - update package - data - no packages in record", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product"
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.updatePackage(soajs, inputMask, (err) => {
				assert.ok(err, {
					code: 461,
					msg: soajs.config.errors[461]
				});
				done();
			});
		});
		
		it("Fails - update package - null data", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				},
				updateProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.updatePackage(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajs.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - update package - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.updateProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.updatePackage(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajsClient.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - update package - getProduct error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.updatePackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - update package - no record error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.updatePackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - update package - locked record error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, {
						locked: true,
						console: true
					});
				}
			};
			BL.updatePackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - update package - data - package not found", (done) => {
			let inputmaskData = {
				"code": "NOTFND",
				"id": "SomeProductID",
				"name": "PACK_NAME2",
				"description": "Pack Description new",
				"_TTL": 12,
				"tags": [
					"some", "to", "test"
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.updatePackage(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 461,
					msg: soajs.config.errors[461]
				});
				done();
			});
		});
		
		it("Fails - update package - updateProduct error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.updatePackage(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
	});
	
	describe("Testing update package acl inside Product by env", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		let inputMask = {
			"code": "TPROD_EXAMPLE03",
			"id": "SomeProductID",
			"acl": {},
			"env": "dashboard"
		};
		
		it("Success - update package - data", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.updatePackageAclByEnv(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepEqual(result, "product package TPROD_EXAMPLE03 updated successfully");
				done();
			});
		});
		
		it("Success - update package  - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"code": "TPROD",
					"name": "Test Product",
					"description": "this is a description for test product",
					"packages": [
						{
							"code": "TPROD_BASIC",
							"name": "basic package",
							"description": "this is a description for test product basic package",
							"acl": {
								"urac": {},
								"multitenant": {}
							},
							"_TTL": 86400000 // 24 hours
						},
						{
							"code": "TPROD_EXAMPLE03",
							"name": "example03 package",
							"description": "this is a description for test product example03 package",
							"acl": {
								"urac": {},
								"example03": {}
							},
							"_TTL": 86400000 // 24 hours
						}
					]
				});
			};
			
			Product.prototype.updateProduct = (data, cb) => {
				return cb(null, true);
			};
			
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.updatePackageAclByEnv(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record, "product package TPROD_EXAMPLE03 updated successfully");
				done();
			});
		});
		
		it("Fails - update package - data - no packages in record", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product"
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.updatePackageAclByEnv(soajs, inputMask, (err) => {
				assert.ok(err, {
					code: 461,
					msg: soajs.config.errors[461]
				});
				done();
			});
		});
		
		it("Fails - update package - null data", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				},
				updateProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.updatePackageAclByEnv(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajs.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - update package - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.updateProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.updatePackageAclByEnv(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajsClient.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - update package - getProduct error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.updatePackageAclByEnv(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - update package - no record error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.updatePackageAclByEnv(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - update package - locked record error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, {
						locked: true,
						console: true
					});
				}
			};
			BL.updatePackageAclByEnv(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - update package - data - package not found", (done) => {
			let inputmaskData = {
				"code": "NOTFND",
				"id": "SomeProductID",
				"acl": {},
				"env": "dashboard"
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.updatePackageAclByEnv(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 461,
					msg: soajs.config.errors[461]
				});
				done();
			});
		});
		
		it("Fails - update package - updateProduct error", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.updatePackageAclByEnv(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
	});
	
	describe("Testing delete package inside Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - delete package - data", (done) => {
			let inputMask = {
				id: "Some",
				code: "TPROD_EXAMPLE03",
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"_id": "Some",
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.deletePackage(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepEqual(result, "product package TPROD_EXAMPLE03 deleted successfully");
				done();
			});
		});
		
		it("Success - delete package  - client tenant", (done) => {
			let inputMask = {
				id: "Some",
				code: "TPROD_EXAMPLE03",
			};
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find product",
						601: "Model not found"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"code": "TPROD",
					"name": "Test Product",
					"description": "this is a description for test product",
					"packages": [
						{
							"code": "TPROD_BASIC",
							"name": "basic package",
							"description": "this is a description for test product basic package",
							"acl": {
								"urac": {},
								"multitenant": {}
							},
							"_TTL": 86400000 // 24 hours
						},
						{
							"code": "TPROD_EXAMPLE03",
							"name": "example03 package",
							"description": "this is a description for test product example03 package",
							"acl": {
								"urac": {},
								"example03": {}
							},
							"_TTL": 86400000 // 24 hours
						}
					]
				});
			};
			
			Product.prototype.updateProduct = (data, cb) => {
				return cb(null, true);
			};
			
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.deletePackage(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("Fails - delete package - null data", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				},
				updateProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.deletePackage(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajs.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - delete package - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing"
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					},
					debug: () => {
						console.log();
					},
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.updateProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.deletePackage(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 400,
					msg: soajsClient.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - delete package - getProduct error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.deletePackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - delete package - no record error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.deletePackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - delete package - record no packages error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, {
						"_id": "sd"
					});
				}
			};
			BL.deletePackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 461,
					msg: soajs.config.errors[461]
				});
				done();
			});
		});
		
		it("Fails - delete package - locked record error", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(null, {
						locked: true,
						console: true
					});
				}
			};
			BL.deletePackage(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - delete package - data - package not found", (done) => {
			let inputmaskData = {
				"code": "NOTFND",
				"id": "SomeProductID",
				"name": "PACK_NAME2",
				"description": "Pack Description new",
				"_TTL": 12,
				"tags": [
					"some", "to", "test"
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(null, true);
				}
			};
			BL.deletePackage(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 461,
					msg: soajs.config.errors[461]
				});
				done();
			});
		});
		
		it("Fails - delete package - updateProduct error", (done) => {
			let inputMask = {
				id: "Some",
				code: "TPROD_EXAMPLE03",
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TPROD",
						"name": "Test Product",
						"description": "this is a description for test product",
						"packages": [
							{
								"code": "TPROD_BASIC",
								"name": "basic package",
								"description": "this is a description for test product basic package",
								"acl": {
									"urac": {},
									"multitenant": {}
								},
								"_TTL": 86400000 // 24 hours
							},
							{
								"code": "TPROD_EXAMPLE03",
								"name": "example03 package",
								"description": "this is a description for test product example03 package",
								"acl": {
									"urac": {},
									"example03": {}
								},
								"_TTL": 86400000 // 24 hours
							}
						]
					});
				},
				updateProduct: (data, cb) => {
					return cb(true, null);
				}
			};
			BL.deletePackage(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing Update product ACL Scope preview service", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			done();
		});
		
		it("Success - update product scope", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				env: 'dashboard',
				acl: [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								},
								"stage": {
									"urac": {
										"3": {
											"access": true,
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": false
														},
														"/validate/changeEmail": {
															"access": false
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updateScope: (inputMask, cb) => {
					return cb(null, true);
				},
			};
			
			BL.updateScopePreviewService(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepStrictEqual(result, "Product Acl Updated!");
				done();
			});
		});
		
		it("Success - update product scope empty", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				env: 'dashboard',
				acl: [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product."
					});
				},
				updateScope: (inputMask, cb) => {
					return cb(null, true);
				},
			};
			
			BL.updateScopePreviewService(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepStrictEqual(result, "Product Acl Updated!");
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.updateScopePreviewService(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.updateScopePreviewService(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 460);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.updateScopePreviewService(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - update product", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				env: 'dashboard',
				acl: [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dev": true
						},
						"restriction": {
							"dev": true
						},
						"access": {
							"dev": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dev": false
						},
						"restriction": {
							"dev": true
						},
						"access": {
							"dev": true
						},
					}
				]
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updateScope: (inputMask, cb) => {
					return cb(true, true);
				},
			};
			
			BL.updateScopePreviewService(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 470);
				done();
			});
		});
	});
	
	describe("Testing Update product ACL Scope preview api", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			done();
		});
		
		it("Success - update product scope", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				env: 'dashboard',
				acl: [
					{
						"service": "urac",
						"version": "3",
						"group": "NEW",
						"method": "put",
						"api": "/password/forgot/no",
						"envs": {
							"dashboard": true
						},
						"access": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": true
						},
					},
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/emailToken",
						"envs": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
					},
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/validate/changeEmail",
						"envs": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								},
								"stage": {
									"urac": {
										"3": {
											"access": true,
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": false
														},
														"/validate/changeEmail": {
															"access": false
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updateScope: (inputMask, cb) => {
					return cb(null, true);
				},
			};
			
			BL.updateScopePreviewApi(soajs, inputMask, (err, result) => {
				assert.ok(result);
				assert.deepStrictEqual(result, "Product Acl Updated!");
				done();
			});
		});
		
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.updateScopePreviewApi(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.updateScopePreviewApi(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 460);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.updateScopePreviewApi(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - update product", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				env: 'dashboard',
				acl: [
				
				]
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updateScope: (inputMask, cb) => {
					return cb(true, true);
				},
			};
			
			BL.updateScopePreviewApi(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 470);
				done();
			});
		});
	});
	
	describe("Testing Update product ACL Package preview service", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			nock.cleanAll();
			done();
		});
		
		it("Success - Update ", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updatePackageACL: (inputMask, cb) => {
					return cb(null, true);
				},
			};
			
			BL.updatePackagesPreviewService(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, "Product Package Acl Updated!");
				done();
			});
		});
		
		it("Success - Update empty", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updatePackageACL: (inputMask, cb) => {
					return cb(null, true);
				},
			};
			
			BL.updatePackagesPreviewService(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, "Product Package Acl Updated!");
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.updatePackagesPreviewService(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.updatePackagesPreviewService(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 461);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.updatePackagesPreviewService(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			
			BL.updatePackagesPreviewService(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"packages": []
					});
				}
			};
			
			BL.updatePackagesPreviewService(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updatePackageACL: (inputMask, cb) => {
					return cb(true, true);
				},
			};
			
			BL.updatePackagesPreviewService(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 470);
				done();
			});
		});
	});
	
	describe("Testing Update product ACL Package preview api", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.model = null;
			nock.cleanAll();
			done();
		});
		
		it("Success - Update ", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/password/forgot",
						"envs": {
							"dashboard": true
						},
						"access": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": true
						},
					},
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/emailToken",
						"envs": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
					},
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/validate/changeEmail",
						"envs": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"acl": {
								"dashboard": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
								"stage": {
									"urac": {
										"3" :{
											"access": false,
											"apisPermission": "restricted",
											"get": {
												"apis": {
													"/password/forgot": {
														"group": "My account guest",
														"access": false
													},
													"/emailToken": {
														"group": "My account guest",
														"access": true
													},
													"/validate/changeEmail": {
														"group": "My account guest",
														"access": true
													}
												}
											}
										}
									}
								},
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updatePackageACL: (inputMask, cb) => {
					return cb(null, true);
				},
			};
			
			BL.updatePackagesPreviewApi(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, "Product Package Acl Updated!");
				done();
			});
		});
		
		it("Success - Update empty", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/password/forgot",
						"envs": {
							"dashboard": true
						},
						"access": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": true
						},
					},
					{
						"service": "urac",
						"version": "3",
						"group": "My account",
						"method": "put",
						"api": "/emailToken/lady",
						"envs": {
							"dashboard": false
						},
						"access": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
					},
					{
						"service": "urac",
						"version": "3",
						"group": "My account guest",
						"method": "get",
						"api": "/validate/changeEmail",
						"envs": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": false
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"aclTypeByEnv": {
								"dashboard": "granular",
								"stage": "granular"
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updatePackageACL: (inputMask, cb) => {
					return cb(null, true);
				},
			};
			
			BL.updatePackagesPreviewApi(soajs, inputMask, (err, acl) => {
				assert.ok(acl);
				assert.deepStrictEqual(acl, "Product Package Acl Updated!");
				done();
			});
		});
		
		it("Fail - Get product - no inputmaskData", (done) => {
			BL.updatePackagesPreviewApi(soajs, null, (err) => {
				assert.deepEqual(err.code, 400);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - no record", (done) => {
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(false, null);
				}
			};
			BL.updatePackagesPreviewApi(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 461);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - error in mongo", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.updatePackagesPreviewApi(soajs, {id: "found"}, (err) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			
			BL.updatePackagesPreviewApi(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"packages": []
					});
				}
			};
			
			BL.updatePackagesPreviewApi(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 461);
				done();
			});
		});
		
		it("Fail - Get product packages", (done) => {
			let inputMask = {
				productCode: 'TEST2',
				packageCode: 'TEST2_NEW',
				env: 'dashboard',
				"acl": [
					{
						"service": "urac",
						"version": "3",
						"envs": {
							"dashboard": true
						},
						"restriction": {
							"dashboard": true
						},
						"access": {
							"dashboard": true
						},
					},
					{
						"service": "multitenant",
						"version": "1",
						"envs": {
							"dashboard": false
						},
						"restriction": {
							"dashboard": false
						},
						"access": {
							"dashboard": false
						},
					}
				]
			};
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "TEST2",
						"name": "not Console UI Product",
						"description": "This is the main Console UI Product.",
						"scope": {
							"acl": {
								"dashboard": {
									"urac": {
										"3": {
											"access": true,
											"apisPermission": "restricted",
											"get": [
												{
													"group": "My account guest",
													"apis": {
														"/password/forgot": {
															"access": false
														},
														"/emailToken": {
															"access": true
														},
														"/validate/changeEmail": {
															"access": true
														}
													}
												}
											]
										}
									}
								}
							}
						},
						"packages": [{
							"code": "TEST2_NEW",
							"name": "new package",
							"description": "this is a description for test 2 product new package",
							"acl": {
								"dashboard": {
									"urac": [
										{
											"version": "3",
											"get": [
												"My account guest",
											]
										}
									]
								}
							},
							"_TTL": 86400000 // 24 hours
						}]
					});
				},
				updatePackageACL: (inputMask, cb) => {
					return cb(true, true);
				},
			};
			
			BL.updatePackagesPreviewApi(soajs, inputMask, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 470);
				done();
			});
		});
	});
});
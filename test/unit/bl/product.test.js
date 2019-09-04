"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/product.js');
const assert = require('assert');

let products;

describe("Unit test for: BL - product", () => {
	
	let soajs = {
		config: {
			"errors": {
				426: 'Invalid Product ID provided',
				430: "Tenant not found for this user",
				436: "Unable to find tenants",
				460: "Unable to find products",
				468: "Product already exists",
				469: "Unable to add the product record",
				473: "Missing required field: name",
				474: "Missing required field: either id or code",
				601: "Model not found"
			},
			"console": {
				"product": "DSBRD"
			},
		},
		log: {
			error: () => {
				console.log();
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
			BL.list(soajs, null, soajs.config, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Success - List products - null data - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.listProducts = (data, cb) => {
				return cb(null, []);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.list(soajsClient, null, soajsClient.config, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Fails - List products - null config", (done) => {
			BL.modelObj = {
				listProducts: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.list(soajs, null, soajs.config, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - List products - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
			BL.list(soajsClient, null, soajsClient.config, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
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
			BL.listConsole(soajs, null, soajs.config, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Success - List console products - null data - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
			
			BL.listConsole(soajsClient, null, soajsClient.config, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Fails - List console products - null config", (done) => {
			BL.modelObj = {
				listConsoleProducts: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.listConsole(soajs, null, soajs.config, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});
		
		it("Fails - List console products - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
			BL.listConsole(soajsClient, null, soajsClient.config, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
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
				code: "DSBRD"
			};
			
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code": "DSBRD",
						"name": "Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				}
			};
			BL.get(soajs, inputMask, soajs.config, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Console UI Product");
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
						"id": "testid",
						"name": "Console UI Product",
						"description": "This is the main Console UI Product.",
					});
				},
				validateId: (inputMask, cb) => {
					return cb(null, "testid");
				}
			};
			BL.get(soajs, inputMask, soajs.config, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Console UI Product");
				done();
			});
		});
		
		it("Fails - Get product - null data", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.get(soajs, null, soajs.config, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Success - Get product - code - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(null, {
					"code": "DSBRD",
					"name": "Console UI Product",
					"description": "This is the main Console UI Product.",
				});
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			let inputMask = {
				code: "DSBRD"
			};
			
			BL.get(soajsClient, inputMask, soajsClient.config, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Console UI Product");
				done();
			});
		});
		
		it("Success - Get product - id - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"id": "testid",
					"name": "Console UI Product",
					"description": "This is the main Console UI Product.",
				});
			};
			Product.prototype.validateId = (inputMask, cb) => {
				return cb(null, "testid");
			};
			
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			let inputMask = {
				id: "testid"
			};
			
			BL.get(soajsClient, inputMask, soajsClient.config, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Console UI Product");
				done();
			});
		});
		
		it("Fail - Get product - null data - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.validateId = (data, cb) => {
				return cb(true, "notfound");
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			BL.get(soajsClient, {id: "notfound"}, soajsClient.config, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.validateId = (data, cb) => {
				return cb(true, "notfound");
			};
			Product.prototype.closeConnection = () => {
			};
			
			BL.model = Product;
			
			BL.get(soajsClient, {id: "notfound"}, soajsClient.config, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - mongo error when getting product", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.getProduct = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.validateId = (data, cb) => {
				return cb(null, "found");
			};
			Product.prototype.closeConnection = () => {
			};
			
			BL.model = Product;
			
			BL.get(soajsClient, {id: "found"}, soajsClient.config, (err, record) => {
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
		
		it("Success - Add product - code, name", (done) => {
			let inputMask = {
				code: "TESTP",
				name: "Test Product"
			};
			
			BL.modelObj = {
				addProduct: (inputMask, cb) => {
					return cb(null, true);
				},
				checkIfExist: (inputMask, cb) => {
					return cb(null, 0);
				}
			};
			BL.add(soajs, inputMask, soajs.config, (err, record) => {
				assert.ok(record);
				console.log(record);
				done();
			});
		});
		
		it("Fails - Add product - Product Already Exist", (done) => {
			let inputMask = {
				code: 'DSBRD',
				name: 'Main Product'
			};
			
			BL.modelObj = {
				addProduct: (inputMask, cb) => {
					return cb(null, true);
				},
				checkIfExist: (inputMask, cb) => {
					return cb(null, 1);
				}
			};
			BL.add(soajs, inputMask, soajs.config, (err, record) => {
				assert.ok(err);
				console.log(err);
				assert.deepEqual(err.code, 468);
				done();
			});
		});
		
		it("Fails - Add product - Product Already Exist with tenant client", (done) => {
			let inputMask = {
				code: 'DSBRD',
				name: 'Main Product'
			};
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
			BL.add(soajsClient, inputMask, soajs.config, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 468);
				done();
			});
		});
		
		it("Fails - Add product - mongo error check if exists", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
					}
				}
			};
			let inputMask = {
				code: 'DSBRD',
				name: 'Main Product'
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
			BL.add(soajsClient, inputMask, soajs.config, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 474);
				done();
			});
		});
		
		it("Fails - Add product - mongo error when adding product", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
					}
				}
			};
			let inputMask = {
				code: 'DSBRD',
				name: 'Main Product'
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
			BL.add(soajsClient, inputMask, soajs.config, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 469);
				done();
			});
		});
		
		it("Success - Add product - code - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						460: "Unable to find products",
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
				return cb(null, 0);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			
			let inputMask = {
				code: "TEST2",
				name: "Test 2 Product"
			};
			
			BL.add(soajsClient, inputMask, soajsClient.config, (err, record) => {
				assert.ok(record);
				done();
			});
		});
	});
	
});
"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/product.js');
const assert = require('assert');

let products;

describe("Unit test for: BL - product", () => {
	
	let soajs = {
		config: {
			"errors": {
				423: "An id must be provided",
				426: 'Invalid Product ID provided',
				430: "Tenant not found for this user",
				436: "Unable to find tenants",
				460: "Unable to find product",
				466: "You are not allowed to remove the product you are currently logged in with",
				468: "Product already exists",
				469: "Unable to add the product record",
				474: "Missing required field: either id or code",
				475: "Unable to remove product record",
				477: "Invalid product code provided",
				500: "This record is locked. You cannot modify or delete it",
				601: "Model not found"
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
			
			BL.list(soajsClient, null, (err, records) => {
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
			BL.list(soajs, null, (err, records) => {
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
			BL.listConsole(soajs, null, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Success - List console products - null data - client tenant", (done) => {
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
		
		it("Fails - List console products - null config", (done) => {
			BL.modelObj = {
				listConsoleProducts: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.listConsole(soajs, null, (err, records) => {
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
			BL.get(soajs, inputMask, (err, record) => {
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
				}
			};
			BL.get(soajs, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Console UI Product");
				done();
			});
		});
		
		// it("Fails - Get product - null data", (done) => {
		// 	BL.modelObj = {
		// 		getProduct: (nullObject, cb) => {
		// 			return cb(true, null);
		// 		}
		// 	};
		// 	BL.get(soajs, null, (err, record) => {
		// 		assert.ok(err);
		// 		done();
		// 	});
		// });
		
		it("Success - Get product - code - client tenant", (done) => {
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
			
			BL.get(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Console UI Product");
				done();
			});
		});
		
		it("Success - Get product - id - client tenant", (done) => {
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
			
			BL.get(soajsClient, {id: "notfound"}, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - client tenant", (done) => {
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
			
			BL.get(soajsClient, {id: "notfound"}, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fail - Get product - mongo error when getting product", (done) => {
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
			
			BL.get(soajsClient, {id: "found"}, (err, record) => {
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
			BL.add(soajs, inputMask, (err, record) => {
				assert.ok(record);
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
			BL.add(soajs, inputMask, (err, record) => {
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
			BL.add(soajsClient, inputMask, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 468);
				done();
			});
		});
		
		it("Fails - Add product - mongo error check if exists", (done) => {
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
			BL.add(soajsClient, inputMask, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 474);
				done();
			});
		});
		
		it("Fails - Add product - mongo error when adding product", (done) => {
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
			BL.add(soajsClient, inputMask, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 469);
				done();
			});
		});
		
		it("Success - Add product - code - client tenant", (done) => {
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
			
			BL.add(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
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
				done();
			});
		});

		// it("Fails - Delete product - valid id", (done) => {
		// 	let inputMask = {
		// 		id: "someID",
		// 	};
		//
		// 	BL.modelObj = {
		// 		deleteProduct: (inputMask, cb) => {
		// 			return cb(true, null);
		// 		},
		// 		getProduct: (inputMask, cb) => {
		// 			return cb(true, null);
		// 		}
		// 	};
		// 	BL.delete(soajs, inputMask, (err, record) => {
		// 		assert.ok(err);
		// 		done();
		// 	});
		// });

		// it("Fails - Delete product - valid id no record", (done) => {
		// 	let inputMask = {
		// 		id: "someID",
		// 	};
		//
		// 	BL.modelObj = {
		// 		deleteProduct: (inputMask, cb) => {
		// 			return cb(true, null);
		// 		},
		// 		getProduct: (inputMask, cb) => {
		// 			return cb(null, null);
		// 		}
		// 	};
		// 	BL.delete(soajs, inputMask, (err, record) => {
		// 		assert.ok(err);
		// 		done();
		// 	});
		// });

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
			BL.delete(soajs, inputMask, (err, record) => {
				assert.ok(err);
				done();
			});
		});

		it("Fails - Delete product - Tenant product", (done) => {
			let inputMask = {
				code: "DSBRD",
			};

			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.delete(soajs, inputMask, (err, record) => {
				assert.ok(err);
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
						locked: true
					});
				}
			};
			BL.delete(soajs, inputMask, (err, record) => {
				assert.ok(err);
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
			BL.delete(soajs, inputMask, (err, record) => {
				assert.ok(err);
				done();
			});
		});

		it("Fails - Delete product - no code and id", (done) => {
			let inputMask = {
			};

			BL.modelObj = {
				deleteProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.delete(soajs, inputMask, (err, record) => {
				assert.ok(err);
				done();
			});
		});

		it("Fails - Update product - code no record", (done) => {
			let inputMask = {
				code: "someCode",
			};

			BL.modelObj = {
				updateProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.update(soajs, inputMask, (err, record) => {
				assert.ok(err);
				done();
			});
		});

		it("Fails - Delete product - not record id", (done) => {
			let inputMask = {
				id: "NOTVALID",
			};

			BL.modelObj = {
				updateProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			BL.update(soajs, inputMask, (err, record) => {
				assert.ok(err);
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
				id: "SOMEID",
				name: "Some Name",
				description: "A desc to update product"
			};

			BL.modelObj = {
				updateProduct: (inputMask, cb) => {
					return cb(null, true);
				},
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"name": "Some Product",
						"description": "This is Some Product.",
					});
				}
			};
			BL.update(soajs, inputMask, (err, record) => {
				assert.ok(record);
				done();
			});
		});

		it("Fails - Update product - no data", (done) => {
			let inputMask = {
			};

			BL.modelObj = {
				updateProduct: (inputMask, cb) => {
					return cb(true, null);
				},
				getProduct: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			BL.update(soajs, inputMask, (err, record) => {
				assert.ok(err);
				done();
			});
		});
	});

	// describe("Testing Update Scope Product", () => {
	// 	afterEach((done) => {
	// 		BL.modelObj = null;
	// 		done();
	// 	});
	//
	// });

	describe("Testing list all packages inside Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});

		let inputMask = {
			id: "ID"
		};

		it("Success - List packages - null data", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
						"code" : "TPROD",
						"name" : "Test Product",
						"description" : "this is a description for test product",
						"packages" : [
							{
								"code" : "TPROD_BASIC",
								"name" : "basic package",
								"description" : "this is a description for test product basic package",
								"acl" : {
									"urac" : {},
									"multitenant" : {}
								},
								"_TTL" : 86400000 // 24 hours
							},
							{
								"code" : "TPROD_EXAMPLE03",
								"name" : "example03 package",
								"description" : "this is a description for test product example03 package",
								"acl" : {
									"urac" : {},
									"example03" : {}
								},
								"_TTL" : 86400000 // 24 hours
							}
						]
					});
				}
			};
			BL.listPackages(soajs, inputMask, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});

		it("Success - List packages  - client tenant", (done) => {
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
					}
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
					"code" : "TPROD",
					"name" : "Test Product",
					"description" : "this is a description for test product",
					"packages" : [
						{
							"code" : "TPROD_BASIC",
							"name" : "basic package",
							"description" : "this is a description for test product basic package",
							"acl" : {
								"urac" : {},
								"multitenant" : {}
							},
							"_TTL" : 86400000 // 24 hours
						},
						{
							"code" : "TPROD_EXAMPLE03",
							"name" : "example03 package",
							"description" : "this is a description for test product example03 package",
							"acl" : {
								"urac" : {},
								"example03" : {}
							},
							"_TTL" : 86400000 // 24 hours
						}
					]
				});
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;

			BL.listPackages(soajsClient, inputMask, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});

		it("Fails - List packages - null config", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.listPackages(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});

		it("Fails - List packages - error - client tenant", (done) => {
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
			BL.listPackages(soajsClient, null, (err, records) => {
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

	describe("Testing get package inside Product", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});

		let inputMask = {
			packageCode: "TPROD_BASIC",
			productCode: "TPROD",
		};

		it("Success - get package - null data", (done) => {
			BL.modelObj = {
				getProduct: (inputMask, cb) => {
					return cb(null, {
								"code" : "TPROD_BASIC",
								"name" : "basic package",
								"description" : "this is a description for test product basic package",
								"acl" : {
									"urac" : {},
									"multitenant" : {}
								},
								"_TTL" : 86400000 // 24 hours
					});
				}
			};
			BL.getPackage(soajs, inputMask, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
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
					}
				}
			};

			function Product() {
				console.log("Product");
			}

			Product.prototype.getProduct = (inputMask, cb) => {
				return cb(null, {
					"code" : "TPROD_BASIC",
					"name" : "basic package",
					"description" : "this is a description for test product basic package",
					"acl" : {
						"urac" : {},
						"multitenant" : {}
					},
					"_TTL" : 86400000 // 24 hours
				});
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;

			BL.getPackage(soajsClient, inputMask, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});

		it("Fails - get package - null config", (done) => {
			BL.modelObj = {
				getProduct: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.getPackage(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {
					code: 460,
					msg: soajs.config.errors[460]
				});
				done();
			});
		});

		it("Fails - get package - error - client tenant", (done) => {
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
			BL.getPackage(soajsClient, null, (err, records) => {
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

});
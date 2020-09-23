
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
let addProductSchema = require("../schemas/addProduct.js");
let getProductSchema = require("../schemas/getProduct.js");

describe("Testing add product API", () => {
    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	let addedProduct = null;
    it("Success - will add product ", (done) => {
        let params = {
            body: {
                name: 'SOME',
                code: 'SOMEC',
                description: 'Will add due test',
                scope: {
                    acl: {
                        dashboard: {
                            multitenant: {
                                "1": {
                                    access: false,
                                    get: [
                                        {
                                            "/product": {
                                                access: false
                                            },
                                            group: 'Product'
                                        }
                                    ]
                                },
                                "2.1" : {
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
                            },
                            urac: {
                                "1.0": {
                                    access: false,
                                    get: [
                                        {
                                            "/user": {
                                                access: false
                                            },
                                            group: 'Admin'
                                        }
                                    ]
                                }
                            }
                        },
	                    dev: {
		                    multitenant: {
			                    "1": {
			                    	apisPermission : "restricted",
				                    access: false,
				                    get: [
					                    {
						                    "/product": {
							                    access: false
						                    },
						                    group: 'Product'
					                    }
				                    ]
			                    },
			                    "2.1" : {
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
            }
        };
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.deepEqual(body.data.name, 'SOME');
            assert.deepEqual(body.data.code, 'SOMEC');
            assert.deepEqual(typeof body.data.scope.acl, "object");
            let check = validator.validate(body, addProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
	        addedProduct = body.data;
            done();
        });
    });
	
	it("Success - will add console product ", (done) => {
		let params = {
			body: {
				name: 'lola',
				code: 'lucky',
				description: 'Will add due test',
				scope: {
					acl: {
						dashboard: {
							multitenant: {
								"1": {
									access: false,
									get: [
										{
											"/product": {
												access: false
											},
											group: 'Product'
										}
									]
								},
								"2.1" : {
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
							},
							urac: {
								"1.0": {
									access: false,
									get: [
										{
											"/user": {
												access: false
											},
											group: 'Admin'
										}
									]
								}
							}
						},
						dev: {
							multitenant: {
								"1": {
									apisPermission : "restricted",
									access: false,
									get: [
										{
											"/product": {
												access: false
											},
											group: 'Product'
										}
									]
								},
								"2.1" : {
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
			}
		};
		requester('/product/console', 'post', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.deepEqual(body.data.name, 'lola');
			assert.deepEqual(body.data.code, 'lucky');
			assert.deepEqual(typeof body.data.scope.acl, "object");
			let check = validator.validate(body, addProductSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - validate added product ", (done) => {
		let params = {
			qs: {
				id : addedProduct._id.toString()
			}
		};
		requester('/product', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.deepEqual(body.data.name, 'SOME');
			assert.deepEqual(body.data.code, 'SOMEC');
			let check = validator.validate(body, getProductSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});

    it("Fails - will add product - wrong scope", (done) => {
        let params = {
            body: {
                name: 'PRODS',
                code: 'SOMEQ',
                description: 'Will add due test',
                scope: {
                    acl: {
                        dashboard: {
                            multitenant: {
                                "1": {
                                    access: false,
                                    get: [
                                        {
                                            "/product": {
                                                access: {}
                                            },
                                            group: 'Product'
                                        }
                                    ]
                                },
                                "2-1" : {
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
                            },
                            urac: {
                                "1.0": {
                                    access: {},
                                    get: [
                                        {
                                            "/user": {
                                                access: false
                                            },
                                            group: 'Admin'
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        };
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors);
            let check = validator.validate(body, addProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will add product no scope", (done) => {
        let params = {
            body: {
                name: 'SOME2',
                code: 'SOME2',
                description: 'Will add product with no scope'
            }
        };
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.deepEqual(body.data.scope, {acl: {}});
            let check = validator.validate(body, addProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
	        addedProduct = body.data;
            done();
        });
    });
	
	it("Success - validate added product with no scope", (done) => {
		let params = {
			qs: {
				id : addedProduct._id.toString()
			}
		};
		requester('/product', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.deepEqual(body.data.name, 'SOME2');
			assert.deepEqual(body.data.code, 'SOME2');
			let check = validator.validate(body, getProductSchema);
			assert.deepEqual(check.valid, true);
			assert.deepEqual(check.errors, []);
			done();
		});
	});
	
    it("Fail - will not add - wrong object", (done) => {
        let params = {
            body: {
                product: "{\n" +
                    "            code: 'CODET',\n" +
                    "            description: 'Will not add due to input error'\n" +
                    "        }"
            }
        };
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, addProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not add - no name", (done) => {
        let params = {
            body: {
                code: 'CODET',
                description: 'Will not add due to non-existance of name'
            }
        };
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, addProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not add - no data", (done) => {
        let params = {};
        requester('/product', 'post', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, addProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});

"use strict";
const assert = require('assert');
let request = require("request");

let extKey = 'aa39b5490c4a4ed0e56d7ec1232a428f771e8bb83cfcee16de14f735d0f5da587d5968ec4f785e38570902fd24e0b522b46cb171872d1ea038e88328e7d973ff47d9392f72b2d49566209eb88eb60aed8534a965cf30072c39565bd8d72f68ac';

function requester(apiName, method, params, cb) {
    let options = {
        uri: 'http://127.0.0.1:4000/multitenant' + apiName,
        headers: {
            key: extKey
        },
        method: method.toUpperCase(),
        json: true
    };

    if (params.headers) {
        for (let header in params.headers) {
            if (Object.hasOwnProperty.call(params.headers, header)) {
                options.headers[header] = params.headers[header];
            }
        }
    }
    if (params.form) {
        options.form = params.form;
    }
    if (params.qs) {
        options.qs = params.qs;
    }
    if (method === 'delete') {
        request.del(options, function (error, response, body) {
            assert.ifError(error);
            assert.ok(body);
            return cb(null, body);
        });
    } else {
        request[method](options, function (error, response, body) {
            assert.ifError(error);
            assert.ok(body);
            return cb(null, body);
        });
    }
}

describe("starting product integration tests", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    describe("Testing list products API", () => {
        it("Success - will return all product records", (done) => {
            let params = {};
            requester('/products', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.data);
                assert.ok(body.data.length > 0);
                done();
            });
        });

        it("Fail - will not return all product records - wrong request - no params", (done) => {
            let params = {};
            requester('/products', 'post', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
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
                done();
            });
        });

        it("Fail - will not return all product records - wrong request - no params", (done) => {
            let params = {};
            requester('/products/console', 'post', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

    describe("Testing get product API", () => {
        it("Success - will return product record", (done) => {
            let params = {
                qs: {
                    code: 'DSBRD'
                }
            };
            requester('/product', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.data);
                done();
            });
        });

        it("Fail - will not return product record - wrong request", (done) => {
            let params = {};
            requester('/product', 'post', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

    describe("Testing add product API", () => {
        it("Success - will return ", (done) => {
            let params = {
                form: {
                    name: 'SOME',
                    code: 'SOMEC'
                }
            };
            requester('/product', 'post', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                done();
            });
        });

        it("Fail - will not return - no name", (done) => {
            let params = {};
            requester('/product', 'post', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

    describe("Testing update product API", () => {
        let prods = [];
        it("Success - will return all product records", (done) => {
            let params = {};
            requester('/products', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.data);
                prods = body.data;
                assert.ok(body.data.length > 0);
                done();
            });
        });
        it("Success - will update ", (done) => {
            let params = {
                qs: {
                    id: prods[1]._id
                }
            };
            requester('/product', 'put', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                done();
            });
        });

        it("Fail - will not update - no params", (done) => {
            let params = {};
            requester('/product', 'put', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

    /*describe("Testing purge product API", () => {
        let prods = [];
        it("Success - will return all product records", (done) => {
            let params = {};
            requester('/products', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                prods = body.data;
                assert.ok(body.data);
                assert.ok(body.data.length > 0);
                done();
            });
        });
        it("Success - will purge product", (done) => {
            let params = {
                qs: {
                    id: prods[2]._id,
                },
                form: {
                    description: "product Description after update",
                }
            };
            requester('/product/purge', 'put', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                console.log("sis", body.errors);
                // assert.ok(body.data);
                // assert.ok(body.data.length > 0);
                done();
            });
        });

        it("Fail - will not purge product - no params", (done) => {
            let params = {};
            requester('/product/purge', 'put', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });*/

    describe("Testing delete product API", () => {
        it("Success - will delete ", (done) => {
            let params = {
                qs: {
                    code: 'SOMEC'
                }
            };
            requester('/product', 'delete', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                done();
            });
        });

        it("Fail - will not delete - no params", (done) => {
            let params = {};
            requester('/product', 'delete', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

    describe("Testing List Packages API", () => {
    let prods = [];
        it("Success - will return all product records", (done) => {
            let params = {};
            requester('/products', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.data);
                    prods = body.data;
                assert.ok(body.data.length > 0);
                done();
            });
        });
        it("Success - will return all packages of product records ", (done) => {
            let params = {
                qs: {
                    id: prods[0]._id
                }
            };
            requester('/product/packages', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                done();
            });
        });

        it("Fail - will not will return all packages of product records - no params", (done) => {
            let params = {};
            requester('/product', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

    describe("Testing get Package API", () => {
        it("Success - will get a product package ", (done) => {
            let params = {
                qs: {
                    packageCode: 'DSBRD_GUEST',
                    productCode: 'DSBRD'
                }
            };
            requester('/product/package', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                done();
            });
        });

        it("Fail - will not get a product package - no params", (done) => {
            let params = {};
            requester('/product', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

    describe("Testing Add Package API", () => {
        let prods = [];
        it("Success - will return all product records", (done) => {
            let params = {};
            requester('/products', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                prods = body.data;
                assert.ok(body.data);
                prods = body.data;
                assert.ok(body.data.length > 0);
                done();
            });
        });
        it("Success - will add product package", (done) => {
            let params = {
                qs: {
                    id: prods[0]._id
                },
                form: {
                    name: "PACK_NAME",
                    code: "NEWS",
                    description: "Pack Description",
                    acl: {
                        urac: {
                            access: false,
                        },
                        dashboard: {
                            access: [
                                "devop"
                            ],
                            apis: {

                            }
                        }
                    },
                    _TTL: 48
                }
            };
            requester('/product/package', 'post', params, (error, body) => {
                console.log("Some error:", body.errors);
                assert.ifError(error);
                assert.ok(body);
                console.log("Anything", body.errors);
                // assert.ok(body.data);
                // assert.ok(body.data.length > 0);
                done();
            });
        });

        it("Fail - will not add package to product - no params", (done) => {
            let params = {};
            requester('/product/package', 'post', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

    /*describe("Testing Update Package API", () => {
        let prods = [];
        it("Success - will return all product records", (done) => {
            let params = {};
            requester('/products', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                prods = body.data;
                assert.ok(body.data);
                prods = body.data;
                assert.ok(body.data.length > 0);
                done();
            });
        });
        it("Success - will update product package", (done) => {
            let params = {
                qs: {
                    id: prods[0]._id,
                    code: "TPROD_PACK_NAME"
                },
                form: {
                    name: "PACK_NAME2",
                    description: "Pack Description after update",
                    _TTL: 86400000,
                    acl: {
                        urac: {
                            access: false,
                            apis: {

                            }
                        },
                        dashboard: {
                            access: [
                                "devop"
                            ],
                            apis: {

                            }
                        }
                    }
                }
            };
            requester('/product/package', 'put', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.data);
                assert.ok(body.data.length > 0);
                done();
            });
        });

        it("Fail - will not add package to product - no params", (done) => {
            let params = {};
            requester('/product/package', 'put', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });*/

    describe("Testing delete Package API", () => {
    let prods = [];
        it("Success - will return all product records", (done) => {
            let params = {};
            requester('/products', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.data);
                prods = body.data;
                assert.ok(body.data.length > 0);
                done();
            });
        });
        it("Success - will delete package from product ", (done) => {
            let params = {
                qs: {
                    id: prods[1]._id,
                    packageCode: 'TEST'
                }
            };
            requester('/product/package', 'delete', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                done();
            });
        });

        it("Fail - will not delete package from product - no params", (done) => {
            let params = {};
            requester('/product', 'delete', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

});
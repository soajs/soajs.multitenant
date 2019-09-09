"use strict";
const assert = require('assert');
const requester = require('../../requester');

    /*describe("Testing purge product API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

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
"use strict";

describe("Starting Unit test", () => {

    before((done) => {
        done();
    });

    it("Unit test for BL", (done) => {
        require("./bl/index.test.js");
        require("./bl/product.test.js");
        require("./bl/tenant.test.js");
        done();
    });

    it("Unit test for Model", (done) => {
        require("./model/mongo/product.test.js");
        require("./model/mongo/tenant.test.js");
        done();
    });

    after((done) => {
        done();
    });

});
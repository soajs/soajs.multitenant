"use strict";

const shell = require('shelljs');
const assert = require('assert');
let sampleData = {};

describe("Starting Unit test", () => {

    before((done) => {
        done();
    });

    it("Unit test for BL", (done) => {
        // require("./bl/index.js");
        require("./bl/product.js");
        require("./bl/tenant.js");
        done();
    });

    it("Unit test for Model", (done) => {
        // require("./model/mongo/product.js");
        // require("./model/mongo/tenant.js");
        done();
    });

    after((done) => {
        done();
    });

});